# Kinetic

A gallery of 45 GSAP-powered text animations, each with a live preview and a
copy-paste code snippet. Static site, no backend.

**[Live demo →](https://aowshad.github.io/kinetic/)**

## What's here

- **45 animations across 6 categories** — entrance (12), kinetic (10),
  scroll (7), hover (8), loop (5), exit (3).
- **Live, editable preview** — type anything into the sample text field and
  every animation re-runs with your own words.
- **Real code, not a demo of a demo** — each card's code panel renders the
  literal source file that powers its own preview, emitted as either plain
  Vanilla JS or a React component, with your current duration/stagger/delay/
  ease baked in.
- **Live controls** — duration, stagger, delay, and ease (with a visual curve
  picker) all update the running preview immediately.
- **Search and filter** — by category, by text role (heading, button, link,
  counter, …), or by keyword.
- **Light/dark theme**, following the system by default.

## Categories

| Category | Trigger | Count |
|---|---|---|
| Entrance | plays once when scrolled into view | 12 |
| Kinetic | plays once, or loops in place | 10 |
| Scroll | scrubbed directly to scroll position (`ScrollTrigger`) | 7 |
| Hover | plays on pointer enter/focus | 8 |
| Loop | repeats forever | 5 |
| Exit | plays once, ending hidden | 3 |

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
