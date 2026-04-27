<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
	data: {
		kind: 'screen' | 'api' | 'control' | 'commit' | 'workflow'
		title: string
		subtitle?: string
		label?: string
		formFields?: Array<{
			label: string
			value: string
			tone?: 'default' | 'muted' | 'accent'
		}>
		action?: string
		lines?: string[]
		checks?: string[]
		codeLabel?: string
		code?: string
		hash?: string
		message?: string
		author?: string
		date?: string
		branch?: string
		path?: string
		changedFiles?: string[]
		diff?: string
		commits?: string[]
		status?: string
		note?: string
	}
}>()
</script>

<template>
	<div class="flow-node" :class="`flow-node--${data.kind}`">
		<Handle id="left" type="target" :position="Position.Left" class="flow-node__handle" />
		<Handle id="right" type="source" :position="Position.Right" class="flow-node__handle" />
		<Handle id="top" type="target" :position="Position.Top" class="flow-node__handle" />
		<Handle id="bottom" type="source" :position="Position.Bottom" class="flow-node__handle" />

		<p v-if="data.label" class="flow-node__label">{{ data.label }}</p>
		<h3 class="flow-node__title">{{ data.title }}</h3>
		<p v-if="data.subtitle" class="flow-node__subtitle">{{ data.subtitle }}</p>

		<div v-if="data.formFields?.length" class="flow-form">
			<div
				v-for="field in data.formFields"
				:key="`${field.label}-${field.value}`"
				class="flow-form__field"
			>
				<label class="flow-form__label">{{ field.label }}</label>
				<div class="flow-form__input" :class="field.tone ? `is-${field.tone}` : ''">
					{{ field.value }}
				</div>
			</div>
			<div class="flow-form__actions">
				<button class="flow-form__button flow-form__button--secondary" type="button">Preview commit</button>
				<button v-if="data.action" class="flow-form__button flow-form__button--primary" type="button">
					{{ data.action }}
				</button>
			</div>
		</div>

		<ul v-else-if="data.lines?.length" class="flow-node__list">
			<li v-for="line in data.lines" :key="line">{{ line }}</li>
		</ul>

		<ul v-if="data.checks?.length" class="flow-node__list flow-node__list--checks">
			<li v-for="check in data.checks" :key="check">{{ check }}</li>
		</ul>

		<div v-if="data.code" class="flow-node__code-wrap">
			<p v-if="data.codeLabel" class="flow-node__code-label">{{ data.codeLabel }}</p>
			<pre class="flow-node__code"><code>{{ data.code }}</code></pre>
		</div>

		<div v-if="data.kind === 'commit'" class="flow-node__commit">
			<div class="flow-node__commit-row">
				<span class="flow-node__commit-meta">commit</span>
				<span class="flow-node__commit-hash">{{ data.hash }}</span>
			</div>
			<p v-if="data.branch" class="flow-node__commit-branch">on {{ data.branch }}</p>
			<p class="flow-node__commit-message">{{ data.message }}</p>
			<div class="flow-node__commit-details">
				<p v-if="data.author" class="flow-node__commit-detail"><span>Author</span>{{ data.author }}</p>
				<p v-if="data.date" class="flow-node__commit-detail"><span>Date</span>{{ data.date }}</p>
			</div>
			<p class="flow-node__commit-path">{{ data.path }}</p>
			<p v-if="data.status" class="flow-node__status">{{ data.status }}</p>
			<div v-if="data.changedFiles?.length" class="flow-node__changed-files">
				<p class="flow-node__code-label">Files changed</p>
				<p v-for="file in data.changedFiles" :key="file" class="flow-node__changed-file">{{ file }}</p>
			</div>
			<div v-if="data.diff" class="flow-node__code-wrap">
				<p class="flow-node__code-label">Diff preview</p>
				<pre class="flow-node__code flow-node__code--diff"><code>{{ data.diff }}</code></pre>
			</div>
			<div v-if="data.commits?.length" class="flow-node__commit-stack">
				<p v-for="commit in data.commits" :key="commit" class="flow-node__commit-item">{{ commit }}</p>
			</div>
		</div>

		<p v-if="data.note" class="flow-node__note">{{ data.note }}</p>
	</div>
</template>

<style scoped>
.flow-node {
	position: relative;
	border-radius: 18px;
	border: 1px solid rgba(255, 255, 255, 0.12);
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 24%),
		rgba(18, 18, 21, 0.96);
	padding: 18px;
	color: #fafafa;
	box-shadow: 0 18px 44px rgba(0, 0, 0, 0.18);
}

.flow-node--control,
.flow-node--workflow {
	min-height: 176px;
}

.flow-node--screen {
	min-height: 230px;
}

.flow-node--api {
	min-height: 230px;
}

.flow-node--control {
	min-height: 360px;
}

.flow-node--commit {
	min-height: 430px;
}

.flow-node__handle {
	width: 10px;
	height: 10px;
	border: 2px solid rgba(214, 162, 78, 0.8);
	background: #09090b;
}

.flow-node__label {
	margin: 0 0 10px;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: #f4d39d;
}

.flow-node__title {
	margin: 0 0 10px;
	font-family: 'Sora', system-ui, sans-serif;
	font-size: 1rem;
	letter-spacing: -0.03em;
}

