# Example manifests

The canonical KRM example manifests rendered across the site (hero panels, "how it
works", the technology page, etc.). This folder is the **single source** — pages import
these files raw and highlight them at build time via `src/components/Yaml.astro`, so
editing a manifest here updates the site.

They are illustrative but realistic, and deliberately split across **two worlds** — one per
door on the site. Keep them distinct when editing:

- **Applications / SaaS** — a fictional customer **YourCool**, whose configuration API is
  served from their own custom domain `config.yourcool.app` (default host:
  `yourcool.configbutler.ai`), backed by the Git repo `github.com/yourcool/configuration`.
  Used by the home hero, Applications, and the SaaS-flavoured Technology examples.

  The **API group and the host are deliberately different**, and this is not an
  inconsistency to tidy up: the group is `yourcool.app/v1` (`apiVersion:`), while the API is
  *served* from `config.yourcool.app`. The group names the customer's API; the subdomain is
  just where it happens to be reachable.
- **GitOps** — a deliberately *generic* platform team: no customer brand, no custom domain.
  The examples are intent resources (`DatabaseClaim`) against `platform.example`, so the
  page reads as "any platform team, any repo."

The GitOps examples must **not** adopt the YourCool naming. The two doors use two different
worlds on purpose: it shows ConfigButler serves both without forcing one narrative onto the
other.

| File | Kind | Shown on |
|------|------|----------|
| `menu.yaml` | `Menu` | Home hero — a typed setting served live (GET) |
| `menu-soldout.yaml` | *(patch)* | Home "how it works" — write path, PR + realtime conflict resolution |
| `storefront.yaml` | `Storefront` | Applications — realtime WATCH stream |
| `menu.schema.yaml` | `ConfigSchema` | Applications — the schema `Menu` derives from |
| `database-claim.yaml` | `DatabaseClaim` | GitOps — a typed write that lands as a pull request |
| `custom-domain.yaml` | `CustomDomain` | Technology — bring your own domain |
| `oidc-provider.yaml` | `OIDCProvider` | Technology — OIDC auth of your customers |
| `enroll-request.yaml` | `EnrollRequest` | Technology / contact — request an instance |

## The sold-out narrative (keep these in sync)

The `Menu` examples tell one continuous story across the site, and the commit hashes are
what make it hang together. Preserve them when editing:

1. `menu.yaml` — the hero, *before* the change. Pistachio `available: true`, at
   `configuration@1cec01d`.
2. `menu-soldout.yaml` — "how it works", *the* change. Pistachio flips to `false`,
   attributed to `sanne@yourcool.app`, landing at `configuration@c001c0de`.
3. The `git log` panel on Applications shows both hashes, newest first, with the same
   staff names.

A visitor who notices that the hash in the hero reappears in the git log three sections
later reads the whole thing as one real system. Changing a hash in one place and not the
others quietly destroys that.

URLs shown are illustrative endpoints, not live services.
