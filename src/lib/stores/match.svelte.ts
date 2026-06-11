import type { MatchResult, Outcome } from '$lib/types/game';

function createMatch() {
	let result = $state<MatchResult | null>(null);

	const OUTCOME_SEQUENCE: Outcome[] = ['goal', 'saved', 'miss', 'off-target'];

	function reset() {
		result = null;
	}

	function play(chances: number) {
		const outcomes = Array.from(
			{ length: chances },
			(_, i) => OUTCOME_SEQUENCE[i % OUTCOME_SEQUENCE.length]
		);
		const goals = outcomes.filter((o) => o === 'goal').length;

		result = {
			played: true,
			chances,
			outcomes,
			score: [goals, 0],
			rating: goals >= 2 ? 8 : goals === 1 ? 7 : 5
		};
	}

	return {
		get result() {
			return result;
		},
		set result(v: MatchResult | null) {
			result = v;
		},
		reset,
		play
	};
}

export const match = createMatch();
