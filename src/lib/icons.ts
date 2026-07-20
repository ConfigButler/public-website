// Icon geometry, sourced at BUILD TIME straight from the installed open-source
// packages — nothing here is a hand-pasted SVG path:
//   • Lucide  — ISC — node_modules/lucide-static/icons/*.svg
//   • Feather — MIT — node_modules/feather-icons/dist/icons/*.svg  (github only)
// This file only maps our own semantic name -> the upstream icon name. To change
// an icon, edit the mapping; to update the art, `npm update lucide-static`.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const LUCIDE = path.join(path.dirname(require.resolve('lucide-static/package.json')), 'icons');
const FEATHER = path.join(path.dirname(require.resolve('feather-icons/package.json')), 'dist', 'icons');

// semantic name -> [source package, upstream icon file name]
const MAP: Record<string, ['lucide' | 'feather', string]> = {
	git:       ['lucide', 'git-graph'],
	api:       ['lucide', 'webhook'],
	scan:      ['lucide', 'scan'],
	plug:      ['lucide', 'plug'],
	branch:    ['lucide', 'git-branch'],
	bot:       ['lucide', 'bot'],
	shield:    ['lucide', 'shield-check'],
	arrow:     ['lucide', 'arrow-right'],
	down:      ['lucide', 'arrow-down'],
	check:     ['lucide', 'check'],
	x:         ['lucide', 'x'],
	lock:      ['lucide', 'lock'],
	doc:       ['lucide', 'file-text'],
	spark:     ['lucide', 'sparkles'],
	mail:      ['lucide', 'mail'],
	schema:    ['lucide', 'workflow'],
	watch:     ['lucide', 'eye'],
	users:     ['lucide', 'users'],
	key:       ['lucide', 'key-round'],
	terraform: ['lucide', 'boxes'],
	cli:       ['lucide', 'square-terminal'],
	layers:    ['lucide', 'layers'],
	clock:     ['lucide', 'clock'],
	box:       ['lucide', 'box'],
	server:    ['lucide', 'server'],
	route:     ['lucide', 'route'],
	history:   ['lucide', 'history'],
	rocket:    ['lucide', 'rocket'],
	link:      ['lucide', 'link'],
	github:    ['feather', 'github'], // Lucide no longer ships brand marks
};

// Keep only the inner shapes; our Icon.astro re-wraps them with its own <svg> (stroke 1.7 etc.)
const stripWrapper = (svg: string): string =>
	svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '').replace(/\s+/g, ' ').trim();

function read([pkg, icon]: ['lucide' | 'feather', string]): string {
	const file = path.join(pkg === 'lucide' ? LUCIDE : FEATHER, `${icon}.svg`);
	const inner = stripWrapper(fs.readFileSync(file, 'utf8'));
	if (!inner) throw new Error(`Icon "${icon}" from ${pkg} produced empty geometry (${file})`);
	return inner;
}

export const icons: Record<string, string> = Object.fromEntries(
	Object.entries(MAP).map(([name, ref]) => [name, read(ref)]),
);
