#!/usr/bin/env node
/**
 * Pastes what the Copy button produces into a blank HTML file and checks it
 * runs — no build step, no packages.
 *
 * Unlike the SVG library, a snippet here is JS alone: the visitor supplies
 * the element and calls the function, because the content is theirs. So the
 * host page below provides exactly those two things and nothing else. If a
 * snippet needs anything more than an element and a call, that is a finding,
 * not something for this harness to paper over.
 *
 * Usage:
 *   node scripts/paste-test.mjs                 # every animation, both tabs
 *   node scripts/paste-test.mjs --tab jsGsap    # only the GSAP tab
 *   node scripts/paste-test.mjs --only blur-in
 *   node scripts/paste-test.mjs --keep
 */
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { readCatalog, sampleFor } from './lib/catalog.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const animationsDir = join(root, 'src/animations')
const outDir = join(root, '.capture/paste')

const ROLE_TAG = { heading: 'h2', paragraph: 'p', button: 'button', link: 'a', label: 'span', counter: 'span' }

const args = process.argv.slice(2)
const only = args.reduce((acc, a, i) => (a === '--only' && args[i + 1] ? [...acc, args[i + 1]] : acc), [])
const tabArg = args.includes('--tab') ? args[args.indexOf('--tab') + 1] : null
const tabs = tabArg === 'jsGsap' ? ['JS + GSAP'] : tabArg === 'js' ? ['JS'] : ['JS', 'JS + GSAP']
const keep = args.includes('--keep')

const toCamel = (id) => id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

/** Peels the import map and the CSS comment block off the emitted snippet. */
function splitSnippet(code) {
  const importMap = code.match(/<!-- Load GSAP[\s\S]*?<\/script>/)?.[0] ?? ''
  const css = code.match(/\n\/\* CSS \*\/\n([\s\S]*)$/)?.[1]?.trim() ?? ''
  const js = code
    .replace(importMap, '')
    .replace(/\n\/\* CSS \*\/\n[\s\S]*$/, '')
    .trim()
  return { importMap, css, js }
}

function pasteInto({ importMap, css, js }, { tag, text, id, category }) {
  // `export` makes the snippet a module whether or not GSAP is involved.
  const isModule = /^\s*(import|export)\s/m.test(js)
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>paste test</title>
${importMap}
    <style>
      body { background: #111; color: #eee; display: grid; place-items: center; min-height: 100vh; margin: 0;
             font-family: system-ui, sans-serif; font-size: 40px; }
${css ? `\n${css}\n` : ''}    </style>
  </head>
  <body>
${category === 'scroll' ? '    <div style="height: 150vh"></div>' : ''}
    <${tag} class="k-${id}">${text}</${tag}>
${category === 'scroll' ? '    <div style="height: 150vh"></div>' : ''}
    <script${isModule ? ' type="module"' : ''}>
${js}

${toCamel(id)}(document.querySelector('.k-${id}'))
    </script>
  </body>
</html>
`
}

async function main() {
  const catalog = (await readCatalog(animationsDir)).filter((e) => only.length === 0 || only.includes(e.id))
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const server = await createServer({ root, logLevel: 'warn' })
  await server.listen()
  const base = server.resolvedUrls.local[0]
  const browser = await chromium.launch()
  const results = []

  for (const tabLabel of tabs) {
    console.log(`\n${tabLabel}`)
    for (const entry of catalog) {
      const reader = await browser.newContext({ reducedMotion: 'no-preference' })
      const page = await reader.newPage()
      await page.goto(`${base}a/${entry.id}`, { waitUntil: 'load' })
      await page.waitForSelector('.detail-title')
      const tab = page.getByRole('tab', { name: tabLabel, exact: true })
      if ((await tab.count()) === 0) {
        await reader.close()
        continue // 'none'-tier animations have no zero-dependency tab
      }
      await tab.click()
      const code = await page.locator('.code-pre code').innerText()
      await reader.close()

      const text = sampleFor(entry.role)
      const file = join(outDir, tabLabel.replace(/\W+/g, '-').toLowerCase(), entry.id, 'index.html')
      await mkdir(dirname(file), { recursive: true })
      await writeFile(file, pasteInto(splitSnippet(code), { tag: ROLE_TAG[entry.role] ?? 'span', text, id: entry.id, category: entry.category }))

      const context = await browser.newContext({ reducedMotion: 'no-preference' })
      // GSAP writes inline styles from its own ticker and never creates Web
      // Animations API objects, so rendered state is the only check that sees
      // both engines.
      await context.addInitScript(() => {
        window.__frames = []
        const sample = () => {
          const host = document.querySelector('[class^="k-"]')
          if (host) {
            const els = [host, ...host.querySelectorAll('*')]
            window.__frames.push(
              els
                .map((el) => {
                  const s = getComputedStyle(el)
                  // Wide on purpose: a sampled-property gap shows up as
                  // "never changed the rendered state", which is
                  // indistinguishable from a broken snippet unless the list
                  // covers everything this catalogue actually animates.
                  return [
                    s.transform, s.opacity, s.filter, s.clipPath, s.color,
                    s.letterSpacing, s.wordSpacing, s.fontWeight, s.fontVariationSettings,
                    s.backgroundImage, s.backgroundPosition, s.backgroundSize, s.backgroundClip,
                    s.textShadow, s.webkitTextFillColor, s.visibility,
                    el.textContent,
                  ].join('|')
                })
                .join(' '),
            )
          }
          if (window.__frames.length < 600) requestAnimationFrame(sample)
        }
        requestAnimationFrame(sample)
      })

      const pasted = await context.newPage()
      const errors = []
      pasted.on('pageerror', (e) => errors.push(e.message))
      pasted.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
      await pasted.goto(`file://${file}`, { waitUntil: 'load' })
      await pasted.waitForTimeout(600)

      // Fire it the way its category says it fires. Without this a hover
      // animation reads as "never changed the rendered state", which is a
      // gap in the harness dressed up as a defect in the snippet.
      if (entry.category === 'hover') {
        await pasted.hover(`.k-${entry.id}`).catch(() => {})
      } else if (entry.category === 'scroll') {
        await pasted.evaluate(async () => {
          const end = document.body.scrollHeight - window.innerHeight
          for (let i = 0; i <= 20; i++) {
            window.scrollTo(0, (end * i) / 20)
            await new Promise((r) => requestAnimationFrame(r))
          }
        })
      }
      await pasted.waitForTimeout(2600)

      const check = await pasted.evaluate(() => {
        const frames = window.__frames ?? []
        if (frames.length < 2)
          return { ok: false, why: `only ${frames.length} rendered frames — the animation clock is frozen, nothing here is measurable` }
        const distinct = new Set(frames).size
        if (distinct < 2) return { ok: false, why: 'the pasted code never changed the rendered state' }
        return { ok: true, frames: frames.length, distinct }
      })
      await context.close()

      const pass = check.ok && errors.length === 0
      results.push({ id: entry.id, tab: tabLabel, pass, errors, check })
      console.log(
        `  ${pass ? 'PASS' : 'FAIL'}  ${entry.id.padEnd(22)} ${
          check.ok ? `${check.frames} frames, ${check.distinct} distinct states` : check.why
        }${errors.length ? `  errors: ${errors.slice(0, 2).join('; ')}` : ''}`,
      )
    }
  }

  await browser.close()
  await server.close()
  if (!keep) await rm(outDir, { recursive: true, force: true })

  const failed = results.filter((r) => !r.pass)
  console.log(`\n${results.length - failed.length}/${results.length} pasted and ran`)
  if (failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(`\n${err.message}`)
  process.exit(1)
})
