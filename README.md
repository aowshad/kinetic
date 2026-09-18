# Kinetic

A gallery of GSAP-powered text animations, each with a live preview and a
copy-paste code snippet. Static site, no backend.

## Status

**Milestone 1** — scaffold, animation contract, and the registry's raw-source
pairing, proven across three categories:

- `char-fade-up` (entrance) — SplitText chars fade + rise in
- `scramble` (kinetic) — ScrambleTextPlugin locks into the final text
- `text-roll` (hover) — two stacked copies swap on pointer enter/leave

Edit the sample text at the top of the page to see every animation re-run
with your own words. Each card's code panel renders the literal source file
that powers its preview — no hand-written duplicate snippet.

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
