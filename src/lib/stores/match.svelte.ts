import type { Fixture, MatchResult, Outcome } from '$lib/types/game';
import { MORALE_CONFIG } from '$lib/config/morale';
import { player } from '$lib/stores/player.svelte';

interface PendingGame {
	fixture: Fixture;
	skipped: boolean;
}

function createMatch() {
	let result = $state<MatchResult | null>(null);
	let totalChances = $state(0);
	let pendingOutcomes = $state<Outcome[]>([]);
	let currentMorale = $state(MORALE_CONFIG.scale.start);

	let pendingGames = $state<PendingGame[]>([]);
	let currentGameIndex = $state(0);
	let batchDone = $state(false);

	function reset() {
		result = null;
		totalChances = 0;
		pendingOutcomes = [];
		currentMorale = MORALE_CONFIG.scale.start;
		pendingGames = [];
		currentGameIndex = 0;
		batchDone = false;
	}

	function setGames(games: PendingGame[]) {
		pendingGames = games;
		currentGameIndex = 0;
		batchDone = false;
		startCurrentGame();
	}

	function startCurrentGame() {
		if (currentGameIndex >= pendingGames.length) {
			batchDone = true;
			return;
		}

		result = null;
		totalChances = 0;
		pendingOutcomes = [];
		currentMorale = MORALE_CONFIG.scale.start;

		const game = pendingGames[currentGameIndex];
		const chances = player.deck[0] ?? 1;

		if (game.skipped) {
			playSkip(chances);
		} else {
			start(chances);
		}
	}

	function start(chances: number, morale?: number) {
		totalChances = chances;
		pendingOutcomes = [];
		result = null;
		currentMorale = morale ?? MORALE_CONFIG.scale.start;
	}

	function recordOutcome(outcome: Outcome) {
		pendingOutcomes.push(outcome);
		if (pendingOutcomes.length >= totalChances) {
			finish(currentMorale);
		}
	}

	function finish(morale: number) {
		const playerGoals = pendingOutcomes.filter((o) => o === 'goal').length;
		const teamBase = MORALE_CONFIG.teamSimGoals(morale);
		const opponent = MORALE_CONFIG.opponentGoals(morale);
		result = {
			played: true,
			chances: totalChances,
			outcomes: [...pendingOutcomes],
			score: [teamBase + playerGoals, opponent],
			rating: playerGoals >= 2 ? 8 : playerGoals === 1 ? 7 : 5
		};
	}

	function playSkip(chances: number) {
		totalChances = chances;
		const outcomes: Outcome[] = Array.from({ length: chances }, () => 'miss');
		pendingOutcomes = outcomes;
		result = {
			played: false,
			chances,
			outcomes,
			score: [MORALE_CONFIG.teamSimGoals(MORALE_CONFIG.scale.start), MORALE_CONFIG.opponentGoals(MORALE_CONFIG.scale.start)],
			rating: 4
		};
	}

	function consumeDeck(skipped: boolean) {
		if (player.deck.length === 0) return;
		const used = player.deck.shift()!;
		if (skipped) {
			player.deck.push(used);
		}
	}

	function nextGame(morale: number) {
		const game = pendingGames[currentGameIndex];
		if (result && game) {
			const playerGoals = result.outcomes.filter((o) => o === 'goal').length;
			game.fixture.result = { goalsFor: result.score[0], goalsAgainst: result.score[1], playerGoals };
		}

		currentGameIndex++;
		currentMorale = morale;
		startCurrentGame();
	}

	return {
		get result() {
			return result;
		},
		set result(v: MatchResult | null) {
			result = v;
		},
		get totalChances() {
			return totalChances;
		},
		get pendingGames() {
			return pendingGames;
		},
		get currentGameIndex() {
			return currentGameIndex;
		},
		get batchDone() {
			return batchDone;
		},
		reset,
		setGames,
		start,
		recordOutcome,
		finish,
		consumeDeck,
		nextGame
	};
}

export const match = createMatch();
