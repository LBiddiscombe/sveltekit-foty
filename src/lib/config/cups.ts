import type { CupBracket, CupRound, CupTie, CupType } from '$lib/types/game';
import { CLUB_STRENGTHS } from './club-strengths';
import { ALL_CLUBS } from './clubs';
import { simulateMatch } from '$lib/match/engine';

export const NON_LEAGUE_POOL = [
	'Aldershot',
	'Altringum',
	'Barro',
	'Boram Wood',
	'Boston',
	'Carlisle',
	'Eastlee',
	'Hallifax',
	'Forest Green',
	'Gateshed',
	'Harrogit',
	'Hartlepool',
	'Hornchurch',
	'Scunthorp',
	'Solihul',
	'Southend',
	'Sutton',
	'Tamwuth',
	'Weeldstone',
	'Woakin',
	'Worthin',
	'Yovil',
	'Bedfud',
	'Bracklee',
	'Buxtun',
	'Chestur',
	'Chorlee',
	'Darlinton',
	'Harbura',
	'Hebburn',
	'Hednesfud',
	'Herefud',
	'Kings Linn',
	'Macklesfeeld',
	'Mareen',
	'Murthur',
	'Morekum',
	'Oxfud City',
	'Radcliff',
	'Scarbura',
	'Southport',
	'South Sheelds',
	'Spaulding',
	'Spennymoor',
	'Worksup',
	'Telfud',
	'Tottun',
	'Bath',
	'BraynTree',
	'Chelmsfud',
	'Cheshum',
	'Chipnum',
	'Dagenum',
	'Dovur',
	'Dorkin',
	'Eastburn',
	'Ebbsfleet',
	'Enfeeld',
	'Farnbura',
	'Hampton Richmund',
	'Hemel Hempsted',
	'Horshum',
	'Maydenhed',
	'Maydstun',
	'Saulsbury',
	'Slou',
	'Tunbridge Angels',
	'Torkee',
	'Truro',
	'Weston Super Mare'
];

export const CUP_SCHEDULE: Record<CupType, { round: number; week: number; isTwoLeg: boolean }[]> = {
	'league-cup': [
		{ round: 1, week: 1, isTwoLeg: true },
		{ round: 2, week: 5, isTwoLeg: true },
		{ round: 3, week: 9, isTwoLeg: true },
		{ round: 4, week: 13, isTwoLeg: true },
		{ round: 5, week: 17, isTwoLeg: true },
		{ round: 6, week: 21, isTwoLeg: false },
		{ round: 7, week: 25, isTwoLeg: false }
	],
	'fa-cup': [
		{ round: 1, week: 3, isTwoLeg: false },
		{ round: 2, week: 7, isTwoLeg: false },
		{ round: 3, week: 11, isTwoLeg: false },
		{ round: 4, week: 15, isTwoLeg: false },
		{ round: 5, week: 19, isTwoLeg: false },
		{ round: 6, week: 23, isTwoLeg: false },
		{ round: 7, week: 31, isTwoLeg: false }
	]
};

export const CUP_PRIZES: Record<CupType, Record<number, { prize: number; xp: number }>> = {
	'league-cup': {
		1: { prize: 500, xp: 1 },
		2: { prize: 1000, xp: 2 },
		3: { prize: 2000, xp: 3 },
		4: { prize: 5000, xp: 3 },
		5: { prize: 10000, xp: 4 },
		6: { prize: 15000, xp: 5 },
		7: { prize: 20000, xp: 5 }
	},
	'fa-cup': {
		1: { prize: 1000, xp: 2 },
		2: { prize: 2000, xp: 4 },
		3: { prize: 4000, xp: 6 },
		4: { prize: 8000, xp: 6 },
		5: { prize: 16000, xp: 8 },
		6: { prize: 25000, xp: 10 },
		7: { prize: 50000, xp: 10 }
	}
};

