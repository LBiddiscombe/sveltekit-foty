import type { DivisionMatch, DivisionSchedule, WeekFixtures } from '$lib/types/game';
import { shuffle, range } from '$lib/utils';

function getDoubleGameWeeks(totalWeeks: number, count: number): Set<number> {
	const weeks = shuffle(range(totalWeeks));
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

		if (round % 2 === 1) {
			rounds.push(pairs.map(([h, a]) => [a, h] as [string, string]));
		} else {
			rounds.push(pairs);
		}
		rotating.unshift(rotating.pop()!);
	}

	return rounds;
}

export function generateDivisionSchedule(
	division: number,
	clubs: string[],
	leagueWeekNumbers?: number[]
): DivisionSchedule {
	const leagueWeeks = leagueWeekNumbers ?? range(1, 31);
	const totalWeeks = leagueWeeks.length;

	const totalRounds = (clubs.length - 1) * 2;
	const doubleCount = totalRounds - totalWeeks;

	const doubleGameWeeks = getDoubleGameWeeks(totalWeeks, doubleCount);

	const firstLeg = makeRoundRobinPairs(clubs);
	const secondLeg = firstLeg.map((round) => round.map(([h, a]) => [a, h] as [string, string]));

	const allRounds = [...firstLeg, ...secondLeg];

	const weeks: WeekFixtures[] = [];
	let roundIdx = 0;

	for (let w = 0; w < totalWeeks; w++) {
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

		weeks.push({ weekNumber: leagueWeeks[w], matches: matchesThisWeek });
	}

	return { weeks };
}
