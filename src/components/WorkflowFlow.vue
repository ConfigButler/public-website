<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { VueFlow, MarkerType, type Edge, type Node } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import type { IntentExample } from '../content/home'
import FlowNode from './flow/FlowNode.vue'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

const props = defineProps<{
	examples: readonly IntentExample[]
}>()

const activeIndex = ref(0)
const isCompact = ref(false)
const mediaQuery = ref<MediaQueryList | null>(null)

const nodeTypes = {
	flowNode: FlowNode,
}

const activeExample = computed(() => props.examples[activeIndex.value] ?? props.examples[0])

const sources = [
	{ id: 'human', label: 'Human' },
	{ id: 'agent', label: 'AI agent' },
	{ id: 'automation', label: 'Automation' },
] as const

const baseStyle = {
	background: 'transparent',
	border: 'none',
	padding: '0',
}

const desktopNodes = computed<Node[]>(() => {
	const example = activeExample.value

	return [
		{
			id: 'request',
			type: 'flowNode',
			position: { x: 0, y: 20 },
			style: { ...baseStyle, width: '332px' },
			data: {
				kind: 'code',
				label: example.sourceLabel,
				title: 'Intent payload',
				subtitle: 'One safe input instead of direct repo edits, tickets, or brittle admin clicks.',
				code: example.request,
			},
		},
		{
			id: 'frontdoor',
			type: 'flowNode',
			position: { x: 380, y: 40 },
			style: { ...baseStyle, width: '250px' },
			data: {
				kind: 'control',
				label: 'ConfigButler',
				title: 'API + GUI',
				lines: ['Typed operations', 'Safe self-service', 'One controlled front door'],
			},
		},
		{
			id: 'validation',
			type: 'flowNode',
			position: { x: 690, y: 20 },
			style: { ...baseStyle, width: '312px' },
			data: {
				kind: 'validation',
				label: 'Before write-back',
				title: 'Typed intent + validation + policy',
				checks: example.validations,
			},
		},
		{
			id: 'output',
			type: 'flowNode',
			position: { x: 0, y: 330 },
			style: { ...baseStyle, width: '470px' },
			data: {
				kind: 'code',
				label: 'Accepted change',
				title: 'Generated YAML',
				subtitle: 'The resulting desired state is explicit before it becomes part of the repo.',
				code: example.output,
			},
		},
		{
			id: 'git',
			type: 'flowNode',
			position: { x: 530, y: 350 },
			style: { ...baseStyle, width: '340px' },
			data: {
				kind: 'commit',
				label: 'Git-backed outcome',
				title: 'Commit or pull request',
				hash: example.commitHash,
				message: example.commitMessage,
				path: example.commitPath,
				status: example.status,
			},
		},
		{
			id: 'workflow',
			type: 'flowNode',
			position: { x: 930, y: 365 },
			style: { ...baseStyle, width: '270px' },
			data: {
				kind: 'workflow',
				label: 'Existing workflow',
				title: 'Flux, Argo CD, review, or approval continues unchanged',
				note: example.statusNote,
			},
		},
	]
})

const compactNodes = computed<Node[]>(() => {
	const example = activeExample.value

	return [
		{
			id: 'request',
			type: 'flowNode',
			position: { x: 0, y: 0 },
			style: { ...baseStyle, width: '290px' },
			data: {
				kind: 'code',
				label: example.sourceLabel,
				title: 'Intent payload',
				code: example.request,
			},
		},
		{
			id: 'frontdoor',
			type: 'flowNode',
			position: { x: 18, y: 280 },
			style: { ...baseStyle, width: '254px' },
			data: {
				kind: 'control',
				label: 'ConfigButler',
				title: 'API + GUI',
				lines: ['Typed operations', 'Safe self-service', 'One controlled front door'],
			},
		},
		{
			id: 'validation',
			type: 'flowNode',
			position: { x: 0, y: 520 },
			style: { ...baseStyle, width: '290px' },
			data: {
				kind: 'validation',
				label: 'Before write-back',
				title: 'Validation + policy',
				checks: example.validations,
			},
		},
		{
			id: 'output',
			type: 'flowNode',
			position: { x: 0, y: 820 },
			style: { ...baseStyle, width: '290px' },
			data: {
				kind: 'code',
				label: 'Accepted change',
				title: 'Generated YAML',
				code: example.output,
			},
		},
		{
			id: 'git',
			type: 'flowNode',
			position: { x: 0, y: 1150 },
			style: { ...baseStyle, width: '290px' },
			data: {
				kind: 'commit',
				label: 'Git-backed outcome',
				title: 'Commit or pull request',
				hash: example.commitHash,
				message: example.commitMessage,
				path: example.commitPath,
				status: example.status,
			},
		},
		{
			id: 'workflow',
			type: 'flowNode',
			position: { x: 10, y: 1450 },
			style: { ...baseStyle, width: '270px' },
			data: {
				kind: 'workflow',
				label: 'Existing workflow',
				title: 'Review, approval, and reconciliation continue',
				note: example.statusNote,
			},
		},
	]
})

const nodes = computed(() => (isCompact.value ? compactNodes.value : desktopNodes.value))

const edges = computed<Edge[]>(() => {
	if (isCompact.value) {
		return [
			mainEdge('request', 'frontdoor', 'bottom', 'top'),
			mainEdge('frontdoor', 'validation', 'bottom', 'top'),
			mainEdge('validation', 'output', 'bottom', 'top'),
			mainEdge('output', 'git', 'bottom', 'top'),
			mainEdge('git', 'workflow', 'bottom', 'top'),
		]
	}

	return [
		mainEdge('request', 'frontdoor', 'right', 'left'),
		mainEdge('frontdoor', 'validation', 'right', 'left'),
		mainEdge('validation', 'output', 'bottom', 'right'),
		mainEdge('output', 'git', 'right', 'left'),
		mainEdge('git', 'workflow', 'right', 'left'),
	]
})

