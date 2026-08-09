import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";
const width = parseInt(process.argv[4] || "1440", 10);
const height = parseInt(process.argv[5] || "900", 10);

const outDir = path.join(__dirname, "temporary screenshots");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const existing = fs.readdirSync(outDir).filter((f) => f.startsWith("screenshot-"));
const nums = existing.map((f) => {
  const m = f.match(/screenshot-(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
});
const next = nums.length ? Math.max(...nums) + 1 : 1;
const suffix = label ? `-${label}` : "";
const outPath = path.join(outDir, `screenshot-${next}${suffix}.png`);

const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width, height });
await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

// Auto-scroll to trigger any scroll-based reveal animations, then return to top.
// Force instant (non-smooth) scrolling so each jump actually lands before the next.
await page.evaluate(async () => {
  const prevBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  const distance = 400;
  const delay = 80;
  let y = 0;
  while (y < document.body.scrollHeight) {
    y += distance;
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, delay));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
  document.documentElement.style.scrollBehavior = prevBehavior;
});

// Puppeteer's fullPage screenshots misplace `position: fixed` elements
// (they render mid-page instead of pinned to the top). Convert them to
// `absolute` just for the capture so they render once, in place, at the
// top of the stitched image. Does not affect the live page.
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((el) => {
    if (getComputedStyle(el).position === "fixed") {
      el.style.setProperty("position", "absolute", "important");
    }
  });
});

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outPath}`);
