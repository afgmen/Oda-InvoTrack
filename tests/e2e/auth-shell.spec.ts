import { expect, test } from "@playwright/test";

test("unauthenticated user is redirected to magic-link sign in", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByRole("heading", { name: "Đăng nhập" })).toBeVisible();
  await expect(page.getByLabel("Email công ty")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "hộp thư thử nghiệm" }),
  ).toHaveAttribute("href", "http://127.0.0.1:54324");
});

test("public landing page identifies the product as a tracker", async ({
  page,
}) => {
  await page.goto("/");

  const brand = page.getByText("Oda InvoTrack", { exact: true });

  await expect(brand).toBeVisible();
  await expect(brand).toHaveCSS("text-transform", "none");
  await expect(page.getByText(/không thay thế kho lưu trữ/i)).toBeVisible();
});