function mainEdge(source: string, target: string, sourceHandle: string, targetHandle: string): Edge {
	return {
		id: `${source}-${target}`,
		source,
		target,
		sourceHandle,
		targetHandle,
		type: 'smoothstep',
		animated: true,
		markerEnd: MarkerType.ArrowClosed,
		style: {
			stroke: '#d6a24e',
			strokeWidth: 2,
		},
	}
}

function syncMode() {
	isCompact.value = window.matchMedia('(max-width: 960px)').matches
}

function setExample(index: number) {
	activeIndex.value = index
}

onMounted(() => {
	syncMode()
	mediaQuery.value = window.matchMedia('(max-width: 960px)')
	if (mediaQuery.value.addEventListener) {
		mediaQuery.value.addEventListener('change', syncMode)
	} else {
		mediaQuery.value.addListener(syncMode)
	}
})

onBeforeUnmount(() => {
	if (!mediaQuery.value) return
	if (mediaQuery.value.removeEventListener) {
		mediaQuery.value.removeEventListener('change', syncMode)
	} else {
		mediaQuery.value.removeListener(syncMode)
	}
})
</script>

<template>
	<div class="workflow-shell">
		<div class="workflow-shell__header">
			<div>
				<p class="workflow-shell__eyebrow">Intent to Commit</p>
				<h2 class="workflow-shell__title">A clear workflow, with room to breathe</h2>
			</div>
			<div class="workflow-shell__tabs" role="tablist" aria-label="Workflow examples">
				<button
					v-for="(example, index) in examples"
					:key="example.id"
					class="workflow-shell__tab"
					:class="{ 'is-active': index === activeIndex }"
					type="button"
					role="tab"
					:aria-selected="index === activeIndex"
					@click="setExample(index)"
				>
					{{ example.label }}
				</button>
			</div>
		</div>

		<div class="workflow-shell__sources" aria-label="Supported request sources">
			<span
				v-for="source in sources"
				:key="source.id"
				class="workflow-shell__source"
				:class="{ 'is-active': source.id === activeExample.source }"
			>
				{{ source.label }}
			</span>
		</div>

		<div class="workflow-shell__canvas" :class="{ 'is-compact': isCompact }">
			<VueFlow
				class="workflow-flow"
				:nodes="nodes"
				:edges="edges"
				:node-types="nodeTypes"
				:nodes-draggable="false"
				:nodes-connectable="false"
				:elements-selectable="false"
				:zoom-on-scroll="false"
				:zoom-on-pinch="false"
				:pan-on-drag="false"
				:double-click-zoom="false"
				:min-zoom="0.65"
				:max-zoom="1"
				fit-view-on-init
				:fit-view-on-init-options="{ padding: isCompact ? 0.16 : 0.1 }"
			>
				<Background :gap="22" :size="1" color="rgba(255, 255, 255, 0.08)" />
				<Controls position="bottom-right" :show-interactive="false" />
			</VueFlow>
		</div>
	</div>
</template>

<style scoped>
.workflow-shell {
	display: grid;
	gap: 18px;
}

.workflow-shell__header {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 20px;
}

.workflow-shell__eyebrow {
	margin: 0 0 10px;
	font-size: 0.74rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: #f4d39d;
}

.workflow-shell__title {
	margin: 0;
	font-family: 'Sora', system-ui, sans-serif;
	font-size: 1.45rem;
	letter-spacing: -0.03em;
}

.workflow-shell__tabs,
.workflow-shell__sources {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.workflow-shell__tab,
.workflow-shell__source {
	display: inline-flex;
	align-items: center;
	min-height: 38px;
	padding: 0 12px;
	border-radius: 999px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	background: rgba(255, 255, 255, 0.03);
	font: inherit;
	font-size: 0.88rem;
	font-weight: 600;
	color: #a1a1aa;
}

.workflow-shell__tab {
	cursor: pointer;
	transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
}

.workflow-shell__tab.is-active,
.workflow-shell__source.is-active {
	border-color: rgba(214, 162, 78, 0.24);
	background: rgba(214, 162, 78, 0.12);
	color: #fafafa;
}

.workflow-shell__canvas {
	height: 720px;
	border-radius: 28px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	background:
		linear-gradient(180deg, rgba(214, 162, 78, 0.05), transparent 22%),
		rgba(15, 15, 18, 0.94);
	overflow: hidden;
}

.workflow-shell__canvas.is-compact {
	height: 1160px;
}

.workflow-flow {
	width: 100%;
	height: 100%;
}

:deep(.vue-flow__controls) {
	box-shadow: none;
}

:deep(.vue-flow__controls-button) {
	width: 34px;
	height: 34px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	background: rgba(24, 24, 27, 0.96);
	color: #fafafa;
}

:deep(.vue-flow__controls-button:hover) {
	background: rgba(214, 162, 78, 0.12);
}

:deep(.vue-flow__attribution) {
	display: none;
}

@media (max-width: 1120px) {
	.workflow-shell__header {
		flex-direction: column;
		align-items: flex-start;
	}
}

@media (max-width: 780px) {
	.workflow-shell__title {
		font-size: 1.28rem;
	}

	.workflow-shell__canvas {
		height: 1080px;
	}

	.workflow-shell__canvas.is-compact {
		height: 1080px;
	}
}
</style>
