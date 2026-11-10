import { test, expect } from '@playwright/test';

// Proves the toolchain end to end: the site builds, the preview server serves it,
// and a real browser renders it. Replace or extend once there is behaviour to test.
test('homepage renders', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/ConfigButler/i);
	await expect(page.locator('nav').first()).toBeVisible();
});