.flow-node__subtitle,
.flow-node__note,
.flow-node__commit-path,
.flow-node__commit-meta,
.flow-node__code-label {
	margin: 0;
	color: #a1a1aa;
	font-size: 0.88rem;
	line-height: 1.55;
}

.flow-node__code-wrap {
	display: grid;
	gap: 10px;
}

.flow-form {
	display: grid;
	gap: 12px;
	margin-top: 2px;
}

.flow-form__field {
	display: grid;
	gap: 6px;
}

.flow-form__label {
	color: #a1a1aa;
	font-size: 0.76rem;
	font-weight: 600;
	letter-spacing: 0.02em;
}

.flow-form__input {
	display: flex;
	align-items: center;
	min-height: 38px;
	padding: 0 12px;
	border-radius: 12px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	background: rgba(9, 9, 11, 0.88);
	color: #f4f4f5;
	font-size: 0.86rem;
	font-weight: 500;
}

.flow-form__input.is-muted {
	color: #d4d4d8;
}

.flow-form__input.is-accent {
	border-color: rgba(214, 162, 78, 0.22);
	background: rgba(214, 162, 78, 0.1);
	color: #fafafa;
}

.flow-form__actions {
	display: flex;
	gap: 8px;
	margin-top: 6px;
}

.flow-form__button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 34px;
	padding: 0 10px;
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	font: inherit;
	font-size: 0.78rem;
	font-weight: 600;
}

.flow-form__button--secondary {
	background: rgba(255, 255, 255, 0.03);
	color: #d4d4d8;
}

.flow-form__button--primary {
	background: rgba(214, 162, 78, 0.16);
	border-color: rgba(214, 162, 78, 0.22);
	color: #fafafa;
}

.flow-node__list {
	display: grid;
	gap: 10px;
	margin: 0;
	padding: 0;
	list-style: none;
}

.flow-node__list li {
	position: relative;
	padding-left: 18px;
	color: #d4d4d8;
	font-size: 0.9rem;
	line-height: 1.5;
}

.flow-node__list li::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0.56rem;
	width: 7px;
	height: 7px;
	border-radius: 999px;
	background: #d6a24e;
	box-shadow: 0 0 0 4px rgba(214, 162, 78, 0.08);
}

.flow-node__list--checks li::before {
	background: #f4d39d;
}

.flow-node__code-label {
	font-size: 0.78rem;
	text-transform: uppercase;
	letter-spacing: 0.06em;
}

.flow-node__code {
	margin: 0;
	padding: 14px;
	border-radius: 14px;
	border: 1px solid rgba(255, 255, 255, 0.08);
	background: rgba(9, 9, 11, 0.9);
	color: #e4e4e7;
	font-family: 'IBM Plex Mono', ui-monospace, monospace;
	font-size: 0.78rem;
	line-height: 1.55;
	overflow-x: auto;
}

.flow-node__commit {
	display: grid;
	gap: 10px;
}

.flow-node__commit-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.flow-node__commit-hash {
	color: #f4d39d;
	font-family: 'IBM Plex Mono', ui-monospace, monospace;
	font-size: 0.82rem;
}

.flow-node__commit-message {
	margin: 0;
	font-weight: 700;
	line-height: 1.45;
}

.flow-node__commit-branch {
	margin: -4px 0 0;
	color: #f4d39d;
	font-family: 'IBM Plex Mono', ui-monospace, monospace;
	font-size: 0.76rem;
}

.flow-node__commit-details {
	display: grid;
	gap: 4px;
}

.flow-node__commit-detail {
	display: flex;
	justify-content: space-between;
	gap: 12px;
	margin: 0;
	color: #d4d4d8;
	font-size: 0.78rem;
	font-family: 'IBM Plex Mono', ui-monospace, monospace;
}

.flow-node__commit-detail span {
	color: #a1a1aa;
}

.flow-node__status {
	display: inline-flex;
	align-items: center;
	width: fit-content;
	min-height: 34px;
	padding: 0 12px;
	border-radius: 999px;
	border: 1px solid rgba(214, 162, 78, 0.24);
	background: rgba(214, 162, 78, 0.12);
	color: #fafafa;
	font-size: 0.84rem;
	font-weight: 600;
}

.flow-node__changed-files {
	display: grid;
	gap: 6px;
}

.flow-node__changed-file {
	margin: 0;
	padding: 7px 9px;
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 0.08);
	background: rgba(255, 255, 255, 0.03);
	color: #d4d4d8;
	font-family: 'IBM Plex Mono', ui-monospace, monospace;
	font-size: 0.73rem;
	line-height: 1.4;
}

.flow-node__code--diff {
	font-size: 0.73rem;
}

.flow-node__commit-stack {
	display: grid;
	gap: 8px;
	margin-top: 4px;
}

.flow-node__commit-item {
	margin: 0;
	padding: 8px 10px;
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 0.08);
	background: rgba(255, 255, 255, 0.03);
	color: #d4d4d8;
	font-family: 'IBM Plex Mono', ui-monospace, monospace;
	font-size: 0.74rem;
	line-height: 1.45;
}

.flow-node__note {
	margin-top: 12px;
}
</style>
