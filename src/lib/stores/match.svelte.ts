import type { MatchResult, Outcome } from '$lib/types/game';
import { MORALE_CONFIG } from '$lib/config/morale';

function createMatch() {
	let result = $state<MatchResult | null>(null);
	let totalChances = $state(0);
	let pendingOutcomes = $state<Outcome[]>([]);
	let currentMorale = $state(MORALE_CONFIG.scale.start);

	function reset() {
		result = null;
		totalChances = 0;
		pendingOutcomes = [];
		currentMorale = MORALE_CONFIG.scale.start;
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
		const goals = pendingOutcomes.filter((o) => o === 'goal').length;
		const opponent = MORALE_CONFIG.opponentGoals(morale);
		result = {
			played: true,
			chances: totalChances,
			outcomes: [...pendingOutcomes],
			score: [goals, opponent],
			rating: goals >= 2 ? 8 : goals === 1 ? 7 : 5
		};
	}

	function skip(chances: number, morale?: number) {
		const m = morale ?? MORALE_CONFIG.scale.start;
		totalChances = chances;
		const outcomes: Outcome[] = Array.from({ length: chances }, () => 'miss');
		pendingOutcomes = outcomes;
		result = {
			played: false,
			chances,
			outcomes,
			score: [MORALE_CONFIG.playerSimGoals(m), MORALE_CONFIG.opponentGoals(m)],
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
