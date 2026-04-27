<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@vue-flow/core'

const props = defineProps<EdgeProps>()

const motion = ref<SVGAnimateMotionElement | null>(null)

const pathParts = computed(() =>
	getSmoothStepPath({
		sourceX: props.sourceX,
		sourceY: props.sourceY,
		sourcePosition: props.sourcePosition,
		targetX: props.targetX,
		targetY: props.targetY,
		targetPosition: props.targetPosition,
		borderRadius: 18,
	})
)

const edgePath = computed(() => pathParts.value[0])

async function replay() {
	await nextTick()
	motion.value?.beginElement()
}

onMounted(() => {
	replay()
})

watch(
	() => props.data?.pulseKey,
	() => {
		replay()
	}
)
</script>

<template>
	<BaseEdge :id="id" :path="edgePath" :marker-end="markerEnd" :style="style" />
	<circle r="5" fill="#d6a24e">
		<animateMotion ref="motion" :path="edgePath" dur="1.05s" rotate="auto" begin="indefinite" />
	</circle>
</template>
