<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { match } from '$lib/stores/match.svelte';
	import Minigame from '$lib/components/minigames/Minigame.svelte';
	import { createPenaltySketch } from '$lib/components/minigames/PenaltySketch';
	import { createVolleySketch } from '$lib/components/minigames/VolleySketch';
	import type { Outcome } from '$lib/types/game';
	import { playGame, skipGame, getMoraleDelta, consumeDeck, START_MORALE } from '$lib/match/engine';

	type GameType = 'penalty' | 'volley';

	$effect(() => {
		season.phase = 'match';
	});

	let currentChance = $state(0);
	let gameType = $state<GameType>('penalty');
	let step = $state<'loading' | 'playing'>('loading');
	let awaitingAdvance = $state(false);
	let currentOutcomeText = $state<string | null>(null);

	const currentGame = $derived(match.pendingGames[match.currentGameIndex]);

	function pickGameType(): GameType {
		return Math.random() < 0.3 ? 'penalty' : 'volley';
	}

	function recordPlayerStats(goals: number) {
		player.recordAppearance();
		if (goals > 0) {
			player.addGoals(goals);
		}
	}

	function finishCurrentGame() {
		const res = match.result!;
		const playerGoals = res.outcomes.filter((o) => o === 'goal').length;
		season.adjustMorale(getMoraleDelta(res.score, playerGoals));
		recordPlayerStats(playerGoals);
		match.saveFixtureResult();
		match.advance();

		if (match.batchDone) {
			goto('/vidiprinter');
		} else {
			setupNextGame();
		}
	}

	function setupNextGame() {
		currentChance = 0;
		gameType = pickGameType();
		awaitingAdvance = false;
		currentOutcomeText = null;

		const game = match.pendingGames[match.currentGameIndex];
		if (!game) return;

		const chances = player.deck[0] ?? 1;

		if (game.skipped) {
			consumeDeck(player.deck, true);
			match.setResult(skipGame(chances, START_MORALE));
			finishCurrentGame();
		} else {
			match.start(chances);
			step = 'playing';
		}
	}

	onMount(() => {
		if (match.pendingGames.length === 0) {
			goto('/vidiprinter');
			return;
		}
		setupNextGame();
	});

	function handleComplete(outcome: Outcome) {
		if (awaitingAdvance) return;
		awaitingAdvance = true;

		currentOutcomeText = outcome === 'goal' ? 'Goal!' : outcome === 'saved' ? 'Saved!' : 'Missed!';

		match.recordOutcome(outcome);

		setTimeout(() => {
			currentOutcomeText = null;
			awaitingAdvance = false;
			if (currentChance < match.totalChances - 1) {
				currentChance++;
				gameType = pickGameType();
			} else {
				const chances = match.totalChances;
				const outcomes = match.pendingOutcomes;
				consumeDeck(player.deck, false);
				match.setResult(playGame(chances, START_MORALE, outcomes));
				finishCurrentGame();
			}
		}, 1500);
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-4">
	{#if step === 'loading'}
		<p class="font-pixel text-xs text-subtle">Loading...</p>
	{:else if step === 'playing'}
		<div class="flex w-full flex-col items-center gap-4">
			{#if currentGame}
				<div class="flex flex-col items-center gap-0.5">
					<span class="font-pixel text-xs text-subtle"
						>{currentGame.fixture.isHome ? 'HOME' : 'AWAY'} — {currentGame.fixture.opponent}</span
					>
					<span class="font-pixel text-sm text-primary">
						Chance {currentChance + 1} of {match.totalChances}
					</span>
				</div>
			{:else}
				<span class="font-pixel text-sm text-primary">
					Chance {currentChance + 1} of {match.totalChances}
				</span>
			{/if}

			{#key `${match.currentGameIndex}-${currentChance}`}
				<Minigame
					oncomplete={handleComplete}
					createSketch={gameType === 'penalty' ? createPenaltySketch : createVolleySketch}
					outcomeText={currentOutcomeText}
				/>
			{/key}
		</div>
	{/if}
</div>
