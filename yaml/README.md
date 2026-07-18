# Example manifests

The canonical KRM example manifests rendered across the site (hero panels, "how it
works", the technology page, etc.). This folder is the **single source** — pages import
these files raw and highlight them at build time via `src/components/Yaml.astro`, so
editing a manifest here updates the site.

They are illustrative but realistic: a fictional customer **yourneat** whose configuration
API is served from their own custom domain `config.yourneat.app` (default host:
`yourneat.configbutler.ai`), backed by the Git repo `github.com/yourneat/platform-config`.

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
