import { MORALE_CONFIG } from '$lib/config/morale';
import type { AiMatchResult, MatchResult, Outcome } from '$lib/types/game';

export const START_MORALE = MORALE_CONFIG.scale.start;

function poisson(lambda: number): number {
	const L = Math.exp(-lambda);
	let k = 0;
	let p = 1;
	do {
		k++;
		p *= Math.random();
	} while (p > L);
	return k - 1;
}

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

export function simAiMatch(homeStrength: number, awayStrength: number): AiMatchResult {
	const homeLambda = 0.3 + homeStrength * 0.1;
	const awayLambda = 0.3 + awayStrength * 0.1;
	return {
		homeGoals: poisson(homeLambda),
		awayGoals: poisson(awayLambda)
	};
}
