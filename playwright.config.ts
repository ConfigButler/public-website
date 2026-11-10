import { defineConfig, devices } from '@playwright/test';

// End-to-end tests run against the production build (`astro build` + `astro preview`),
// so they exercise what actually ships. Port 4322 keeps them clear of a running
// `npm run dev` on 4321.
const PORT = 4322;

export default defineConfig({
	testDir: 'tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? 'github' : [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'on-first-retry',
	},
	// Only chromium is baked into the devcontainer image (PLAYWRIGHT_BROWSERS in
	// .devcontainer/Dockerfile). Add firefox/webkit there before adding them here.
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command: `npm run build && npm run preview -- --port ${PORT}`,
		url: `http://localhost:${PORT}`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
