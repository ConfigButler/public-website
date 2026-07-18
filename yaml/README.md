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
- **GitOps** — a deliberately *generic* platform team: no customer brand, no custom domain.
  The examples are intent resources (`DatabaseClaim`) against `platform.example`, so the
  page reads as "any platform team, any repo."

The GitOps examples must **not** adopt the YourCool naming. The two doors use two different
worlds on purpose: it shows ConfigButler serves both without forcing one narrative onto the
other.

| File | Kind | Shown on |
|------|------|----------|
| `billing-settings.yaml` | `BillingSettings` | Home hero — a typed setting served live (GET) |
| `billing-change.yaml` | *(patch)* | Home "how it works" — write path, PR + realtime conflict resolution |
| `feature-settings.yaml` | `FeatureSettings` | Applications — realtime WATCH stream |
| `feature-settings.schema.yaml` | `ConfigSchema` | Applications — the schema you author |
| `database-claim.yaml` | `DatabaseClaim` | GitOps — a typed write that lands as a pull request |
| `custom-domain.yaml` | `CustomDomain` | Technology — bring your own domain |
| `oidc-provider.yaml` | `OIDCProvider` | Technology — OIDC auth of your customers |
| `enroll-request.yaml` | `EnrollRequest` | Technology / contact — request an instance |

URLs shown are illustrative endpoints, not live services.
