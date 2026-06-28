<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { match } from '$lib/stores/match.svelte';
	import Minigame from '$lib/components/minigames/Minigame.svelte';
	import { createPenaltySketch } from '$lib/components/minigames/PenaltySketch';
	import { createFirstTimeFinishSketch } from '$lib/components/minigames/FirstTimeFinishSketch';
	import type { Outcome } from '$lib/types/game';
	import { playGame, skipGame, getMoraleDelta, consumeDeck } from '$lib/match/engine';
	import { XP_CONFIG } from '$lib/config/xp';
	import { DIVISION_XP_CAPS } from '$lib/config/levels';
	import { saveGame } from '$lib/save';

	type GameType = 'penalty' | 'first-time-finish';

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
		return Math.random() < 0.3 ? 'penalty' : 'first-time-finish';
	}

	function recordPlayerMatch(goals: number) {
		player.recordAppearance();
		if (goals > 0) {
			player.addGoals(goals);
		}
	}

	function points(us: number, them: number): number {
		return us > them ? 3 : us === them ? 1 : 0;
	}

	function calcMatchXp(outcomes: Outcome[], score: [number, number]): number {
		const cap = DIVISION_XP_CAPS[player.division as keyof typeof DIVISION_XP_CAPS] ?? 500;
		if (player.careerXp >= cap) return 0;

		const playerGoals = outcomes.filter((o) => o === 'goal').length;
		const teamBase = score[0] - playerGoals;
		const resultBonus = points(score[0], score[1]) - points(teamBase, score[1]);

		let total = XP_CONFIG.played;
		for (const o of outcomes) {
			total += XP_CONFIG[o as keyof typeof XP_CONFIG] ?? 0;
		}
		total += resultBonus;

		return total;
	}

	function finishCurrentGame() {
		const res = match.result!;
		const game = match.pendingGames[match.currentGameIndex];
		const playerGoals = res.outcomes.filter((o) => o === 'goal').length;
		season.adjustMorale(getMoraleDelta(res.score));

		if (!game.skipped) {
			const matchXp = calcMatchXp(res.outcomes, res.score);
			player.addXp(matchXp);
			player.recordMatchXp(matchXp);
			player.recordMatchOutcomes(res.outcomes);
			recordPlayerMatch(playerGoals);
		}

		match.saveFixtureResult();

		const weekSchedule = season.divisionSchedule.weeks.find((w) => w.weekNumber === game.fixture.weekNumber);
		if (weekSchedule) {
			const divMatch = weekSchedule.matches.find(
				(m) =>
					(m.home === player.club && m.away === game.fixture.opponent) ||
					(m.away === player.club && m.home === game.fixture.opponent)
			);
			if (divMatch) {
				divMatch.result = {
					homeGoals: game.fixture.isHome ? res.score[0] : res.score[1],
					awayGoals: game.fixture.isHome ? res.score[1] : res.score[0]
				};
			}
		}

		match.advance();

		if (match.batchDone) {
			saveGame();
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
			match.setResult(skipGame(chances, season.morale, player.club, currentGame.fixture.opponent));
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
				match.setResult(
					playGame(chances, season.morale, outcomes, player.club, currentGame.fixture.opponent)
				);
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
					createSketch={gameType === 'penalty' ? createPenaltySketch : createFirstTimeFinishSketch}
					outcomeText={currentOutcomeText}
					gameName={gameType === 'penalty' ? 'Penalty!' : 'First-Time Finish!'}
				/>
			{/key}
		</div>
	{/if}
</div>
