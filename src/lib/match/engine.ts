import { MORALE_CONFIG } from '$lib/config/morale';
import { CLUB_STRENGTHS } from '$lib/config/club-strengths';
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

const DEFAULT_STRENGTH = 3;

function remapPair(a: number, b: number): [number, number] {
	const max = Math.max(a, b);
	const scale = 10 / max;
	return [Math.round(a * scale), Math.round(b * scale)];
}

function calcTeamGoals(strength: number, morale: number): number {
	return poisson(0.3 + strength * 0.1 + morale * 0.01);
}

function calcOpponentGoals(strength: number, _morale: number): number {
	return poisson(0.3 + strength * 0.1);
}

function strength(club: string): number {
	return CLUB_STRENGTHS[club] ?? DEFAULT_STRENGTH;
}

export function playGame(
	chances: number,
	morale: number,
	outcomes: Outcome[],
	playerClub: string,
	opponentClub: string
): MatchResult {
	const [teamStr, oppStr] = remapPair(strength(playerClub), strength(opponentClub));
	const playerGoals = outcomes.filter((o) => o === 'goal').length;
	const teamBase = calcTeamGoals(teamStr, morale);
	const opponent = calcOpponentGoals(oppStr, morale);
	return {
		played: true,
		chances,
		outcomes: [...outcomes],
		score: [teamBase + playerGoals, opponent],
		rating: playerGoals >= 2 ? 8 : playerGoals === 1 ? 7 : 5
	};
}

export function skipGame(
	chances: number,
	morale: number,
	playerClub: string,
	opponentClub: string
): MatchResult {
	const [teamStr, oppStr] = remapPair(strength(playerClub), strength(opponentClub));
	return {
		played: false,
		chances,
		outcomes: [],
		score: [calcTeamGoals(teamStr, morale), calcOpponentGoals(oppStr, morale)],
		rating: 4
	};
}

export function getMoraleDelta(score: [number, number]): number {
	const [us, them] = score;
	const result = us > them ? 'win' : us === them ? 'draw' : 'loss';
	return MORALE_CONFIG.deltas[result];
}

export function consumeDeck(deck: number[], skipped: boolean) {
	const used = deck.shift();
	if (used === undefined) return;
	if (skipped) {
		deck.push(used);
	}
}

export const AI_DRAW_BREAKER = 0.35;

export function simulateMatch(homeStrength: number, awayStrength: number): AiMatchResult {
	const [homeStr, awayStr] = remapPair(homeStrength, awayStrength);
	const homeAdv = 0.5;
	const homeRate = Math.max(0.1, homeStr * 0.15 + homeAdv);
	const awayRate = Math.max(0.1, awayStr * 0.15);
	let homeGoals = poisson(homeRate);
	const awayGoals = poisson(awayRate);
	if (homeGoals === awayGoals && Math.random() < AI_DRAW_BREAKER) {
		homeGoals += 1;
	}
	return { homeGoals, awayGoals };
}

export { remapPair };
