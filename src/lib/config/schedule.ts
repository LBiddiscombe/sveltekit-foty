import type { DivisionMatch, DivisionSchedule, WeekFixtures } from '$lib/types/game';

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function getDoubleGameWeeks(totalWeeks: number, count: number): Set<number> {
	const weeks = shuffle(Array.from({ length: totalWeeks }, (_, i) => i));
	return new Set(weeks.slice(0, count));
}

function makeRoundRobinPairs(teams: string[]): [string, string][][] {
	const n = teams.length;
	const fixed = teams[0];
	const rotating = shuffle(teams.slice(1));

	const rounds: [string, string][][] = [];

	for (let round = 0; round < n - 1; round++) {
		const pairs: [string, string][] = [];
		const lineup = [fixed, ...rotating];

		for (let i = 0; i < n / 2; i++) {
			const home = lineup[i];
			const away = lineup[n - 1 - i];
			if (home !== away) {
				pairs.push([home, away]);
			}
		}

		rounds.push(pairs);
		rotating.unshift(rotating.pop()!);
	}

	return rounds;
}

export function generateDivisionSchedule(division: number, clubs: string[]): DivisionSchedule {
	const isDiv1 = division === 1;
	const doubleGameWeeks = getDoubleGameWeeks(30, isDiv1 ? 8 : 16);

	const firstLeg = makeRoundRobinPairs(clubs);
	const secondLeg = firstLeg.map((round) => round.map(([h, a]) => [a, h] as [string, string]));

	const allRounds = [...firstLeg, ...secondLeg];

	const weeks: WeekFixtures[] = [];
	let roundIdx = 0;

	for (let w = 0; w < 30; w++) {
		const isDouble = doubleGameWeeks.has(w);
		const matchesThisWeek: DivisionMatch[] = [];

		if (isDouble && roundIdx < allRounds.length) {
			for (const [home, away] of allRounds[roundIdx]) {
				matchesThisWeek.push({ home, away });
			}
			roundIdx++;
		}

		if (roundIdx < allRounds.length) {
			for (const [home, away] of allRounds[roundIdx]) {
				matchesThisWeek.push({ home, away });
			}
			roundIdx++;
		}

		weeks.push({ weekNumber: w + 1, matches: matchesThisWeek });
	}

	return { weeks };
}
