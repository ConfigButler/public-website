export const home = {
	title: 'ConfigButler \u2014 Intent in. Commit out.',
	description:
		'ConfigButler turns configuration intent from humans, systems, and AI agents into validated Git-backed commits.',
	tagline: 'Intent in. Commit out.',
	headline: 'Turn configuration intent into commits',
	subheadline:
		'ConfigButler gives humans and AI agents a safe API and GUI for changing configuration \u2014 while every accepted change is validated and recorded in Git for ownership, auditability, and control.',
	primaryCta: {
		label: 'Book a configuration workflow pilot',
		href: '#pilot',
	},
	secondaryCta: {
		label: 'See the GitOps demo',
		href: '#intent-to-commit',
	},
	nav: [
		{ label: 'Problem', href: '#problem' },
		{ label: 'Solution', href: '#solution' },
		{ label: 'How it works', href: '#how-it-works' },
		{ label: 'Pilot', href: '#pilot' },
	],
	problemChoices: [
		'Give people direct access and hope they are careful',
		'Force every change through slow expert workflows',
		'Build custom internal tools for every product',
		'Let AI agents operate through brittle, product-specific paths',
	],
	solutionCards: [
		{
			title: 'Typed API',
			copy: 'Expose safe operations as real resources and inputs, not ad hoc scripts and undocumented YAML edits.',
		},
		{
			title: 'Clean GUI',
			copy: 'Give teams a focused interface for common changes without teaching every user your repository layout.',
		},
		{
			title: 'Validation before Git',
			copy: 'Reject bad requests before anything is written by checking schema, policy, ownership, and environment rules.',
		},
		{
			title: 'Policy and permissions',
			copy: 'Control what each team, service, or agent is allowed to change and under which conditions.',
		},
		{
			title: 'Git-backed audit trail',
			copy: 'Every accepted change becomes a commit or pull request the customer owns inside their existing Git workflow.',
		},
		{
			title: 'Works with existing workflows',
			copy: 'Keep Flux, Argo CD, reviews, promotion, and reconciliation in place while improving the front door.',
		},
	],
	workflows: [
		'Request a preview environment',
		'Change customer-specific configuration',
		'Manage feature flags',
		'Provision a platform resource',
		'Promote configuration between environments',
		'Update application settings safely',
	],
	steps: [
		{
			title: 'Connect an existing source',
			copy: 'Point ConfigButler at a configuration repository or another Git-backed source of desired state.',
		},
		{
			title: 'Define allowed operations',
			copy: 'Model the changes you want to offer and set the schema, boundaries, and permissions around them.',
		},
		{
			title: 'Expose API and GUI',
			copy: 'Publish those operations through a typed API and a narrow interface for the people who need them.',
		},
		{
			title: 'Validate before write-back',
			copy: 'Check intent, policy, ownership, and environment rules before anything is committed.',
		},
		{
			title: 'Record the accepted change',
			copy: 'Write a commit or open a pull request so history, review, ownership, and reconciliation stay intact.',
		},
	],
	agentPoints: [
		'typed operations',
		'explicit validation',
		'controlled permissions',
		'auditable change history',
		'Git-backed ownership',
	],
	pilotItems: [
		'Intake of your current workflow',
		'Selection of one high-value use case',
		'API and resource design',
		'Git write-back flow',
		'Basic GUI',
		'Demo, handover, and clear next-step recommendations',
	],
	credibilityItems: [
		'gitops-reverser as the open-source engine and proof of concept',
		'Reverse GitOps as the technical idea behind intent-to-Git workflows',
		'Existing GitOps tools remain part of the operational workflow',
	],
	footerLinks: [
		{ label: 'GitHub', href: 'https://github.com/ConfigButler' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/company/configbutler' },
		{ label: 'Contact', href: '#pilot' },
		{ label: 'Reverse GitOps', href: '#credibility' },
	],
	intentExamples: [
		{
			id: 'preview-environment',
			label: 'Preview environment',
			source: 'human',
			sourceLabel: 'Human request',
			request: `{
  "kind": "EnvironmentRequest",
  "name": "preview-pr-482",
  "team": "payments",
  "template": "web-service",
  "expiresIn": "48h"
}`,
			validations: [
				'Schema matches EnvironmentRequest',
				'payments team owns target namespace',
				'web-service template is approved',
				'48h lifetime is within policy',
			],
			output: `apiVersion: platform.example.com/v1
kind: PreviewEnvironment
metadata:
  name: preview-pr-482
  namespace: payments
spec:
  template: web-service
  expiresAfter: 48h`,
			commitHash: '8f3a91c',
			commitMessage: 'Create preview environment for payments/pr-482',
			commitPath: 'environments/previews/preview-pr-482.yaml',
			status: 'Ready for Flux / review',
			statusNote: 'Git remains the audit trail, not necessarily the front door.',
		},
		{
			id: 'feature-flag',
			label: 'Feature flag',
			source: 'agent',
			sourceLabel: 'AI agent',
			request: `{
  "kind": "FeatureFlagChange",
  "flag": "checkout-one-click",
  "team": "growth",
  "environment": "staging",
  "value": true
}`,
			validations: [
				'Flag exists in the shared schema',
				'growth team is allowed to change staging',
				'Boolean value passes policy',
				'Write target resolves to the right repo path',
			],
			output: `apiVersion: flags.example.com/v1
kind: FeatureFlag
metadata:
  name: checkout-one-click
  namespace: growth
spec:
  environment: staging
  enabled: true`,
			commitHash: '1c7de42',
			commitMessage: 'Enable checkout-one-click in staging for growth',
			commitPath: 'apps/growth/staging/flags/checkout-one-click.yaml',
			status: 'Ready for Argo CD / review',
			statusNote: 'Built for platform teams today. Ready for AI agents tomorrow.',
		},
		{
			id: 'promotion',
			label: 'Config promotion',
			source: 'automation',
			sourceLabel: 'Automation',
			request: `{
  "kind": "PromotionRequest",
  "service": "billing-api",
  "fromEnvironment": "staging",
  "toEnvironment": "production",
  "imageTag": "2026.04.27-1"
}`,
			validations: [
				'Promotion path staging \u2192 production is allowed',
				'Requested tag exists in the approved set',
				'Change window for production is open',
				'Ownership and approval requirements are satisfied',
			],
			output: `apiVersion: deploy.example.com/v1
kind: ReleasePromotion
metadata:
  name: billing-api-production
spec:
  from: staging
  to: production
  imageTag: 2026.04.27-1`,
			commitHash: '54d0be9',
			commitMessage: 'Promote billing-api image tag 2026.04.27-1 to production',
			commitPath: 'services/billing-api/production/release.yaml',
			status: 'Ready for deployment workflow',
			statusNote: 'API-first. Agent-ready. Git-recorded.',
		},
	],
} as const;

export type IntentExample = (typeof home.intentExamples)[number];
