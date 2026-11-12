import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://configbutler.ai',
	// Listen on all interfaces: "localhost" can bind ::1 only, which the devcontainer port forward misses.
	server: { host: true },
});
