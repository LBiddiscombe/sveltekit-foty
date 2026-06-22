<script lang="ts">
	import type { MinigameSketchFactory, Outcome } from '$lib/types/game';
	import P5Canvas from './P5Canvas.svelte';

	interface Props {
		oncomplete?: (outcome: Outcome) => void;
		createSketch: MinigameSketchFactory;
		outcomeText?: string | null;
	}

	let { oncomplete, createSketch, outcomeText = null }: Props = $props();

	const sketch = $derived(
		createSketch({
			onComplete: (outcome) => oncomplete?.(outcome)
		})
	);

	const outcomeColor = $derived(
		outcomeText === 'Goal!'
			? 'text-success'
			: outcomeText === 'Saved!'
				? 'text-danger'
				: outcomeText === 'Missed!'
					? 'text-subtle'
					: ''
	);
</script>

<div class="relative w-full">
	<P5Canvas {sketch} />
	{#if outcomeText}
		<div class="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-dark/80 px-4 py-4 text-center">
			<span class="font-pixel text-lg {outcomeColor}">{outcomeText}</span>
		</div>
	{/if}
</div>
