// Founder photo, resolved at BUILD TIME from public/. The first candidate that
// actually exists wins; if none do, callers fall back to the dome mark, so the
// site is always safe to ship. To change the photo, drop a file in public/ and
// reorder this list — it is the single source of truth for every page.
import fs from 'node:fs';
import path from 'node:path';

const CANDIDATES = ['simon-2026.webp', 'simon-2025.webp', 'founder.jpg', 'founder.png', 'founder.webp'];

const publicDir = path.resolve('public');

export const founderPhoto: string | undefined = CANDIDATES.find((f) =>
	fs.existsSync(path.join(publicDir, f)),
);
