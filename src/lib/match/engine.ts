import { MORALE_CONFIG } from '$lib/config/morale';
import { CLUB_STRENGTHS } from '$lib/config/club-strengths';
import { ALL_CLUBS } from '$lib/config/clubs';
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
const NON_LEAGUE_STRENGTH = 1;
const CUP_DIV_MULT: Record<number, number> = { 1: 2.0, 2: 1.2, 3: 1.0, 4: 0.8 };

function baseStrength(club: string): number {
	return CLUB_STRENGTHS[club] ?? DEFAULT_STRENGTH;
}

function remapPair(a: number, b: number): [number, number] {
	const max = Math.max(a, b);
	const scale = 10 / max;
	return [Math.round(a * scale), Math.round(b * scale)];
}

function cupStrength(club: string): number {
	if (club.endsWith('(N/L)')) return 0.5;
	const base = CLUB_STRENGTHS[club] ?? NON_LEAGUE_STRENGTH;
	const clubData = ALL_CLUBS.find((c) => c.name === club);
	const div = clubData?.division;
	const mult = div ? (CUP_DIV_MULT[div] ?? 1.0) : 0.5;
	return base * mult;
}

export function playGame(
	chances: number,
	morale: number,
	outcomes: Outcome[],
	playerClub: string,
	opponentClub: string,
	isHome: boolean,
	isCup = false
): MatchResult {
	const getStr = isCup ? cupStrength : baseStrength;
	const playerStr = getStr(playerClub);
	const oppStr = getStr(opponentClub);

	const homeStr = isHome ? playerStr : oppStr;
	const awayStr = isHome ? oppStr : playerStr;
	const homeMorale = isHome ? morale : undefined;
	const awayMorale = isHome ? undefined : morale;

	const base = simulateMatch(homeStr, awayStr, homeMorale, awayMorale);
	const basePlayerScore = isHome ? base.homeGoals : base.awayGoals;
	const baseOppScore = isHome ? base.awayGoals : base.homeGoals;

	const playerGoals = outcomes.filter((o) => o === 'goal').length;

	return {
		played: true,
		chances,
		outcomes: [...outcomes],
		score: [basePlayerScore + playerGoals, baseOppScore],
		rating: playerGoals >= 2 ? 8 : playerGoals === 1 ? 7 : 5
	};
}

export function skipGame(
	chances: number,
	morale: number,
	playerClub: string,
	opponentClub: string,
	isHome: boolean,
	isCup = false
): MatchResult {
	const getStr = isCup ? cupStrength : baseStrength;
	const playerStr = getStr(playerClub);
	const oppStr = getStr(opponentClub);

	const homeStr = isHome ? playerStr : oppStr;
	const awayStr = isHome ? oppStr : playerStr;
	const homeMorale = isHome ? morale : undefined;
	const awayMorale = isHome ? undefined : morale;

	const base = simulateMatch(homeStr, awayStr, homeMorale, awayMorale);
	const basePlayerScore = isHome ? base.homeGoals : base.awayGoals;
	const baseOppScore = isHome ? base.awayGoals : base.homeGoals;

	return {
		played: false,
		chances,
		outcomes: [],
		score: [basePlayerScore, baseOppScore],
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

export function simulateMatch(
	homeStrength: number,
	awayStrength: number,
	homeMorale?: number,
	awayMorale?: number
): AiMatchResult {
	const [homeStr, awayStr] = remapPair(homeStrength, awayStrength);
	const homeRate = Math.max(0.1, homeStr * 0.15 + 0.5 + (homeMorale ?? 0) * 0.01);
	const awayRate = Math.max(0.1, awayStr * 0.15 + (awayMorale ?? 0) * 0.01);
	let homeGoals = poisson(homeRate);
	const awayGoals = poisson(awayRate);
	if (homeGoals === awayGoals && Math.random() < AI_DRAW_BREAKER) {
		homeGoals += 1;
	}
	return { homeGoals, awayGoals };
}
