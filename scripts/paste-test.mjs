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
 * What counts as "it ran" is the part that has to be right. An earlier
 * version passed any snippet whose rendered state changed at all, and that
 * passed scroll-color-sweep's GSAP tab on nothing more than SplitText
 * wrapping a word in a <div>: the colour never moved. Two rules now:
 *
 *   - Only a change in appearance on an unchanged DOM counts as motion.
 *     Splitting text into spans or appending clones is setup, and setup
 *     happens whether or not the animation that follows actually works.
 *
 *   - The "never ran" baseline is measured, not assumed. Each animation is
 *     also opened with its JS removed and the same trigger applied, so any
 *     motion its CSS produces unaided is known, and a snippet has to beat it.
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
import { checkStylesheets } from './lib/stylesheets.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const animationsDir = join(root, 'src/animations')
const outDir = join(root, '.capture/paste')

const ROLE_TAG = { heading: 'h2', paragraph: 'p', button: 'button', link: 'a', label: 'span', counter: 'span' }
const TABS = { js: 'JS', jsGsap: 'JS + GSAP' }

const args = process.argv.slice(2)
const only = args.reduce((acc, a, i) => (a === '--only' && args[i + 1] ? [...acc, args[i + 1]] : acc), [])
const tabArg = args.includes('--tab') ? args[args.indexOf('--tab') + 1] : null
const tabs = tabArg ? [TABS[tabArg]] : Object.values(TABS)
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

/** A blank page holding the host element, the snippet's CSS, and — unless this is the control — its JS. */
function pasteInto({ importMap, css, js }, { tag, text, id, category }) {
  const isModule = /^\s*(import|export)\s/m.test(js)
  const spacer = category === 'scroll' ? '    <div style="height: 150vh"></div>' : ''
  const script = js
    ? `    <script${isModule ? ' type="module"' : ''}>
${js}

${toCamel(id)}(document.querySelector('.k-${id}'))
    </script>`
    : ''
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>paste test</title>
${js ? importMap : ''}
    <style>
      body { background: #111; color: #eee; display: grid; place-items: center; min-height: 100vh; margin: 0;
             font-family: system-ui, sans-serif; font-size: 40px; }
${css ? `\n${css}\n` : ''}    </style>
  </head>
  <body>
${spacer}
    <${tag} class="k-${id}">${text}</${tag}>
${spacer}
${script}
  </body>
</html>
`
}

/**
 * Records every frame as two keys: the DOM's shape, and how it looks. Wide on
 * appearance on purpose — a property this list misses shows up as "no
 * motion", which is indistinguishable from a broken snippet.
 */
function installRecorder() {
  window.__frames = []
  const sample = () => {
    const host = document.querySelector('[class^="k-"]')
    if (host) {
      const els = [host, ...host.querySelectorAll('*')]
      const shape = `${els.length}:${els.map((el) => el.tagName).join(',')}`
      const look = els
        .map((el) => {
          const s = getComputedStyle(el)
          return [
            el.className, el.textContent,
            s.transform, s.opacity, s.filter, s.clipPath, s.color,
            s.letterSpacing, s.wordSpacing, s.fontWeight, s.fontVariationSettings,
            s.backgroundImage, s.backgroundPosition, s.backgroundSize, s.backgroundClip,
            s.textShadow, s.webkitTextFillColor, s.visibility,
          ].join('|')
        })
        .join(' ')
      window.__frames.push({ shape, look })
    }
    if (window.__frames.length < 600) requestAnimationFrame(sample)
  }
  requestAnimationFrame(sample)
}

/** Frames where appearance changed while the DOM's shape stayed the same. */
function motionSteps(frames) {
  let steps = 0
  for (let i = 1; i < frames.length; i++) {
    if (frames[i].shape === frames[i - 1].shape && frames[i].look !== frames[i - 1].look) steps++
  }
  return steps
}

async function run(browser, file, entry) {
  const context = await browser.newContext({ reducedMotion: 'no-preference' })
  await context.addInitScript(installRecorder)
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(`file://${file}`, { waitUntil: 'load' })
  await page.waitForTimeout(600)

  // Fired the way its category says it fires: a hover animation that is never
  // hovered would read as broken when the harness simply didn't trigger it.
  if (entry.category === 'hover') {
    await page.hover(`.k-${entry.id}`).catch(() => {})
  } else if (entry.category === 'scroll') {
    await page.evaluate(async () => {
      const end = document.body.scrollHeight - window.innerHeight
      for (let i = 0; i <= 20; i++) {
        window.scrollTo(0, (end * i) / 20)
        await new Promise((r) => requestAnimationFrame(r))
      }
    })
  }
  await page.waitForTimeout(2600)

  const frames = await page.evaluate(() => window.__frames ?? [])
  await context.close()
  return { frames: frames.length, motion: motionSteps(frames), errors }
}

