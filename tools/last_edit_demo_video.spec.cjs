const path = require("node:path");
const { test } = require("playwright/test");

test.use({
  video: "on",
  viewport: { width: 1280, height: 720 },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("record last edit walkthrough", async ({ page }) => {
  const sourceUrl = `file://${path.resolve(
    process.cwd(),
    "Schedule_mgt/group_pricing.html"
  )}`;

  const stepDelayMs = 900;

  await page.goto(sourceUrl);
  await page.waitForSelector("#groupType");
  await sleep(1200);

  // Person-based group configuration
  await page.fill("#minPeople", "2");
  await sleep(stepDelayMs);
  await page.fill("#maxPeople", "5");
  await sleep(stepDelayMs);

  await page.check("#eligibilityToggle");
  await page.waitForSelector('#eligibilityArea input[data-pt="Adult"]');
  await sleep(600);
  await page.check('input[data-pt="Adult"]');
  await sleep(450);
  await page.check('input[data-pt="Child"]');
  await sleep(stepDelayMs);

  await page.fill(
    "#descInput",
    "Age/height constraints are described here for checkout clarity."
  );
  await sleep(stepDelayMs);

  // Family configuration
  await page.selectOption("#groupType", "family");
  await page.waitForSelector("#familyToggle");
  await sleep(stepDelayMs);
  await page.check("#familyToggle");
  await page.waitForSelector('#familyArea input[data-fpt="Adult"]');
  await sleep(600);
  await page.check('input[data-fpt="Adult"]');
  await sleep(400);
  await page.fill('input[data-count="Adult"]', "2");
  await sleep(650);
  await page.check('input[data-fpt="Child"]');
  await sleep(400);
  await page.selectOption('select[data-mode="Child"]', "upto");
  await sleep(400);
  await page.fill('input[data-count="Child"]', "2");
  await sleep(stepDelayMs);

  // Vehicle configuration
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
});
