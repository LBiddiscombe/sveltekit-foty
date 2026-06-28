<script lang="ts">
	import type { MinigameSketchFactory, Outcome } from '$lib/types/game';
	import P5Canvas from './P5Canvas.svelte';

	interface Props {
		oncomplete?: (outcome: Outcome) => void;
		createSketch: MinigameSketchFactory;
		outcomeText?: string | null;
		gameName?: string;
		showCrowd?: boolean;
		skipIntro?: boolean;
	}

	let {
		oncomplete,
		createSketch,
		outcomeText = null,
		gameName = '',
		showCrowd = true,
		skipIntro = false
	}: Props = $props();

	const INTRO_DELAY = 1500;

	let showIntro = $state(true);
	let sketch = $state<ReturnType<MinigameSketchFactory>['sketch']>();
	let start = $state<ReturnType<MinigameSketchFactory>['start']>();

	$effect(() => {
		const result = createSketch({
			onComplete: (outcome) => oncomplete?.(outcome),
			showCrowd
		});
		sketch = result.sketch;
		start = result.start;
	});

	$effect(() => {
		if (skipIntro) {
			showIntro = false;
			start?.();
			return;
		}
		const timeout = setTimeout(() => {
			showIntro = false;
			start?.();
		}, INTRO_DELAY);
		return () => clearTimeout(timeout);
	});

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
	{#if sketch}
		<P5Canvas {sketch} />
	{/if}
	{#if showIntro}
		<div class="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-dark/80 px-4 py-4 text-center">
			<span class="font-pixel text-lg text-primary">{gameName}</span>
		</div>
	{:else if outcomeText}
		<div class="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-dark/80 px-4 py-4 text-center">
			<span class="font-pixel text-lg {outcomeColor}">{outcomeText}</span>
		</div>
	{/if}
</div>
