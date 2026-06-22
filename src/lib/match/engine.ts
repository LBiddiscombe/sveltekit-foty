import { MORALE_CONFIG } from '$lib/config/morale';
import type { MatchResult, Outcome } from '$lib/types/game';

export const START_MORALE = MORALE_CONFIG.scale.start;

export function playGame(chances: number, morale: number, outcomes: Outcome[]): MatchResult {
	const playerGoals = outcomes.filter((o) => o === 'goal').length;
	const teamBase = MORALE_CONFIG.teamSimGoals(morale);
	const opponent = MORALE_CONFIG.opponentGoals(morale);
	return {
		played: true,
		chances,
		outcomes: [...outcomes],
		score: [teamBase + playerGoals, opponent],
		rating: playerGoals >= 2 ? 8 : playerGoals === 1 ? 7 : 5
	};
}

export function skipGame(chances: number, morale: number): MatchResult {
	const outcomes: Outcome[] = Array.from({ length: chances }, () => 'miss');
	return {
		played: false,
		chances,
		outcomes,
		score: [MORALE_CONFIG.teamSimGoals(morale), MORALE_CONFIG.opponentGoals(morale)],
		rating: 4
	};
}

export function getMoraleDelta(score: [number, number], playerGoals: number): number {
	const [us, them] = score;
	const result = us > them ? 'win' : us === them ? 'draw' : 'loss';
	let delta = MORALE_CONFIG.deltas[result];
	if (playerGoals >= 2) delta = MORALE_CONFIG.deltas.twoGoalBonus;
	return delta;
}

export function consumeDeck(deck: number[], skipped: boolean) {
	const used = deck.shift();
	if (used === undefined) return;
	if (skipped) {
		deck.push(used);
	}
}
