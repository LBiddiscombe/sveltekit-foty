<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { match } from '$lib/stores/match.svelte';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import Minigame from '$lib/components/minigames/Minigame.svelte';
	import { createPenaltySketch } from '$lib/components/minigames/PenaltySketch';
	import { createVolleySketch } from '$lib/components/minigames/VolleySketch';
	import type { Outcome } from '$lib/types/game';

	type GameType = 'penalty' | 'volley';

	$effect(() => {
		season.phase = 'match';
	});

	let currentChance = $state(0);
	let gameType = $state<GameType>('penalty');
	let step = $state<'playing' | 'result'>('playing');
	let awaitingAdvance = $state(false);
	let currentOutcomeText = $state<string | null>(null);

	function pickGameType(): GameType {
		return Math.random() < 0.5 ? 'penalty' : 'volley';
	}

	onMount(() => {
		if (match.totalChances) return;
		const chances = player.deck[0] ?? 1;
		if ($page.url.searchParams.has('skipped')) {
			match.skip(chances);
			step = 'result';
		} else {
			gameType = pickGameType();
			match.start(chances);
		}
	});

	const finalResult = $derived(match.result);

	function handleComplete(outcome: Outcome) {
		if (awaitingAdvance) return;
		awaitingAdvance = true;

		currentOutcomeText =
			outcome === 'goal' ? 'Goal!'
			: outcome === 'saved' ? 'Saved!'
			: 'Missed!';

		match.recordOutcome(outcome);

		setTimeout(() => {
			currentOutcomeText = null;
			awaitingAdvance = false;
			if (currentChance < match.totalChances - 1) {
				currentChance++;
				gameType = pickGameType();
			} else {
				step = 'result';
			}
		}, 1500);
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-4">
	{#if match.totalChances === 0}
		<p class="font-pixel text-xs text-subtle">Loading...</p>
	{:else if step === 'playing'}
		<div class="flex w-full flex-col items-center gap-4">
			<span class="font-pixel text-sm text-primary">
				Chance {currentChance + 1} of {match.totalChances}
			</span>

			{#key currentChance}
				<Minigame
					oncomplete={handleComplete}
					createSketch={gameType === 'penalty' ? createPenaltySketch : createVolleySketch}
					outcomeText={currentOutcomeText}
				/>
			{/key}
		</div>
	{:else}
		<Card>
			<div class="flex flex-col items-center gap-2 py-4 text-center">
				<span class="font-pixel text-sm text-primary">Full Time</span>
				<span class="font-pixel text-3xl text-success">
					{finalResult!.score[0]} - {finalResult!.score[1]}
				</span>
				<span class="font-pixel text-xs text-subtle">Rating: {finalResult!.rating}/10</span>
			</div>
		</Card>

		<Button onclick={async () => await goto('/vidiprinter')}>Continue</Button>
	{/if}
</div>
