import { test, expect } from "@playwright/test";

const pages = [
  "Home",
  "Comfort",
  "Start/Stop",
  "Ventilation",
  "Fire & Gas",
  "HVAC",
  "UPS/POWER",
  "COMMISSION",
];
const nav = (page: import("@playwright/test").Page, name: string) =>
  page.getByRole("navigation").getByRole("button", { name, exact: true });

test("all panel views fit 1280×800 and controls have touch targets", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveClass("dark");
  await expect(page.getByText("OPERATOR PANEL", { exact: true })).toHaveCount(
    0,
  );
  for (const brand of ["Halliburton"]) {
    const logo = page.getByRole("img", { name: brand, exact: true });
    await expect(logo).toBeVisible();
    expect(
      await logo.evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
    ).toBe(true);
  }
  await expect(page.getByRole("navigation").getByRole("button")).toHaveText(
    pages,
  );
  await expect(
    page.getByRole("img", { name: "Halliburton", exact: true }),
  ).toHaveCSS("filter", "none");
  const menuBounds = await page.getByRole("navigation").boundingBox();
  const contentBounds = await page.getByRole("main").boundingBox();
  expect(menuBounds!.x + menuBounds!.width).toBeLessThanOrEqual(
    contentBounds!.x,
  );
  for (const name of pages) {
    await nav(page, name).tap();
    await expect(
      page.getByRole("heading", { name, exact: true, level: 1 }),
    ).toBeVisible();
    await expect(nav(page, name)).toHaveAttribute("aria-current", "page");
    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }));
    expect(layout.width, name).toBeLessThanOrEqual(1280);
    expect(layout.height, name).toBeLessThanOrEqual(800);
    const controls = await page
      .locator("button:visible")
      .evaluateAll((elements) =>
        elements.map((el) => ({
          label: el.getAttribute("aria-label") || el.textContent,
          width: el.getBoundingClientRect().width,
          height: el.getBoundingClientRect().height,
        })),
      );
    for (const control of controls) {
      expect(
        control.height,
        `${name}: ${control.label}`,
      ).toBeGreaterThanOrEqual(48);
      expect(control.width, `${name}: ${control.label}`).toBeGreaterThanOrEqual(
        48,
      );
    }
  }
  expect(errors).toEqual([]);
});

test("unit commands require confirmation and stopped systems reflect unit state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 600 });
  await page.goto("/");
  await nav(page, "Start/Stop").tap();
  await page.getByRole("button", { name: "Stop unit", exact: true }).tap();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  await dialog.evaluate(async (element) => {
    await Promise.all(
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished),
    );
  });
  for (const button of await dialog.getByRole("button").all()) {
    const bounds = await button.boundingBox();
    expect(bounds!.height).toBeGreaterThanOrEqual(72);
    await expect(button).toBeInViewport({ ratio: 1 });
  }
  await dialog.getByRole("button", { name: "Cancel" }).tap();
  await expect(page.getByText("Unit running", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Stop unit", exact: true }).tap();
  await dialog.getByRole("button", { name: "Stop unit", exact: true }).tap();
  await expect(page.getByText("Unit stopped", { exact: true })).toBeVisible();
  await nav(page, "Ventilation").tap();
  await expect(
    page.getByRole("switch", { name: "Ventilation" }),
  ).toBeDisabled();
  await nav(page, "HVAC").tap();
  await expect(
    page.getByRole("switch", { name: "HVAC enabled", exact: true }),
  ).toBeDisabled();
  await nav(page, "Start/Stop").tap();
  await page.getByRole("button", { name: "Start unit", exact: true }).tap();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByText("Unit stopped", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Start unit", exact: true }).tap();
  await dialog.getByRole("button", { name: "Start unit", exact: true }).tap();
  await expect(page.getByText("Unit running", { exact: true })).toBeVisible();
});

test("climate limits, fan enablement, acknowledgement and reset stay consistent", async ({
  page,
}) => {
  await page.goto("/");
  await nav(page, "Comfort").tap();
  for (let i = 0; i < 6; i++)
    await page
      .getByRole("button", { name: "Increase temperature", exact: true })
      .tap();
  await expect(
    page.getByRole("button", { name: "Increase temperature", exact: true }),
  ).toBeDisabled();
  for (let i = 0; i < 12; i++)
    await page
      .getByRole("button", { name: "Decrease temperature", exact: true })
      .tap();
  await expect(
    page.getByRole("button", { name: "Decrease temperature", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Increase fan speed" }).tap();
  await nav(page, "HVAC").tap();
  await page.getByRole("radio", { name: "Manual", exact: true }).tap();
  await nav(page, "Ventilation").tap();
  await page.getByRole("switch", { name: "Ventilation" }).tap();
  await nav(page, "Home").tap();
  await expect(
    page
      .getByRole("group", { name: "Ventilation reading" })
      .filter({ hasText: "0%" }),
  ).toBeVisible();
  await nav(page, "Ventilation").tap();
  await page.getByRole("switch", { name: "Ventilation" }).tap();
  await nav(page, "Home").tap();
  await expect(
    page
      .getByRole("group", { name: "Ventilation reading" })
      .filter({ hasText: "70%" }),
  ).toBeVisible();
  await nav(page, "Ventilation").tap();
  await page.getByRole("button", { name: "Acknowledge" }).tap();
  await expect(
    page.getByRole("button", { name: "Acknowledged", exact: true }),
  ).toBeDisabled();
  await nav(page, "Home").tap();
  await expect(
    page.getByRole("button", { name: "View filter notice" }),
  ).toBeHidden();
  await nav(page, "COMMISSION").tap();
  await page.getByRole("button", { name: "Reset", exact: true }).tap();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Reset", exact: true })
    .tap();
  await expect(
    page.getByRole("heading", { name: "Home", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Setpoint 22 °C", { exact: true })).toBeVisible();
  await expect(
    page
      .getByRole("group", { name: "Ventilation reading" })
      .filter({ hasText: "65%" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "View filter notice" }),
  ).toBeVisible();
});

for (const size of [
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
]) {
  test(`navigation and content remain accessible at ${size.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(size);
    await page.goto("/");
    for (const name of pages) {
      await nav(page, name).tap();
      await expect(
        page.getByRole("heading", { name, exact: true, level: 1 }),
      ).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(size.width);
      const bounds = await page.getByRole("navigation").boundingBox();
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(size.height + 1);
    }
  });
}

for (const size of [
  { width: 1280, height: 720 },
  { width: 1024, height: 768 },
  { width: 1024, height: 600 },
]) {
  test(`all eight pages fit without scrolling at ${size.width}×${size.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(size);
    await page.goto("/");
    for (const name of pages) {
      await nav(page, name).tap();
      const bounds = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      }));
      expect(bounds.width, name).toBeLessThanOrEqual(size.width);
      expect(bounds.height, name).toBeLessThanOrEqual(size.height);
      if (size.width === 1024 && size.height === 600) {
        const targets = await page
          .locator("button:visible")
          .evaluateAll((buttons) =>
            buttons.map((button) => ({
              label: button.getAttribute("aria-label") || button.textContent,
              width: button.getBoundingClientRect().width,
              height: button.getBoundingClientRect().height,
            })),
          );
        for (const target of targets) {
          expect(
            target.width,
            `${name}: ${target.label}`,
          ).toBeGreaterThanOrEqual(56);
          expect(
            target.height,
            `${name}: ${target.label}`,
          ).toBeGreaterThanOrEqual(56);
        }
      }
      for (const button of await page.getByRole("button").all())
        await expect(button).toBeInViewport({ ratio: 1 });
    }
  });
}
