# configbutler.ai — public website

Founder-led marketing site for **ConfigButler**, a managed configuration control plane:
a typed realtime API for configuration, with every accepted change recorded in the
customer's own Git repository.

Built with [Astro](https://astro.build) (static output). CloudFlare sits in front for
HTTPS / caching.

## Commands

```sh
npm install      # install deps
npm run dev      # local dev server (http://localhost:4321)
npm run build    # static build → dist/
npm run preview  # serve the built dist/
npx playwright install chromium  # once, outside the devcontainer
npm run test:e2e # Playwright end-to-end tests against the production build
```

## Development container

[`.devcontainer/`](.devcontainer/) holds a ready environment (Node, Playwright with Chromium, `gh`,
SSH commit signing through the host agent). It follows the gitops-reverser devcontainer; see
[`.devcontainer/README.md`](.devcontainer/README.md).

## gitops-reverser submodule

[`external/gitops-reverser`](external/gitops-reverser) is a git submodule of
[ConfigButler/gitops-reverser](https://github.com/ConfigButler/gitops-reverser), the source for the
documentation corner. It is pinned to a release tag, so the site only changes when someone bumps it.

```sh
git clone --recurse-submodules https://github.com/ConfigButler/public-website.git
git submodule update --init      # in an existing clone without the submodule
git submodule status             # which commit/tag the site is pinned to
```

To move to a new gitops-reverser release:

```sh
git -C external/gitops-reverser fetch --tags
git -C external/gitops-reverser checkout vX.Y.Z
git diff --submodule=log         # what changed upstream since the last pin
# review whether docs or concepts the site relies on changed, then:
git add external/gitops-reverser && git commit -m "chore: Bump gitops-reverser to vX.Y.Z"
```

## Structure

```
src/
  layouts/Layout.astro     # shared shell: <head>, fonts, sticky nav, footer, scroll/reveal JS
  components/
    Nav.astro              # sticky header (mono links + brass-dot CTA + mobile toggle)
    Footer.astro           # dark footer
    Mark.astro             # the dome mark (SVG)
    Wordmark.astro         # configbutler.ai wordmark (brass dot)
    Icon.astro             # line-icon set (1.7 stroke)
  pages/
    index.astro            # long homepage: hero · two doors · problem · how-it-works ·
                           # features · why-different · technology · open source ·
                           # ecosystem · design-partner CTA · founder
    applications.astro     # For Applications
    gitops.astro           # For GitOps
    technology.astro       # Technology & architecture
    open-source.astro      # Open source
    about.astro            # About / founder + contact form
  styles/global.css        # design system — ALL theme tokens live in :root
  form.js                  # contact form → web3forms
```

## Brand & theming

The visual identity (forest ink `#0f1e1a` · cream `#f3ead7` · brass `#c4a35a`,
Geist + JetBrains Mono, the butler-dome mark, sharp/tight radii, mono UI chrome) comes
from the brand handoff in `design/` — see `design/assets/configbutler/tokens.css` and the
finished reference in `design/cb-landing.jsx`.

**To re-theme the whole site, edit the `:root` token block at the top of
`src/styles/global.css`.** Nothing else hardcodes a colour or font family.

> `design/` and `raw-input.md` are source/brief material, not part of the built site.

## TODO

- Check HSTS preload inclusion on https://hstspreload.org/
- Reference to personal blog
- Swap ecosystem/tech chips for real SVG logos where licensing allows
