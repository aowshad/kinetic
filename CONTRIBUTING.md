# Contributing

```bash
npm install
npm run dev      # gallery at http://localhost:5173/kinetic/
```

`npm run build` type-checks, bundles, then pre-renders every route to static
HTML — that last step drives a real browser, so run `npx playwright install
chromium` once before your first build.

## Adding an animation

One folder per animation, under its category. Nothing needs registering: the
catalog is globbed from disk by [`src/animations/registry.ts`](src/animations/registry.ts),
so the folder *is* the registration.

```
src/animations/<category>/<id>/
  meta.ts       # required — the AnimationModule
  gsap.ts       # required — the GSAP implementation
  vanilla.ts    # the zero-dependency implementation, unless vanilla is 'none'
  style.css     # optional — CSS the copied snippet needs to work
```

`<category>` is one of `entrance`, `kinetic`, `scroll`, `hover`, `loop`, `exit`,
and `<id>` is kebab-case and becomes the URL: `/kinetic/a/<id>/`.

### The module

`meta.ts` default-exports an [`AnimationModule`](src/lib/types.ts):

```ts
const blurIn: AnimationModule = {
  id: 'blur-in',                 // matches the folder name; also the route
  name: 'Blur In',
  category: 'entrance',
  roles: ['heading', 'paragraph', 'label'],   // roles[0] is what the stage renders
  tags: ['split', 'blur'],                    // descriptive; 'scramble' is load-bearing
  blurb: 'Characters sharpen into focus as they fade in from a blur.',
  defaults: { duration: 0.5, stagger: 0.02, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText'],        // GSAP plugins, shown as badges
  reducedMotion: 'settle',
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}
```

Both implementations share one signature — set up, then return a teardown that
puts the element back exactly as it was found:

```ts
export const run: AnimationImpl = (el, o, onComplete) => { /* … */ return () => {} }
```

Most of `tags` is descriptive, but `'scramble'` is behaviour: it raises the
reduced-motion duration floor from 0.01s to 0.35s, because GSAP's
`ScrambleTextPlugin` measures `revealDelay` in absolute seconds, so a
near-zero duration would leave the text permanently scrambled instead of
resolved. Tag any scramble-style animation accordingly.

`reducedMotion` says what happens under `prefers-reduced-motion: reduce`.
`'settle'` plays once, near-instantly, landing on the real end state — the
right answer for anything with a duration. `'skip'` never runs at all, and is
only correct when the animation repeats forever (a near-zero duration would
strobe rather than stop) or is scroll-position-driven (there is no duration to
shrink). Both the live preview and the emitted snippets read this same field,
so they cannot drift apart.

### The vanilla tier

`vanilla` is the honesty field, and the reason this gallery exists. It is not a
label to pick optimistically:

- **`'full'`** — indistinguishable with or without GSAP.
- **`'partial'`** — runs without GSAP but loses something specific. Requires
  `vanillaNote` naming exactly what, and where. The seven scroll animations are
  `'partial'` because browsers without
  [View Timeline](https://developer.mozilla.org/en-US/docs/Web/API/ViewTimeline)
  fall back to an `IntersectionObserver` and scrub visibly coarser.
- **`'none'`** — no zero-dependency equivalent exists yet. Omit `vanilla.ts`
  and explain why in `vanillaNote`.

Write `vanilla.ts` against the Web Animations API and the helpers in
`src/lib/` — `splitChars` for grapheme-safe splitting, `easeAt` /
`EASE_POINTS` for easing, `scrollScrub` for scroll-linked timelines. Don't
import GSAP there, not even for a curve: eases are pre-sampled into CSS
`linear()` literals in [`src/lib/linearEases.ts`](src/lib/linearEases.ts). If
you add an ease that isn't already in `src/lib/eases.ts`, regenerate that map
with `toLinearEase()` and check the result in.

### Emit markers

The code panel shows the literal source of the file that powers the preview,
so implementations carry three sentinels that [`src/lib/emit.ts`](src/lib/emit.ts)
reads. Keep them or the copied snippet breaks:

- `// #region body` / `// #endregion body` — wrap the part that gets emitted.
  Everything outside is repo plumbing — including any helper constant or
  function you declare at the top of the file, which the snippet will then
  call without defining. Declare helpers inside the region.
- `// @internal` — drop this line from the snippet (typically the
  `onComplete?.()` call, which only the gallery needs). It drops exactly one
  line, so keep the whole statement on it: a chain split across lines keeps
  every line but the last.
- `// @emit: <replacement>` — emit this line as `<replacement>` instead, for
  stripping TypeScript from plain-JS output.

`o.duration`, `o.stagger`, `o.delay` and `o.ease` are substituted with the
visitor's current control values, so reference them directly rather than
destructuring them into locals.

Before opening a PR, check your animation on its detail page at
`/kinetic/a/<id>/`, in **both** engine tabs, with reduced motion on and off,
and confirm `npm run lint` and `npm run build` pass.

## Recording the gifs

The README gifs are generated, never hand-made:

```bash
npm run gifs                    # all 45 into docs/gifs/
npm run gifs -- --only blur-in  # just yours
```

It records each animation from the running site and palette-quantises a gif
per animation. `--from-cache` re-encodes from the cached webm without driving
the browser again, and `--headed` lets you watch it work. Only commit the gif
for the animation you added.

Each animation also has a 1200×630 social card in `public/og/`, used as its
`og:image` so a shared link unfurls with the animation rather than bare text:

```bash
npm run og -- --only blur-in
```

The card is the detail page with its chrome hidden, caught partway through the
animation — so it inherits the site's own type and colour, and shows the
effect mid-flight instead of resolved text that looks like every other card.
