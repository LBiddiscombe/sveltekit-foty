import type { AiMatchResult, Standing } from '$lib/types/game';

function createStandings() {
	let entries = $state<Standing[]>([]);
	let lastProcessedWeek = $state(0);

	function init(clubNames: string[]) {
		entries = clubNames.map((club) => ({
			club,
			played: 0,
			won: 0,
			drawn: 0,
			lost: 0,
			goalsFor: 0,
			goalsAgainst: 0,
			goalDifference: 0,
			points: 0,
			lastFive: []
		}));
		lastProcessedWeek = 0;
	}

	function recordResult(club: string, result: AiMatchResult, isHome: boolean) {
		const entry = entries.find((e) => e.club === club);
		if (!entry) return;

		const gf = isHome ? result.homeGoals : result.awayGoals;
		const ga = isHome ? result.awayGoals : result.homeGoals;

		entry.played++;
		entry.goalsFor += gf;
		entry.goalsAgainst += ga;
		entry.goalDifference = entry.goalsFor - entry.goalsAgainst;

		if (gf > ga) {
			entry.won++;
			entry.points += 3;
			entry.lastFive.push('W');
		} else if (gf === ga) {
			entry.drawn++;
			entry.points += 1;
			entry.lastFive.push('D');
		} else {
			entry.lost++;
			entry.lastFive.push('L');
		}

		if (entry.lastFive.length > 5) {
			entry.lastFive = entry.lastFive.slice(-5);
		}
	}

	function processWeekResults(
		matches: { home: string; away: string; result: AiMatchResult }[],
		weekNumber: number
	) {
		for (const m of matches) {
			recordResult(m.home, m.result, true);
			recordResult(m.away, m.result, false);
		}
		sort();
		lastProcessedWeek = weekNumber;
	}

	function headToHead(_a: string, _b: string): number {
		return 0;
	}

	function sort() {
		entries.sort((a, b) => {
			if (b.points !== a.points) return b.points - a.points;
			if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
			if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
			return headToHead(a.club, b.club);
		});
	}

	function getPosition(club: string): number {
		const idx = entries.findIndex((e) => e.club === club);
		return idx === -1 ? 0 : idx + 1;
	}

	function getByClub(club: string): Standing | undefined {
		return entries.find((e) => e.club === club);
	}

	function reset() {
		entries = [];
		lastProcessedWeek = 0;
	}

	return {
		get entries() {
			return entries;
		},
		set entries(v: Standing[]) {
			entries = v;
		},
		get lastProcessedWeek() {
			return lastProcessedWeek;
		},
		set lastProcessedWeek(v: number) {
			lastProcessedWeek = v;
		},
		init,
		recordResult,
		processWeekResults,
		getPosition,
		getByClub,
		reset,
		sort
	};
}

export const standings = createStandings();
