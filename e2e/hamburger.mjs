// Hamburger e2e: the menu must open at EVERY viewport width.
import { chromium } from 'playwright'

const BASE = process.env.E2E_BASE || 'http://localhost:4321'
const browser = await chromium.launch()
let failures = 0

for (const viewport of [{ width: 1280, height: 800 }, { width: 375, height: 720 }]) {
  const page = await browser.newPage({ viewport })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(BASE + '/news/', { waitUntil: 'networkidle' })

  const before = await page.evaluate(() => {
    const b = document.getElementById('menu-toggle')
    return b ? getComputedStyle(b).display : 'MISSING'
  })
  await page.click('#menu-toggle')
  await page.waitForTimeout(250)
  const open = await page.evaluate(() => {
    const n = document.getElementById('mobile-nav')
    return n && !n.classList.contains('hidden') && getComputedStyle(n).display !== 'none'
  })
  await page.click('#menu-toggle')
  await page.waitForTimeout(250)
  const closed = await page.evaluate(() => {
    const n = document.getElementById('mobile-nav')
    return n && n.classList.contains('hidden')
  })

  const ok = before !== 'none' && before !== 'MISSING' && open && closed && errors.length === 0
  console.log(`${viewport.width}px: button display=${before} open=${open} close=${closed} errors=${errors.length} → ${ok ? 'PASS' : 'FAIL'}`)
  if (!ok) failures++
  await page.close()
}
await browser.close()
process.exit(failures ? 1 : 0)
