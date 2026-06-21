<script lang="ts">
	import type { Outcome } from '$lib/types/game';
	import P5Canvas from './P5Canvas.svelte';
	import { createPenaltySketch } from './PenaltySketch';

	interface Props {
		oncomplete?: (outcome: Outcome) => void;
	}

	let { oncomplete }: Props = $props();

	const sketch = $derived(createPenaltySketch({
		onComplete: (outcome) => oncomplete?.(outcome)
	}));
</script>

<P5Canvas {sketch} />
