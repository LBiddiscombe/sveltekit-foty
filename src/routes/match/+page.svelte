<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { match } from '$lib/stores/match.svelte';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	$effect(() => {
		season.phase = 'match';
	});

	let currentChance = $state(0);
	let step = $state<'playing' | 'result'>('playing');

	onMount(() => {
		if (match.result === null) {
			const chances = player.deck[0] ?? 1;
			match.play(chances);
		}
		if ($page.url.searchParams.has('skipped')) {
			step = 'result';
		}
	});

	const outcomes = $derived(match.result?.outcomes ?? []);
	const currentOutcome = $derived(outcomes[currentChance] ?? 'goal');

	function nextChance() {
		if (currentChance < outcomes.length - 1) {
			currentChance++;
		} else {
			step = 'result';
		}
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-4">
	{#if match.result === null}
		<p class="font-pixel text-xs text-subtle">Loading...</p>
	{:else if step === 'playing'}
		<Card>
			<div class="flex flex-col items-center gap-4 py-8 text-center">
				<span class="font-pixel text-sm text-primary">
					Chance {currentChance + 1} of {outcomes.length}
				</span>
				<span class="font-pixel text-2xl uppercase text-warning">{currentOutcome}</span>
			</div>
		</Card>

		<Button onclick={nextChance}>
			{currentChance < outcomes.length - 1 ? 'Next Chance' : 'See Result'}
		</Button>
	{:else}
		<Card>
			<div class="flex flex-col items-center gap-2 py-4 text-center">
				<span class="font-pixel text-sm text-primary">Full Time</span>
				<span class="font-pixel text-3xl text-success">
					{match.result.score[0]} - {match.result.score[1]}
				</span>
				<span class="font-pixel text-xs text-subtle">Rating: {match.result.rating}/10</span>
			</div>
		</Card>

		<Button onclick={async () => await goto('/vidiprinter')}>Continue</Button>
	{/if}
</div>
