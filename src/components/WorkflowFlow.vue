<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { VueFlow, MarkerType, type Edge, type Node } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import type { IntentExample } from '../content/home'
import FlowNode from './flow/FlowNode.vue'
import FlowEdge from './flow/FlowEdge.vue'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

const props = defineProps<{
	examples: readonly IntentExample[]
}>()

const activeIndex = ref(0)
const isCompact = ref(false)
const mediaQuery = ref<MediaQueryList | null>(null)
const pulseKey = ref(0)

const nodeTypes = {
	flowNode: FlowNode,
}

const edgeTypes = {
	pulseEdge: FlowEdge,
}

const activeExample = computed(() => props.examples[activeIndex.value] ?? props.examples[0])

const baseStyle = {
	background: 'transparent',
	border: 'none',
	padding: '0',
}

const desktopNodes = computed<Node[]>(() => {
	const example = activeExample.value

	return [
		{
			id: 'screen',
			type: 'flowNode',
			position: { x: 0, y: 96 },
			style: { ...baseStyle, width: '240px' },
			data: {
				kind: 'screen',
				label: example.sourceLabel,
				title: example.screenTitle,
				subtitle: 'A product or platform screen captures the allowed change.',
				formFields: example.screenFields,
				action: example.screenAction,
			},
		},
		{
			id: 'api',
			type: 'flowNode',
			position: { x: 280, y: 112 },
			style: { ...baseStyle, width: '240px' },
			data: {
				kind: 'api',
				label: 'Typed API call',
				title: 'The change becomes one request',
				subtitle: 'No repo path knowledge required.',
				code: example.request,
			},
		},
		{
			id: 'control',
			type: 'flowNode',
			position: { x: 560, y: 28 },
			style: { ...baseStyle, width: '320px' },
			data: {
				kind: 'control',
				label: 'ConfigButler control plane',
				title: 'Validation and conversion happen here',
				checks: example.validations,
				codeLabel: 'Desired state preview',
				code: example.output,
			},
		},
		{
			id: 'git',
			type: 'flowNode',
			position: { x: 920, y: 96 },
			style: { ...baseStyle, width: '250px' },
			data: {
				kind: 'commit',
				label: 'Git-backed output',
				title: 'Commits pile up in the customer repo',
				hash: example.commitHash,
				message: example.commitMessage,
				author: example.commitAuthor,
				date: example.commitDate,
				branch: example.commitBranch,
				path: example.commitPath,
				changedFiles: example.changedFiles,
				diff: example.commitDiff,
				commits: example.commitStack,
				status: example.status,
			},
		},
		{
			id: 'workflow',
			type: 'flowNode',
			position: { x: 1210, y: 112 },
			style: { ...baseStyle, width: '250px' },
			data: {
				kind: 'workflow',
				label: 'Customer GitOps flow',
				title: 'The normal reconciler picks it up',
				note: example.statusNote,
			},
		},
	]
})

const compactNodes = computed<Node[]>(() => {
	const example = activeExample.value

	return [
		{
			id: 'screen',
			type: 'flowNode',
			position: { x: 0, y: 0 },
			style: { ...baseStyle, width: '290px' },
			data: {
				kind: 'screen',
				label: example.sourceLabel,
				title: example.screenTitle,
				formFields: example.screenFields,
				action: example.screenAction,
			},
		},
		{
			id: 'api',
			type: 'flowNode',
			position: { x: 0, y: 292 },
			style: { ...baseStyle, width: '290px' },
			data: {
				kind: 'api',
				label: 'Typed API call',
				title: 'The change becomes one request',
				code: example.request,
			},
		},
		{
			id: 'control',
			type: 'flowNode',
			position: { x: 0, y: 598 },
			style: { ...baseStyle, width: '290px' },
			data: {
				kind: 'control',
				label: 'ConfigButler control plane',
				title: 'Validation and conversion',
				checks: example.validations,
				codeLabel: 'Desired state preview',
				code: example.output,
			},
		},
		{
			id: 'git',
			type: 'flowNode',
			position: { x: 0, y: 1062 },
			style: { ...baseStyle, width: '290px' },
			data: {
				kind: 'commit',
				label: 'Git-backed output',
				title: 'Commits pile up in the customer repo',
				hash: example.commitHash,
				message: example.commitMessage,
				author: example.commitAuthor,
				date: example.commitDate,
				branch: example.commitBranch,
				path: example.commitPath,
				changedFiles: example.changedFiles,
				diff: example.commitDiff,
				commits: example.commitStack,
				status: example.status,
			},
		},
		{
			id: 'workflow',
			type: 'flowNode',
			position: { x: 0, y: 1390 },
			style: { ...baseStyle, width: '290px' },
			data: {
				kind: 'workflow',
				label: 'Customer GitOps flow',
				title: 'The normal reconciler picks it up',
				note: example.statusNote,
			},
		},
	]
})

const nodes = computed(() => (isCompact.value ? compactNodes.value : desktopNodes.value))

const edges = computed<Edge[]>(() => {
	if (isCompact.value) {
		return [
			mainEdge('screen', 'api', 'bottom', 'top'),
			mainEdge('api', 'control', 'bottom', 'top'),
			mainEdge('control', 'git', 'bottom', 'top'),
			mainEdge('git', 'workflow', 'bottom', 'top'),
		]
	}

	return [
		mainEdge('screen', 'api', 'right', 'left'),
		mainEdge('api', 'control', 'right', 'left'),
		mainEdge('control', 'git', 'right', 'left'),
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
		type: 'pulseEdge',
		markerEnd: MarkerType.ArrowClosed,
		data: {
			pulseKey: pulseKey.value,
		},
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
	pulseKey.value += 1
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
				<p class="workflow-shell__eyebrow">Expected flow</p>
				<h2 class="workflow-shell__title">Screen edit to repo commit to customer GitOps</h2>
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

		<div class="workflow-shell__canvas" :class="{ 'is-compact': isCompact }">
			<VueFlow
				class="workflow-flow"
				:nodes="nodes"
				:edges="edges"
				:node-types="nodeTypes"
				:edge-types="edgeTypes"
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

.workflow-shell__tabs {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.workflow-shell__tab {
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

.workflow-shell__tab.is-active {
	border-color: rgba(214, 162, 78, 0.24);
	background: rgba(214, 162, 78, 0.12);
	color: #fafafa;
}

.workflow-shell__canvas {
	height: 460px;
	border-radius: 28px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	background:
		linear-gradient(180deg, rgba(214, 162, 78, 0.05), transparent 22%),
		rgba(15, 15, 18, 0.94);
	overflow: hidden;
}

.workflow-shell__canvas.is-compact {
	height: 1710px;
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
		height: 1710px;
	}
}
</style>
