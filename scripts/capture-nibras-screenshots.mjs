/**
 * Professional screenshots for madarisnibras.ma (ar / fr / en)
 * Run: node scripts/capture-nibras-screenshots.mjs
 */
import { chromium, devices } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "screenshots", "nibras");

const LOCALES = [
  { code: "ar", url: "https://www.madarisnibras.ma/ar" },
  { code: "fr", url: "https://www.madarisnibras.ma/fr" },
  { code: "en", url: "https://www.madarisnibras.ma/en" },
];

const DESKTOP = { width: 1440, height: 1000 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const MOBILE_DEVICE = devices["iPhone 13"];

const HERO_CSS = "section.relative.min-h-\\[82vh\\]";
const HERO_SELECTOR = "section.relative.min-h-\\[82vh\\]";

async function waitForPageReady(page) {
  await page.waitForLoadState("load");
  try {
    await page.waitForLoadState("networkidle", { timeout: 15_000 });
  } catch {
    // Analytics/websockets may prevent true idle; continue after critical assets load.
  }
  await page.waitForSelector(HERO_SELECTOR, { state: "visible", timeout: 30_000 });
  await page.evaluate(async (selector) => {
    if (document.fonts?.ready) await document.fonts.ready;
    const hero = document.querySelector(selector);
    if (!hero) return;
    const imgs = [...hero.querySelectorAll("img")];
    await Promise.all(
      imgs.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      })
    );
  }, HERO_CSS);
  await page.waitForTimeout(600);
}

async function captureLocale(browser, { code, url }) {
  const context = await browser.newContext({
    viewport: DESKTOP,
    deviceScaleFactor: 1,
    locale: code === "ar" ? "ar-MA" : code === "fr" ? "fr-FR" : "en-US",
    colorScheme: "light",
    reducedMotion: "reduce",
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  const generated = [];

  try {
    await page.goto(url, { waitUntil: "load", timeout: 90_000 });
    await waitForPageReady(page);

    const hero = page.locator(HERO_SELECTOR).first();

    // Desktop hero (element clip, 1440 viewport)
    const desktopHeroPath = path.join(OUT_DIR, `nibras-${code}-desktop-hero.png`);
    await hero.screenshot({ path: desktopHeroPath, animations: "disabled" });
    generated.push({ file: `nibras-${code}-desktop-hero.png`, viewport: `${DESKTOP.width}x${DESKTOP.height}`, type: "hero" });

    // Desktop above-the-fold: header + hero (viewport 1440×1000)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("header").waitFor({ state: "visible", timeout: 10_000 });
    const desktopFoldPath = path.join(OUT_DIR, `nibras-${code}-desktop-fold.png`);
    await page.screenshot({ path: desktopFoldPath, animations: "disabled" });
    generated.push({
      file: `nibras-${code}-desktop-fold.png`,
      viewport: `${DESKTOP.width}x${DESKTOP.height}`,
      type: "fold",
    });

    const desktopFullPath = path.join(OUT_DIR, `nibras-${code}-desktop-full.png`);
    await page.screenshot({
      path: desktopFullPath,
      fullPage: true,
      animations: "disabled",
    });
    generated.push({ file: `nibras-${code}-desktop-full.png`, viewport: `${DESKTOP.width}x${DESKTOP.height}`, type: "full" });
  } finally {
    await context.close();
  }

  const mobileContext = await browser.newContext({
    ...MOBILE_DEVICE,
    viewport: MOBILE_VIEWPORT,
    locale: code === "ar" ? "ar-MA" : code === "fr" ? "fr-FR" : "en-US",
    colorScheme: "light",
    reducedMotion: "reduce",
    ignoreHTTPSErrors: true,
  });
  const mobilePage = await mobileContext.newPage();

  try {
    await mobilePage.goto(url, { waitUntil: "load", timeout: 90_000 });
    await waitForPageReady(mobilePage);

    const hero = mobilePage.locator(HERO_SELECTOR).first();
    const mobileHeroPath = path.join(OUT_DIR, `nibras-${code}-mobile-hero.png`);
    await hero.screenshot({ path: mobileHeroPath, animations: "disabled" });
    generated.push({
      file: `nibras-${code}-mobile-hero.png`,
      viewport: `${MOBILE_VIEWPORT.width}x${MOBILE_VIEWPORT.height} (iPhone 13 UA)`,
      type: "hero",
    });

    // Mobile above-the-fold: header + hero (viewport 390×844)
    await mobilePage.evaluate(() => window.scrollTo(0, 0));
    await mobilePage.locator("header").waitFor({ state: "visible", timeout: 10_000 });
    const mobileFoldPath = path.join(OUT_DIR, `nibras-${code}-mobile-fold.png`);
    await mobilePage.screenshot({ path: mobileFoldPath, animations: "disabled" });
    generated.push({
      file: `nibras-${code}-mobile-fold.png`,
      viewport: `${MOBILE_VIEWPORT.width}x${MOBILE_VIEWPORT.height} (iPhone 13 UA)`,
      type: "fold",
    });

    const mobileFullPath = path.join(OUT_DIR, `nibras-${code}-mobile-full.png`);
    await mobilePage.screenshot({
      path: mobileFullPath,
      fullPage: true,
      animations: "disabled",
    });
    generated.push({
      file: `nibras-${code}-mobile-full.png`,
      viewport: `${MOBILE_VIEWPORT.width}x${MOBILE_VIEWPORT.height} (iPhone 13 UA)`,
      type: "full",
    });
  } finally {
    await mobileContext.close();
  }

  return generated;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--hide-scrollbars", "--disable-dev-shm-usage"],
  });

  const allFiles = [];

  try {
    for (const locale of LOCALES) {
      console.log(`Capturing ${locale.code}: ${locale.url}`);
      const files = await captureLocale(browser, locale);
      allFiles.push(...files);
    }
  } finally {
    await browser.close();
  }

  console.log("\n--- Generated files ---");
  for (const f of allFiles) {
    console.log(`${f.file}  [${f.viewport}]  (${f.type})`);
  }
  console.log(`\nOutput directory: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