async function main() {
  const catalog = (await readCatalog(animationsDir)).filter((e) => only.length === 0 || only.includes(e.id))
  if (only.length && catalog.length !== only.length) {
    throw new Error(`--only named ${only.length} id(s) but ${catalog.length} matched the catalog`)
  }
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const server = await createServer({ root, logLevel: 'warn' })
  await server.listen()
  const base = server.resolvedUrls.local[0]
  const browser = await chromium.launch()

  // 0. Every rule a snippet ships with has to be live on the site too. Here
  //    that means the copies hand-kept in index.css, which can drift.
  const sheets = await checkStylesheets(browser, base, animationsDir, catalog.map((e) => e.id))
  const sheetFailures = sheets.filter((s) => s.missing.length)
  console.log(
    `\nStylesheets: ${sheets.length} style.css file(s), ${sheets.reduce((n, s) => n + s.rules, 0)} rule(s)` +
      (sheetFailures.length ? '' : ' — all live on the page'),
  )
  sheetFailures.forEach((s) => console.log(`  FAIL  ${s.id.padEnd(22)} not on the page: ${s.missing.join(', ')}`))

  const results = []
  const controls = new Map()

  for (const tabLabel of tabs) {
    console.log(`\n${tabLabel}`)
    for (const entry of catalog) {
      const host = { tag: ROLE_TAG[entry.role] ?? 'span', text: sampleFor(entry.role), id: entry.id, category: entry.category }

      // 1. Read the snippet the Copy button would hand over.
      const reader = await browser.newContext({ reducedMotion: 'no-preference' })
      const page = await reader.newPage()
      await page.goto(`${base}a/${entry.id}`, { waitUntil: 'load' })
      await page.waitForSelector('.detail-title')
      const tab = page.getByRole('tab', { name: tabLabel, exact: true })
      const hasTab = (await tab.count()) > 0
      let code = ''
      if (hasTab) {
        await tab.click()
        code = await page.locator('.code-pre code').innerText()
      }
      await reader.close()

      // Never skipped silently. A missing zero-dependency tab is only correct
      // for a 'none'-tier animation; anywhere else it is a failure.
      if (!hasTab) {
        const legit = tabLabel === TABS.js && entry.vanilla === 'none'
        results.push({ id: entry.id, tab: tabLabel, status: legit ? 'skip' : 'fail', why: 'no such tab' })
        console.log(`  ${legit ? 'SKIP' : 'FAIL'}  ${entry.id.padEnd(22)} no ${tabLabel} tab${legit ? " ('none' tier)" : ''}`)
        continue
      }

      const blocks = splitSnippet(code)

      // 2. The measured "never ran" baseline: same page, same CSS, same
      //    trigger, no JS. Shared by both tabs, since only the JS differs.
      if (!controls.has(entry.id)) {
        const file = join(outDir, 'control', entry.id, 'index.html')
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, pasteInto({ ...blocks, js: '' }, host))
        controls.set(entry.id, await run(browser, file, entry))
      }
      const control = controls.get(entry.id)

      // 3. The snippet itself, opened from disk.
      const file = join(outDir, tabLabel.replace(/\W+/g, '-').toLowerCase(), entry.id, 'index.html')
      await mkdir(dirname(file), { recursive: true })
      await writeFile(file, pasteInto(blocks, host))
      const result = await run(browser, file, entry)

      let why = ''
      if (result.frames < 2) why = `only ${result.frames} rendered frames — the animation clock is frozen, nothing here is measurable`
      else if (result.errors.length) why = `errors: ${result.errors.slice(0, 2).join('; ')}`
      else if (result.motion === 0) why = 'no motion — the DOM may have been set up, but nothing then animated'
      else if (result.motion <= control.motion) why = `no motion beyond what its CSS does alone (${result.motion} vs ${control.motion})`

      const status = why ? 'fail' : 'pass'
      results.push({ id: entry.id, tab: tabLabel, status, why, motion: result.motion, control: control.motion })
      console.log(
        `  ${status.toUpperCase()}  ${entry.id.padEnd(22)} ${
          why || `${result.motion} motion steps (control ${control.motion})`
        }`,
      )
    }
  }

  await browser.close()
  await server.close()
  if (!keep) await rm(outDir, { recursive: true, force: true })

  // Coverage is asserted, not assumed: every animation on every requested tab
  // has to have produced a result, or the number below means nothing.
  const expected = catalog.length * tabs.length
  const passed = results.filter((r) => r.status === 'pass')
  const failed = results.filter((r) => r.status === 'fail')
  const skipped = results.filter((r) => r.status === 'skip')
  const cssMotion = [...controls].filter(([, c]) => c.motion > 0)

  console.log(`\nCoverage: ${results.length}/${expected} (${catalog.length} animations × ${tabs.length} tab${tabs.length > 1 ? 's' : ''})`)
  console.log(`${passed.length} passed, ${failed.length} failed, ${skipped.length} skipped`)
  if (cssMotion.length) console.log(`CSS moves unaided in: ${cssMotion.map(([id, c]) => `${id} (${c.motion})`).join(', ')}`)
  failed.forEach((f) => console.log(`  FAILED  ${f.tab.padEnd(10)} ${f.id}: ${f.why}`))

  if (results.length !== expected) {
    console.error(`\nCoverage gap: expected ${expected} results, got ${results.length}`)
    process.exit(1)
  }
  if (failed.length || sheetFailures.length) process.exit(1)
}

main().catch((err) => {
  console.error(`\n${err.message}`)
  process.exit(1)
})
