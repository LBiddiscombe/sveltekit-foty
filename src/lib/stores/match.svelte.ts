import type { Fixture, MatchResult, Outcome } from '$lib/types/game';

export interface PendingGame {
	fixture: Fixture;
	skipped: boolean;
}

function createMatch() {
	let result = $state<MatchResult | null>(null);
	let totalChances = $state(0);
	let pendingOutcomes = $state<Outcome[]>([]);

	let pendingGames = $state<PendingGame[]>([]);
	let currentGameIndex = $state(0);
	let batchDone = $state(false);

	function reset() {
		result = null;
		totalChances = 0;
		pendingOutcomes = [];
		pendingGames = [];
		currentGameIndex = 0;
		batchDone = false;
	}

	function setGames(games: PendingGame[]) {
		pendingGames = games;
		currentGameIndex = 0;
		batchDone = false;
	}

	function start(chances: number) {
		totalChances = chances;
		pendingOutcomes = [];
		result = null;
	}

	function recordOutcome(outcome: Outcome) {
		pendingOutcomes.push(outcome);
	}

	function setResult(r: MatchResult) {
		result = r;
	}

	function saveFixtureResult() {
		const game = pendingGames[currentGameIndex];
		if (result && game) {
			const playerGoals = result.outcomes.filter((o) => o === 'goal').length;
			game.fixture.result = {
				goalsFor: result.score[0],
				goalsAgainst: result.score[1],
				playerGoals,
				outcomes: [...result.outcomes]
			};
		}
	}

	function advance() {
		currentGameIndex++;
		if (currentGameIndex >= pendingGames.length) {
			batchDone = true;
		}
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
		get pendingOutcomes() {
			return pendingOutcomes;
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
		setResult,
		saveFixtureResult,
		advance
	};
}

export const match = createMatch();
