<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
	data: {
		kind: 'code' | 'control' | 'validation' | 'commit' | 'workflow'
		title: string
		subtitle?: string
		label?: string
		lines?: string[]
		checks?: string[]
		code?: string
		hash?: string
		message?: string
		path?: string
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

		<ul v-if="data.lines?.length" class="flow-node__list">
			<li v-for="line in data.lines" :key="line">{{ line }}</li>
		</ul>

		<ul v-if="data.checks?.length" class="flow-node__list flow-node__list--checks">
			<li v-for="check in data.checks" :key="check">{{ check }}</li>
		</ul>

		<pre v-if="data.code" class="flow-node__code"><code>{{ data.code }}</code></pre>

		<div v-if="data.kind === 'commit'" class="flow-node__commit">
			<div class="flow-node__commit-row">
				<span class="flow-node__commit-meta">commit</span>
				<span class="flow-node__commit-hash">{{ data.hash }}</span>
			</div>
			<p class="flow-node__commit-message">{{ data.message }}</p>
			<p class="flow-node__commit-path">{{ data.path }}</p>
			<p v-if="data.status" class="flow-node__status">{{ data.status }}</p>
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
.flow-node--validation,
.flow-node--workflow {
	min-height: 176px;
}

.flow-node--code {
	min-height: 240px;
}

.flow-node--commit {
	min-height: 220px;
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
.flow-node__commit-meta {
	margin: 0;
	color: #a1a1aa;
	font-size: 0.88rem;
	line-height: 1.55;
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

.flow-node__note {
	margin-top: 12px;
}
</style>
