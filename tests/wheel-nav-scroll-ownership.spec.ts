import { expect, test } from "@playwright/test";

test.describe("Ferris-wheel nav scroll ownership", () => {
  test("nav captures scroll only when engaged; page scroll otherwise", async ({ page }) => {
    // HashRouter route
    await page.goto("/#/projects");

    const nav = page.locator('.global-wheel-rail-desktop [aria-label="Primary navigation"]');
    const navViewport = nav.locator(".wheel-nav-viewport");

    await expect(nav).toBeVisible();

    const getScrollY = async () => page.evaluate(() => window.scrollY);
    const getActiveIndex = async () => {
      const raw = await nav.locator('.wheel-nav-item[data-active="true"] .wheel-nav-item-index').innerText();
      return Number.parseInt(raw.trim(), 10);
    };

    await page.evaluate(() => window.scrollTo(0, 0));
    const startScroll = await getScrollY();

    // 1) Default behavior: page scrolls
    await page.mouse.wheel(0, 420);
    await page.waitForTimeout(100);
    const scrolled = await getScrollY();
    expect(scrolled).toBeGreaterThan(startScroll);

    // 2) Engage nav by keyboard focus
    await navViewport.focus();
    const scrollBeforeNav = await getScrollY();
    const activeBefore = await getActiveIndex();

    await page.mouse.wheel(0, 420);
    await page.waitForTimeout(180); // > wheel lockout window (140ms)

    const scrollDuringNav = await getScrollY();
    const activeAfter = await getActiveIndex();

    // Page should not scroll while nav is engaged
    expect(scrollDuringNav).toBe(scrollBeforeNav);

    // One gesture should map to one deterministic step
    expect(activeAfter - activeBefore).toBe(1);

    // 3) Exit nav mode
    await page.keyboard.press("Escape");

    const scrollBeforeExit = await getScrollY();
    await page.mouse.wheel(0, 420);
    await page.waitForTimeout(100);
    const scrollAfterExit = await getScrollY();

    expect(scrollAfterExit).toBeGreaterThan(scrollBeforeExit);
  });
});
