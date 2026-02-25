import path from "node:path";
import { copyFile, mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const repoRoot = process.cwd();
const pagePath = path.resolve(repoRoot, "Schedule_mgt/group_pricing.html");
const outputDir = path.resolve(repoRoot, "Schedule_mgt/demo");
const sourceUrl = `file://${pagePath}`;
const frameSize = { width: 1280, height: 720 };
const stepDelayMs = 900;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function recordDemo() {
  await mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: frameSize,
    recordVideo: {
      dir: outputDir,
      size: frameSize,
    },
  });

  const page = await context.newPage();
  const video = page.video();
  const videoPathPromise = video.path();

  await page.goto(sourceUrl);
  await page.waitForSelector("#groupType");
  await sleep(1200);

  // 1) Person-based flow
  await page.fill("#minPeople", "2");
  await sleep(stepDelayMs);
  await page.fill("#maxPeople", "5");
  await sleep(stepDelayMs);

  await page.check("#eligibilityToggle");
  await page.waitForSelector('#eligibilityArea input[data-pt="Adult"]');
  await sleep(600);
  await page.check('input[data-pt="Adult"]');
  await sleep(500);
  await page.check('input[data-pt="Child"]');
  await sleep(stepDelayMs);

  await page.fill(
    "#descInput",
    "Age/height constraints are described here for checkout clarity."
  );
  await sleep(stepDelayMs);

  // 2) Family flow
  await page.selectOption("#groupType", "family");
  await page.waitForSelector("#familyToggle");
  await sleep(stepDelayMs);

  await page.check("#familyToggle");
  await page.waitForSelector('#familyArea input[data-fpt="Adult"]');
  await sleep(600);
  await page.check('input[data-fpt="Adult"]');
  await sleep(450);
  await page.fill('input[data-count="Adult"]', "2");
  await sleep(700);

  await page.check('input[data-fpt="Child"]');
  await sleep(450);
  await page.selectOption('select[data-mode="Child"]', "upto");
  await sleep(450);
  await page.fill('input[data-count="Child"]', "2");
  await sleep(stepDelayMs);

  // 3) Vehicle flow
  await page.selectOption("#groupType", "vehicle");
  await page.waitForSelector("#minPassengers");
  await sleep(stepDelayMs);
  await page.fill("#minPassengers", "2");
  await sleep(500);
  await page.fill("#maxPassengers", "8");
  await sleep(stepDelayMs);

  await page.check("#eligibilityToggle");
  await page.waitForSelector('#eligibilityArea input[data-pt="Senior"]');
  await sleep(600);

  const childEligibility = page.locator('input[data-pt="Child"]');
  if (await childEligibility.isChecked()) {
    await childEligibility.uncheck();
    await sleep(450);
  }

  await page.check('input[data-pt="Senior"]');
  await sleep(stepDelayMs);

  await page.fill(
    "#descInput",
    "Capacity shown in checkout; driver ID required at check-in."
  );
  await sleep(1600);

  await context.close();
  await browser.close();

  const rawVideoPath = await videoPathPromise;
  const finalWebmPath = path.join(outputDir, "last-edit-group-pricing-demo.webm");
  await copyFile(rawVideoPath, finalWebmPath);
  return finalWebmPath;
}

recordDemo()
  .then((videoPath) => {
    console.log(videoPath);
  })
  .catch((error) => {
    console.error("Failed to record demo video:", error);
    process.exitCode = 1;
  });