export const CUP_ROUND_NAMES: Record<CupType, Record<number, string>> = {
	'league-cup': {
		1: 'Round 1',
		2: 'Round 2',
		3: 'Round 3',
		4: 'Round 4',
		5: 'Quarter Final',
		6: 'Semi Final',
		7: 'Final'
	},
	'fa-cup': {
		1: 'Round 1',
		2: 'Round 2',
		3: 'Round 3',
		4: 'Round 4',
		5: 'Quarter Final',
		6: 'Semi Final',
		7: 'Final'
	}
};

export const CUP_DISPLAY_NAMES: Record<CupType, string> = {
	'league-cup': 'League Cup',
	'fa-cup': 'FA Cup'
};

export const FA_CUP_FINAL_WEEK = 31;

export const LEAGUE_CUP_DEDICATED_WEEKS = [1, 5, 9, 13, 17];

export const NON_LEAGUE_STRENGTH = 1;

export const CUP_DIVISION_MULTIPLIERS: Record<number, number> = {
	1: 2.0,
	2: 1.2,
	3: 1.0,
	4: 0.8
};

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function selectNonLeagueTeams(): string[] {
	return shuffle(NON_LEAGUE_POOL).slice(0, 36);
}

export function pickCupParticipants(): { league: string[]; fa: string[] } {
	const leagueClubs = shuffle(ALL_CLUBS.map((c) => c.name));
	const nonLeague1 = selectNonLeagueTeams().map((name) => `${name} (N/L)`);
	const nonLeague2 = selectNonLeagueTeams().map((name) => `${name} (N/L)`);
	return {
		league: [...leagueClubs, ...nonLeague1],
		fa: [...leagueClubs, ...nonLeague2]
	};
}

function generateRoundPairings(teams: string[]): CupTie[] {
	const shuffled = shuffle(teams);
	const ties: CupTie[] = [];
	for (let i = 0; i < shuffled.length; i += 2) {
		const home = shuffled[i];
		const away = shuffled[i + 1];
		ties.push({ home, away });
	}
	return ties;
}

function generateEmptyRound(teams: number): CupTie[] {
	const ties: CupTie[] = [];
	for (let i = 0; i < teams / 2; i++) {
		ties.push({ home: '', away: '' });
	}
	return ties;
}

export function generateInitialBracket(type: CupType, participants: string[]): CupBracket {
	const schedule = CUP_SCHEDULE[type];
	const rounds: CupRound[] = [];

	for (let i = 0; i < schedule.length; i++) {
		const sr = schedule[i];
		if (i === 0) {
			const ties = generateRoundPairings(participants);
			rounds.push({ roundNumber: sr.round, ties });
		} else {
			const teamCount = participants.length / Math.pow(2, i);
			const ties = generateEmptyRound(teamCount);
			rounds.push({ roundNumber: sr.round, ties });
		}
	}

	return { type, currentRound: 1, rounds, eliminated: {} };
}

export function generateAllCupBrackets(): { leagueCup: CupBracket; faCup: CupBracket } {
	const { league, fa } = pickCupParticipants();
	return {
		leagueCup: generateInitialBracket('league-cup', league),
		faCup: generateInitialBracket('fa-cup', fa)
	};
}

export function isLeagueCupDedicatedWeek(week: number): boolean {
	return LEAGUE_CUP_DEDICATED_WEEKS.includes(week);
}

export function isFaCupWeek(week: number): boolean {
	return CUP_SCHEDULE['fa-cup'].some((r) => r.week === week);
}

export function isFaCupFinalWeek(week: number): boolean {
	return week === FA_CUP_FINAL_WEEK;
}

export function getLeagueWeeks(): number[] {
	const weeks: number[] = [];
	for (let w = 1; w <= 30; w++) {
		if (!isLeagueCupDedicatedWeek(w)) {
			weeks.push(w);
		}
	}
	return weeks;
}

function getCupStrength(club: string): number {
	if (club.endsWith('(N/L)')) return 0.5;
	const base = CLUB_STRENGTHS[club] ?? NON_LEAGUE_STRENGTH;
	const clubData = ALL_CLUBS.find((c) => c.name === club);
	const div = clubData?.division;
	const mult = div ? (CUP_DIVISION_MULTIPLIERS[div] ?? 1.0) : 0.5;
	return base * mult;
}

