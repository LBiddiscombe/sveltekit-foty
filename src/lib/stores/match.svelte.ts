import type { MatchResult, Outcome } from '$lib/types/game';

function createMatch() {
	let result = $state<MatchResult | null>(null);
	let totalChances = $state(0);
	let pendingOutcomes = $state<Outcome[]>([]);

	function reset() {
		result = null;
		totalChances = 0;
		pendingOutcomes = [];
	}

	function start(chances: number) {
		totalChances = chances;
		pendingOutcomes = [];
		result = null;
	}

	function recordOutcome(outcome: Outcome) {
		pendingOutcomes.push(outcome);
		if (pendingOutcomes.length >= totalChances) {
			finish();
		}
	}

	function finish() {
		const goals = pendingOutcomes.filter((o) => o === 'goal').length;
		result = {
			played: true,
			chances: totalChances,
			outcomes: [...pendingOutcomes],
			score: [goals, 0],
			rating: goals >= 2 ? 8 : goals === 1 ? 7 : 5
		};
	}

	function skip(chances: number) {
		totalChances = chances;
		const outcomes: Outcome[] = Array.from({ length: chances }, () => 'miss');
		pendingOutcomes = outcomes;
		result = {
			played: false,
			chances,
			outcomes,
			score: [0, 1],
			rating: 4
		};
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
		reset,
		start,
		recordOutcome,
		finish,
		skip
	};
}

export const match = createMatch();
