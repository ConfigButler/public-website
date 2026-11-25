import { test, expect } from '@playwright/test';
import pin from '../../src/lib/reverser-pin.json' with { type: 'json' };

const pages = ['/reverser', '/reverser/quickstart', '/reverser/configuration'];

test('reached from the open-source page, which stays highlighted', async ({ page }) => {
	await page.goto('/open-source');
	await page.locator('a.repo', { hasText: 'GitOps Reverser' }).click();
	await expect(page).toHaveURL(/\/reverser\/?$/);
	await expect(page.locator('article.doc h1')).toHaveText('GitOps Reverser');
	await expect(page.locator('#site-nav a[aria-current="page"]')).toHaveText('open source');
});

for (const path of pages) {
	test(`${path} renders upstream Markdown`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('article.doc h1')).toBeVisible();

		// Every bundled image loads.
		for (const img of await page.locator('article.doc img[src^="/"]').all()) {
			await img.scrollIntoViewIfNeeded();
			expect(await img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
		}

		// No link stays relative to the source repo: it is a site route, an anchor, or absolute.
		const hrefs = await page.locator('article.doc a').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
		for (const href of hrefs) expect(href).toMatch(/^(\/|#|https?:|mailto:)/);

		// Repo links open the pinned commit, never a moving branch.
		for (const href of hrefs.filter((h) => h.includes('github.com/ConfigButler/gitops-reverser/'))) {
			if (/\/(blob|tree)\//.test(href)) expect(href).toContain(pin.sha);
		}
	});
}

test('cross-document anchors land on a heading', async ({ page, request }) => {
	for (const path of pages) {
		await page.goto(path);
		const targets = await page
			.locator('article.doc a[href*="#"]')
			.evaluateAll((as) => as.map((a) => a.getAttribute('href')!).filter((h) => h.startsWith('/') || h.startsWith('#')));
		for (const t of new Set(targets)) {
			const [route, id] = t.split('#');
			const html = await (await request.get(route || path)).text();
			expect(html, `${path} → ${t}`).toContain(`id="${id}"`);
		}
	}
});

test('quickstart loads directly, with and without trailing slash', async ({ page }) => {
	for (const url of ['/reverser/quickstart', '/reverser/quickstart/']) {
		const res = await page.goto(url);
		expect(res?.status()).toBe(200);
		await expect(page.locator('article.doc h1')).toHaveText('Quick start');
	}
});

test('mobile: no horizontal page scroll', async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 800 });
	for (const path of pages) {
		await page.goto(path);
		const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
		expect(overflow, path).toBeLessThanOrEqual(0);
	}
});