export function simulateCupTie(
	home: string,
	away: string,
	isTwoLeg: boolean
): {
	homeGoals: number;
	awayGoals: number;
	winner: string;
	resolvedBy: 'match' | 'coin-toss';
	aggHomeGoals?: number;
	aggAwayGoals?: number;
} {
	if (isTwoLeg) {
		const leg1 = simulateMatch(getCupStrength(home), getCupStrength(away));
		const leg2 = simulateMatch(getCupStrength(away), getCupStrength(home));
		const aggHome = leg1.homeGoals + leg2.awayGoals;
		const aggAway = leg1.awayGoals + leg2.homeGoals;

		if (aggHome > aggAway) {
			return {
				homeGoals: leg1.homeGoals,
				awayGoals: leg1.awayGoals,
				winner: home,
				resolvedBy: 'match',
				aggHomeGoals: aggHome,
				aggAwayGoals: aggAway
			};
		} else if (aggAway > aggHome) {
			return {
				homeGoals: leg1.homeGoals,
				awayGoals: leg1.awayGoals,
				winner: away,
				resolvedBy: 'match',
				aggHomeGoals: aggHome,
				aggAwayGoals: aggAway
			};
		} else {
			const winner = Math.random() < 0.5 ? home : away;
			return {
				homeGoals: leg1.homeGoals,
				awayGoals: leg1.awayGoals,
				winner,
				resolvedBy: 'coin-toss',
				aggHomeGoals: aggHome,
				aggAwayGoals: aggAway
			};
		}
	} else {
		const match = simulateMatch(getCupStrength(home), getCupStrength(away));

		if (match.homeGoals > match.awayGoals) {
			return { ...match, winner: home, resolvedBy: 'match' };
		} else if (match.awayGoals > match.homeGoals) {
			return { ...match, winner: away, resolvedBy: 'match' };
		} else {
			const winner = Math.random() < 0.5 ? home : away;
			return { ...match, winner, resolvedBy: 'coin-toss' };
		}
	}
}

export function simulateCupRound(bracket: CupBracket): CupBracket {
	const schedule = CUP_SCHEDULE[bracket.type];
	const roundIdx = bracket.currentRound - 1;
	const round = bracket.rounds[roundIdx];
	const isTwoLeg = schedule[roundIdx]?.isTwoLeg ?? false;

	const updatedTies: CupTie[] = round.ties.map((tie) => {
		if (tie.result) return tie;
		const result = simulateCupTie(tie.home, tie.away, isTwoLeg);
		return { ...tie, result };
	});

	const updatedRounds = [...bracket.rounds];
	updatedRounds[roundIdx] = { ...round, ties: updatedTies };

	const losers = updatedTies.map((t) => (t.result!.winner === t.home ? t.away : t.home));
	const eliminated = { ...bracket.eliminated };
	for (const loser of losers) {
		eliminated[loser] = bracket.currentRound;
	}

	const winners = updatedTies.map((t) => t.result!.winner);
	const nextRoundIdx = roundIdx + 1;
	const isFinal = nextRoundIdx >= bracket.rounds.length;

	if (isFinal) {
		return {
			...bracket,
			currentRound: bracket.currentRound,
			rounds: updatedRounds,
			eliminated,
			winner: winners[0],
			runnerUp: losers[0]
		};
	}

	const winnersSorted = shuffle(winners);
	const nextRound = bracket.rounds[nextRoundIdx];
	const filledTies = nextRound.ties.map((tie, i) => ({
		home: winnersSorted[i * 2],
		away: winnersSorted[i * 2 + 1],
		result: undefined as CupTie['result']
	}));

	updatedRounds[nextRoundIdx] = { ...nextRound, ties: filledTies };

	return {
		...bracket,
		currentRound: bracket.currentRound + 1,
		rounds: updatedRounds,
		eliminated
	};
}
