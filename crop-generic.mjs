import puppeteer from "puppeteer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [srcRel, x, y, w, h, outName] = process.argv.slice(2);
const imgPath = "file://" + path.join(__dirname, srcRel).split(path.sep).join("/");

const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();
await page.goto(imgPath, { waitUntil: "load" });

const dataUrl = await page.evaluate(
  async (x, y, w, h) => {
    const img = document.querySelector("img");
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    return canvas.toDataURL("image/png");
  },
  Number(x),
  Number(y),
  Number(w),
  Number(h)
);

const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
fs.writeFileSync(path.join(__dirname, outName), Buffer.from(base64, "base64"));
console.log("saved", outName);
await browser.close();
