#!/usr/bin/env node
/**
 * Renders a 1200x630 social preview per animation into public/og/.
 *
 * Link unfurlers don't animate a gif, so each card is a single still caught
 * partway through the animation — far enough in that the effect is legible
 * (blurred, scattered, scrambled), not so far that it has already resolved
 * into plain text that looks like every other card.
 *
 * The cards are the real detail page with the chrome hidden, rather than a
 * separate template, so they inherit the site's own type, colour and spacing
 * and can't drift out of sync with it.
 *
 * Usage:
 *   node scripts/capture-og.mjs                 # all animations + the home card
 *   node scripts/capture-og.mjs --only blur-in  # one, by id (repeatable)
 *   node scripts/capture-og.mjs --home          # just the home card
 *   node scripts/capture-og.mjs --headed        # watch it work
 */
import { mkdir, readdir, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { readCatalog, sampleFor } from './lib/catalog.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const animationsDir = join(root, 'src/animations')
const outDir = join(root, 'public/og')

const OG = { width: 1200, height: 630 }
const SETTLE_MS = 900
const PROGRESS = 0.45 // how far into the animation the still is taken
const SITE = 'aowshad.github.io/kinetic'

const args = process.argv.slice(2)
const only = args.reduce((acc, a, i) => (a === '--only' && args[i + 1] ? [...acc, args[i + 1]] : acc), [])
const homeOnly = args.includes('--home')

/** Strips the page down to name, category, blurb and stage, at card scale. */
const CARD_CSS = `
  .detail-topbar, .stage-toolbar, .control-bar, .detail-code, .detail-nav,
  .needs-gsap-note, .stage-hint { display: none !important; }
  .min-h-screen { min-block-size: 0 !important; padding: 54px 64px 0 !important; }
  .detail-title { font-size: 52px !important; letter-spacing: -0.02em; }
  .detail-title-row { margin-block-end: 6px !important; }
  .detail-blurb { font-size: 21px !important; margin: 10px 0 26px !important; }
  .stage, .detail-stage { min-block-size: 352px !important; max-block-size: 352px !important;
    border-radius: 18px !important; }
  .scroll-demo-track { block-size: 352px !important; }
  .k-chip, .k-deps-badge, .plugin-badge { font-size: 14px !important; padding: 5px 12px !important; }
`

async function decorate(page) {
  await page.addStyleTag({ content: CARD_CSS })
  await page.evaluate((site) => {
    const mark = document.createElement('div')
    mark.textContent = site
    Object.assign(mark.style, {
      position: 'fixed',
      insetBlockEnd: '20px',
      insetInlineEnd: '28px',
      font: '15px ui-monospace, monospace',
      color: 'var(--muted)',
      letterSpacing: '0.02em',
    })
    document.body.appendChild(mark)
  }, SITE)
}

/** Plays the animation and stops PROGRESS of the way through it. */
async function poseMidAnimation(page, entry, text) {
  const { category, duration, stagger, delay } = entry
  const fullMs = Math.min(4000, (delay + duration + stagger * text.length) * 1000)

  if (category === 'scroll') {
    await page.evaluate((p) => {
      const el = document.querySelector('.scroll-demo-track')
      el.scrollTop = (el.scrollHeight - el.clientHeight) * p
    }, PROGRESS)
    await page.waitForTimeout(450)
    return
  }
  if (category === 'hover') {
    await page.locator('.stage > *').first().hover()
    await page.waitForTimeout(fullMs * PROGRESS)
    return
  }
  if (category === 'loop') {
    await page.waitForTimeout(duration * 1000 * PROGRESS)
    return
  }
  await page.evaluate(() => document.querySelector('.k-play-btn')?.click())
  await page.waitForTimeout(fullMs * PROGRESS)
}

async function main() {
  const all = await readCatalog(animationsDir)
  const catalog = all.filter((e) => only.length === 0 || only.includes(e.id))
  await mkdir(outDir, { recursive: true })

  const server = await createServer({ root, logLevel: 'warn' })
  await server.listen()
  const base = server.resolvedUrls.local[0]
  const browser = await chromium.launch({ headless: !args.includes('--headed') })

  const shoot = async (route, file, prepare) => {
    const context = await browser.newContext({
      viewport: OG,
      deviceScaleFactor: 1,
      colorScheme: 'dark',
      reducedMotion: 'no-preference',
    })
    await context.addInitScript(
      ([theme, sample]) => {
        try {
          localStorage.setItem('kinetic-theme', theme)
          sessionStorage.setItem('kinetic-sample-text', sample)
        } catch {
          /* ignore */
        }
      },
      ['dark', prepare.sample],
    )
    const page = await context.newPage()
    await page.goto(`${base}${route}`, { waitUntil: 'load' })
    await page.waitForSelector(prepare.ready)
    await page.evaluate(() => document.fonts.ready.then(() => true))
    await page.waitForTimeout(SETTLE_MS)
    await decorate(page)
    await prepare.pose(page)
    await page.screenshot({ path: file })
    await context.close()
    return Math.round((await stat(file)).size / 1024)
  }

  console.log(`Rendering ${(homeOnly ? 0 : catalog.length) + (only.length ? 0 : 1)} social cards…\n`)

  if (only.length === 0) {
    // The gallery with its cards stripped out reads as a broken page — empty
    // section headings, a stray theme toggle — so the home card is composed
    // outright, borrowing the site's own tokens and fonts off the loaded page.
    const counts = ['entrance', 'kinetic', 'scroll', 'hover', 'loop', 'exit'].map((c) => ({
      label: c[0].toUpperCase() + c.slice(1),
      n: all.filter((e) => e.category === c).length,
    }))
    const kb = await shoot('', join(outDir, 'default.png'), {
      sample: 'Kinetic',
      ready: '.k-card',
      pose: (page) =>
        page.evaluate(
          ([chips, site, total]) => {
            document.body.innerHTML = `
              <div style="height:100vh;display:flex;flex-direction:column;justify-content:center;
                          padding:0 72px;box-sizing:border-box">
                <div style="font-size:92px;font-weight:700;letter-spacing:-0.03em;line-height:1">Kinetic</div>
                <div style="font-size:26px;color:var(--muted);margin-top:22px;max-width:900px;line-height:1.45">
                  ${total} copy-paste text animations that run with zero dependencies —
                  and tell you honestly when GSAP is worth it.
                </div>
                <div style="display:flex;gap:10px;margin-top:38px;flex-wrap:wrap">
                  ${chips
                    .map(
                      (c) =>
                        `<span style="font-size:17px;color:var(--muted);border:1px solid var(--pill-border);
                           border-radius:999px;padding:8px 16px">${c.label} <b style="color:var(--text)">${c.n}</b></span>`,
                    )
                    .join('')}
                </div>
              </div>
              <div style="position:fixed;bottom:20px;right:28px;font:15px ui-monospace,monospace;
                          color:var(--muted);letter-spacing:.02em">${site}</div>`
          },
          [counts, SITE, all.length],
        ),
    })
    console.log(`  ${'default'.padEnd(24)} ${String(kb).padStart(4)} KB`)
  }

  for (const entry of homeOnly ? [] : catalog) {
    const kb = await shoot(`a/${entry.id}`, join(outDir, `${entry.id}.png`), {
      sample: sampleFor(entry.role),
      ready: '.detail-title',
      pose: (page) => poseMidAnimation(page, entry, sampleFor(entry.role)),
    })
    console.log(`  ${entry.id.padEnd(24)} ${String(kb).padStart(4)} KB`)
  }

  await browser.close()
  await server.close()

  const files = await readdir(outDir)
  let total = 0
  for (const f of files) total += (await stat(join(outDir, f))).size
  console.log(`\n${files.length} cards → public/og/ (${(total / 1024 / 1024).toFixed(1)} MB)`)
}

main().catch((err) => {
  console.error(`\n${err.message}`)
  process.exit(1)
})
