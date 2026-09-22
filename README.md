# Kinetic

Most text animations don't need a library. 45 of these 45 run on the Web
Animations API with zero dependencies — 38 with full fidelity, 7 with minor
caveats on older browsers — and every card tells you which is which, and
exactly what you give up on the rest.

**[Live demo →](https://aowshad.github.io/kinetic/)**

## Why this exists

Every other GSAP text-animation gallery assumes the dependency and never
asks whether it was needed. GSAP core is ~25kb gzipped before you add a
single plugin; the Web Animations API this site's zero-dependency snippets
run on ships in every browser already, at 0kb. For a landing page with one
heading reveal, that ratio is the whole argument — GSAP earns its place on
the animations that genuinely need it (nested scroll-linked bursts, a
handful of scroll effects that need real ScrollTrigger smoothing on older
Safari), and loses it everywhere else.

## What's here

- **45 animations across 6 categories** — entrance (12), kinetic (10),
  scroll (7), hover (8), loop (5), exit (3).
- **Every card is honest about its dependency** — a `No deps` badge means
  the GSAP and zero-dependency versions are visually indistinguishable; `No
  deps*` means it runs without GSAP but with a stated caveat (see its code
  panel); a filter toggle shows only the animations that need nothing at
  all — which today is every single one.
- **Four code tabs** — `JS` (zero-dependency, self-contained, no imports),
  `JS + GSAP`, `React`, and `Source`. Copy the `JS` tab into a blank HTML
  file with no build step and no packages — it runs.
- **Live, editable preview** — type anything into the sample text field and
  every animation re-runs with your own words.
- **Real code, not a demo of a demo** — each tab renders the literal source
  file that powers its own preview, with your current
  duration/stagger/delay/ease baked in as literals.
- **Live controls** — duration, stagger, delay, and ease (with a visual
  curve picker) all update the running preview immediately.
- **Search and filter** — by category, by text role (heading, button, link,
  counter, …), by dependency, or by keyword.
- **Light/dark theme**, following the system by default.

## Categories

| Category | Trigger | Count |
|---|---|---|
| Entrance | plays once when scrolled into view | 12 |
| Kinetic | plays once, or loops in place | 10 |
| Scroll | scrubbed directly to scroll position | 7 |
| Hover | plays on pointer enter/focus | 8 |
| Loop | repeats forever | 5 |
| Exit | plays once, ending hidden | 3 |

## How the zero-dependency path works

- **Easing** — every ease (including ones with no single-curve CSS
  equivalent, like `elastic.out` and `bounce.out`) is sampled ahead of time
  into a CSS [`linear()`](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear)
  function, precomputed and checked in as literals — nothing in the
  zero-dependency path calls into GSAP to compute a curve at runtime.
- **Text splitting** — a small grapheme-aware helper (`Intl.Segmenter`, not
  naive string spreading, so combining marks and family emoji survive
  intact) replaces `SplitText` for the animations that split by character
  or word, and is inlined directly into the emitted snippet.
- **Scroll effects** — use the native
  [View Timeline API](https://developer.mozilla.org/en-US/docs/Web/API/ViewTimeline)
  where supported (genuinely smoother than `ScrollTrigger`'s scrub, since
  it's driven entirely by the compositor with no JS in the per-frame loop),
  falling back to an `IntersectionObserver` on older browsers — the reason
  those 7 are `No deps*` rather than `No deps`.

## Stack

Vite + React + TypeScript, Tailwind v4, GSAP 3.15 (SplitText, ScrambleTextPlugin,
ScrollTrigger, TextPlugin, CustomEase — all free as of GSAP 3.13).

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and
publishes `dist/` to GitHub Pages. In the repo settings, set
**Settings → Pages → Source → GitHub Actions**. The site is served from
`/kinetic/` (see `base` in `vite.config.ts`) — if the repo is renamed, update
that value to match.
