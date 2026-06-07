import { expect, test } from "@playwright/test";

test("unauthenticated user is redirected to magic-link sign in", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByRole("heading", { name: "Đăng nhập" })).toBeVisible();
  await expect(page.getByLabel("Email công ty")).toBeVisible();
});

test("public landing page identifies the product as a tracker", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByText("Oda InvoTrack", { exact: true })).toBeVisible();
  await expect(page.getByText(/không thay thế kho lưu trữ/i)).toBeVisible();
});
