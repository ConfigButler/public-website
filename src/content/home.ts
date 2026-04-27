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
			id: 'scale-workers',
			label: 'Scale checkout workers',
			source: 'human',
			sourceLabel: 'Platform user',
			screenTitle: 'Edit scaling for checkout-worker',
			screenFields: [
				{ label: 'Service', value: 'checkout-worker', tone: 'muted' },
				{ label: 'Environment', value: 'production', tone: 'accent' },
				{ label: 'Min replicas', value: '6' },
				{ label: 'Max replicas', value: '20' },
				{ label: 'CPU target', value: '70%' },
			],
			screenAction: 'Save scaling change',
			request: `{
  "operation": "updateScaling",
  "service": "checkout-worker",
  "environment": "production",
  "minReplicas": 6,
  "maxReplicas": 20,
  "targetCPU": 70
}`,
			validations: [
				'commerce platform team owns checkout-worker',
				'Production scaling stays within guardrails',
				'Fields map to approved values paths',
				'Change window for production is open',
			],
			output: `apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: checkout-worker
  namespace: commerce
spec:
  chart:
    spec:
      chart: checkout-worker
      sourceRef:
        kind: HelmRepository
        name: platform-charts
        namespace: flux-system
      version: 1.14.2
  values:
    autoscaling:
      enabled: true
      minReplicas: 6
      maxReplicas: 20
      targetCPUUtilizationPercentage: 70`,
			commitHash: '12f9b34',
			commitMessage: 'Scale checkout-worker autoscaling in production',
			commitAuthor: 'ConfigButler <commits@configbutler.ai>',
			commitDate: '2026-04-27 14:12:08 +0000',
			commitBranch: 'main',
			commitPath: 'clusters/production/apps/checkout-worker/helmrelease.yaml',
			changedFiles: ['clusters/production/apps/checkout-worker/helmrelease.yaml'],
			commitDiff: `@@ -18,8 +18,8 @@ spec:
   autoscaling:
     enabled: true
-    minReplicas: 4
-    maxReplicas: 12
+    minReplicas: 6
+    maxReplicas: 20
     targetCPUUtilizationPercentage: 70`,
			commitStack: [
				'12f9b34 Scale checkout-worker autoscaling in production',
				'0e41aa9 Rotate payments-api secret ref in staging',
				'be88211 Add partner-portal ingress in sandbox',
			],
			status: 'Detected by customer GitOps controller',
			statusNote: 'Flux or Argo CD sees the new commit and reconciles it using the workflow the customer already trusts.',
		},
		{
			id: 'partner-hostname',
			label: 'Add partner hostname',
			source: 'human',
			sourceLabel: 'Platform user',
			screenTitle: 'Edit ingress for partner-portal',
			screenFields: [
				{ label: 'Service', value: 'partner-portal', tone: 'muted' },
				{ label: 'Environment', value: 'sandbox', tone: 'accent' },
				{ label: 'Hostname', value: 'acme.demo.example.com' },
				{ label: 'TLS secret', value: 'partner-portal-tls' },
				{ label: 'Path', value: '/' },
			],
			screenAction: 'Save ingress change',
			request: `{
  "operation": "setIngressHostname",
  "service": "partner-portal",
  "environment": "sandbox",
  "hostname": "acme.demo.example.com",
  "tlsSecret": "partner-portal-tls"
}`,
			validations: [
				'b2b team owns partner-portal in sandbox',
				'Hostname matches approved domain rules',
				'TLS secret naming policy passes',
				'Ingress target resolves to the correct repo path',
			],
			output: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: partner-portal
  namespace: b2b
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - acme.demo.example.com
      secretName: partner-portal-tls
  rules:
    - host: acme.demo.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: partner-portal
                port:
                  number: 8080`,
			commitHash: '5bc201a',
			commitMessage: 'Add sandbox hostname for partner-portal',
			commitAuthor: 'ConfigButler <commits@configbutler.ai>',
			commitDate: '2026-04-27 14:16:44 +0000',
			commitBranch: 'main',
			commitPath: 'clusters/sandbox/b2b/partner-portal/ingress.yaml',
			changedFiles: ['clusters/sandbox/b2b/partner-portal/ingress.yaml'],
			commitDiff: `@@ -9,6 +9,11 @@ spec:
   ingressClassName: nginx
+  tls:
+    - hosts:
+        - acme.demo.example.com
+      secretName: partner-portal-tls
   rules:
     - host: acme.demo.example.com`,
			commitStack: [
				'5bc201a Add sandbox hostname for partner-portal',
				'44bc50f Increase worker queue depth for billing-sync',
				'7fa0d92 Pin redis chart version in staging',
			],
			status: 'Detected by customer GitOps controller',
			statusNote: 'Git stays in the loop for history, review, and reconciliation. ConfigButler just gives teams a safer front door.',
		},
		{
			id: 'pin-chart-version',
			label: 'Pin chart version',
			source: 'human',
			sourceLabel: 'Platform user',
			screenTitle: 'Update release target for billing-api',
			screenFields: [
				{ label: 'Application', value: 'billing-api', tone: 'muted' },
				{ label: 'Environment', value: 'staging', tone: 'accent' },
				{ label: 'Chart version', value: '2.8.4' },
				{ label: 'Values profile', value: 'staging' },
				{ label: 'Approval policy', value: 'release-managed' },
			],
			screenAction: 'Pin release target',
			request: `{
  "operation": "pinChartVersion",
  "application": "billing-api",
  "environment": "staging",
  "targetRevision": "2.8.4",
  "actor": "platform-user"
}`,
			validations: [
				'Platform user is allowed to update staging',
				'2.8.4 exists in the approved chart set',
				'Application target is mapped to the right project',
				'Promotion policy allows this revision in staging',
			],
			output: `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: billing-api
  namespace: argocd
spec:
  project: billing
  source:
    repoURL: https://github.com/customer/platform-apps.git
    path: charts/billing-api
    chart: billing-api
    targetRevision: 2.8.4
  destination:
    server: https://kubernetes.default.svc
    namespace: billing`,
			commitHash: '91ce2de',
			commitMessage: 'Pin billing-api staging chart to 2.8.4',
			commitAuthor: 'ConfigButler <commits@configbutler.ai>',
			commitDate: '2026-04-27 14:23:19 +0000',
			commitBranch: 'release/staging',
			commitPath: 'argocd/apps/billing-api-staging.yaml',
			changedFiles: ['argocd/apps/billing-api-staging.yaml'],
			commitDiff: `@@ -11,5 +11,5 @@ spec:
   source:
     chart: billing-api
-    targetRevision: 2.8.3
+    targetRevision: 2.8.4
   destination:
     namespace: billing`,
			commitStack: [
				'91ce2de Pin billing-api staging chart to 2.8.4',
				'3da62c1 Add preview DNS entry for mobile-web',
				'241fe19 Raise checkout-worker max replicas in prod',
			],
			status: 'Detected by customer GitOps controller',
			statusNote: 'Built for platform teams today. Ready for automation and agents tomorrow.',
		},
	],
} as const;

export type IntentExample = (typeof home.intentExamples)[number];
