// Renders gitops-reverser's own Markdown, unedited. The operator repo is the source of truth;
// this file only decides which documents get a route and where every other link goes.
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import rehypeRaw from 'rehype-raw';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import pin from './reverser-pin.json';

export const repo = 'https://github.com/ConfigButler/gitops-reverser';
export const ref = pin.sha;
export const version = pin.tag ?? pin.sha.slice(0, 7);
const root = 'external/gitops-reverser';

// Source file → route under /reverser. A link to anything else opens on GitHub at the pin.
export const docs = [
	{ slug: undefined, src: 'README.md', nav: 'Overview' },
	{ slug: 'quickstart', src: 'docs/quickstart.md', nav: 'Quick start' },
	{ slug: 'configuration', src: 'docs/configuration.md', nav: 'Configuration' },
] as const;

export const route = (slug?: string) => (slug ? `/reverser/${slug}` : '/reverser');
const routes = new Map<string, string>(docs.map((d) => [d.src, route(d.slug)]));

// Bundle every image the docs can reference, so pages never load them from GitHub.
const assets = import.meta.glob<string>(
	'/external/gitops-reverser/docs/{images,demo}/*.{svg,gif,png,jpg}',
	{ query: '?url', import: 'default', eager: true },
);
const assetUrl = (p: string) => assets[`/${root}/${p}`];

const isExternal = (url: string) => /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//');

// A repo-relative path for `url` as written in `from`, or null when it is not a repo link.
function resolve(from: string, url: string) {
	// A leading "/" is already a site path: rewritten by the remark pass.
	if (!url || /^[#/]/.test(url) || isExternal(url)) return null;
	const [p, hash] = url.split('#');
	const target = path.posix.normalize(path.posix.join(path.posix.dirname(from), p));
	return { target: target.replace(/\/$/, ''), hash: hash ? `#${hash}` : '' };
}

function rewriteLink(from: string, url: string) {
	const r = resolve(from, url);
	if (!r) return url;
	const mapped = routes.get(r.target);
	if (mapped) return mapped + r.hash;
	const full = path.join(root, r.target);
	const kind = existsSync(full) && statSync(full).isDirectory() ? 'tree' : 'blob';
	return `${repo}/${kind}/${ref}/${r.target}${r.hash}`;
}

function rewriteImage(from: string, url: string) {
	const r = resolve(from, url);
	if (!r) return url;
	const local = assetUrl(r.target);
	if (!local) throw new Error(`reverser: ${from} references ${url}, which is not bundled`);
	return local;
}

type Node = { type: string; depth?: number; value?: string; url?: string; tagName?: string; properties?: Record<string, unknown>; children?: Node[] };
function walk(node: Node, fn: (n: Node) => void) {
	fn(node);
	node.children?.forEach((c) => walk(c, fn));
}

const remarkRepoLinks = (from: string) => () => (tree: Node) =>
	walk(tree, (n) => {
		if (n.type === 'link' || n.type === 'definition') n.url = rewriteLink(from, n.url!);
		if (n.type === 'image') n.url = rewriteImage(from, n.url!);
	});

// Raw HTML in the source (the README's demo <img>) only becomes elements after rehype-raw.
const rehypeRepoLinks = (from: string) => () => (tree: Node) =>
	walk(tree, (n) => {
		if (n.type !== 'element') return;
		const p = n.properties!;
		if (n.tagName === 'img' && typeof p.src === 'string') p.src = rewriteImage(from, p.src);
		if (n.tagName === 'a' && typeof p.href === 'string') {
			p.href = rewriteLink(from, p.href);
			if (isExternal(p.href as string)) {
				p.target = '_blank';
				p.rel = 'noopener';
			}
		}
	});

const text = (n: Node): string => n.value ?? n.children?.map(text).join('') ?? '';

// The first paragraph after the title, as the page's meta description.
const remarkLede = (out: { description: string }) => () => (tree: Node) => {
	const nodes = tree.children ?? [];
	const h1 = nodes.findIndex((n) => n.type === 'heading' && n.depth === 1);
	const p = nodes.slice(h1 + 1).find((n) => n.type === 'paragraph');
	const t = p ? text(p).replace(/\s+/g, ' ').trim() : '';
	out.description = t.length > 160 ? `${t.slice(0, t.lastIndexOf(' ', 157))}…` : t;
};

export async function render(src: string) {
	const lede = { description: '' };
	const md = await createMarkdownProcessor({
		syntaxHighlight: 'shiki',
		shikiConfig: { theme: 'github-dark-default', langAlias: { promql: 'plaintext' } },
		smartypants: false,
		remarkPlugins: [remarkLede(lede), remarkRepoLinks(src)],
		rehypePlugins: [rehypeRaw, rehypeRepoLinks(src)],
	});
	const { code, metadata } = await md.render(readFileSync(path.join(root, src), 'utf8'));
	const h1 = metadata.headings.find((h) => h.depth === 1)?.text ?? src;
	return {
		html: code,
		title: h1,
		description: lede.description,
		toc: metadata.headings.filter((h) => h.depth === 2),
		source: `${repo}/blob/${ref}/${src}`,
	};
}
