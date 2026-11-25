// The submodule is the pin; src/lib/reverser-pin.json carries it into builds without .git (Docker).
//   node scripts/reverser-pin.mjs write   record the submodule's current commit
//   node scripts/reverser-pin.mjs check   fail if the submodule is missing or disagrees (prebuild)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const dir = 'external/gitops-reverser';
const file = 'src/lib/reverser-pin.json';
const git = (...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).trim();

if (!existsSync(`${dir}/README.md`)) {
	console.error(`${dir} is empty. Run: git submodule update --init`);
	process.exit(1);
}

const mode = process.argv[2];
let sha;
try {
	sha = git('rev-parse', 'HEAD');
} catch {
	if (mode === 'check') {
		console.log('reverser-pin: no git metadata, trusting', file);
		process.exit(0);
	}
	throw new Error('reverser-pin: cannot read the submodule commit');
}

if (mode === 'write') {
	let tag = null;
	try { tag = git('describe', '--tags', '--exact-match', 'HEAD'); } catch {}
	writeFileSync(file, JSON.stringify({ sha, tag }, null, '\t') + '\n');
	console.log(`reverser-pin: ${tag ?? sha}`);
} else if (mode === 'check') {
	const pin = JSON.parse(readFileSync(file, 'utf8'));
	if (pin.sha !== sha) {
		console.error(`reverser-pin: ${file} has ${pin.sha}, submodule is at ${sha}. Run: npm run reverser:pin`);
		process.exit(1);
	}
} else {
	console.error('usage: reverser-pin.mjs write|check');
	process.exit(2);
}
