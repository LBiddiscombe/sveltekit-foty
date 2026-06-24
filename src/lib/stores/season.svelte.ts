import type { DivisionSchedule, Fixture, Phase, Standing } from '$lib/types/game';
import { MORALE_CONFIG } from '$lib/config/morale';
import { getClubsByDivision } from '$lib/config/clubs';
import { CLUB_STRENGTHS } from '$lib/config/club-strengths';
import { generateDivisionSchedule } from '$lib/config/schedule';
import { generatePlayerFixtures } from '$lib/config/fixtures';
import { standings } from './standings.svelte';
import { XP_CONFIG } from '$lib/config/xp';

export type BoundaryResult = {
	upper: number;
	lower: number;
	promoted: string[];
	relegated: string[];
};

export type SeasonStats = {
	goals: number;
	appearances: number;
	xpEarned: number;
};

export type EndSeasonResult = {
	newDivision: number;
	playerInPromoted: boolean;
	playerInRelegated: boolean;
	boundaryResults: BoundaryResult[];
	myDivisionPromoted: string[];
	myDivisionRelegated: string[];
	finalStandings: Standing[];
	seasonStats: SeasonStats;
};

function createSeason() {
	let weekNumber = $state(1);
	let seasonNumber = $state(1);
	let fixtures = $state<Fixture[]>([]);
	let divisionSchedule = $state<DivisionSchedule>({ weeks: [] });
	let gamesPlayed = $state(0);
	let phase = $state<Phase>('hub');
	let morale = $state(MORALE_CONFIG.scale.start);
	let lastWageWeek = $state(0);
	let divisionRosters = $state<Record<number, string[]>>({});
	let appearanceSkips = $state(0);
	let seasonXpAtStart = $state(0);
	let seasonGoalsAtStart = $state(0);
	let seasonAppsAtStart = $state(0);

	function initDivisionRosters() {
		for (let d = 1; d <= 4; d++) {
			divisionRosters[d] = getClubsByDivision(d).map((c) => c.name);
		}
	}
	initDivisionRosters();

	function advanceWeek() {
		weekNumber = Math.min(weekNumber + 1, 30);
	}

	function recordGamesPlayed(n: number) {
		gamesPlayed += n;
	}

	function adjustMorale(delta: number) {
		morale = MORALE_CONFIG.adjustMorale(morale, delta);
	}

	function addAppearanceSkips(n: number) {
		appearanceSkips = Math.max(0, appearanceSkips + n);
	}

	function consumeAppearanceSkip(): boolean {
		if (appearanceSkips > 0) {
			appearanceSkips--;
			return true;
		}
		return false;
	}

	function pickByStrength(clubs: string[], count: number, pickStrongest: boolean): string[] {
		const sorted = [...clubs].sort((a, b) => {
			const sa = CLUB_STRENGTHS[a] ?? 5;
			const sb = CLUB_STRENGTHS[b] ?? 5;
			if (sa !== sb) return pickStrongest ? sb - sa : sa - sb;
			return Math.random() - 0.5;
		});
		return sorted.slice(0, count);
	}

	function endSeason(playerClub: string, playerDivision: number): EndSeasonResult {
		const sorted = [...standings.entries].sort((a, b) => {
			if (b.points !== a.points) return b.points - a.points;
			if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
			if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
			return a.club.localeCompare(b.club);
		});
		const finalStandings = [...sorted];

		const rosters: Record<number, string[]> = {};
		for (let d = 1; d <= 4; d++) {
			rosters[d] = [...(divisionRosters[d] ?? getClubsByDivision(d).map((c) => c.name))];
		}

		const boundaryResults: BoundaryResult[] = [];

		for (let div = 1; div <= 3; div++) {
			const upper = div;
			const lower = div + 1;
			const upperClubs = rosters[upper];
			const lowerClubs = rosters[lower];

			let relegatedFromUpper: string[];
			if (upper === playerDivision) {
				const n = sorted.length;
				relegatedFromUpper = sorted.slice(n - 3).map((s) => s.club);
			} else {
				relegatedFromUpper = pickByStrength(upperClubs, 3, false);
			}

			let promotedFromLower: string[];
			if (lower === playerDivision) {
				promotedFromLower = sorted.slice(0, 3).map((s) => s.club);
			} else {
				promotedFromLower = pickByStrength(lowerClubs, 3, true);
			}

			rosters[upper] = upperClubs
				.filter((c) => !relegatedFromUpper.includes(c))
				.concat(promotedFromLower);
			rosters[lower] = lowerClubs
				.filter((c) => !promotedFromLower.includes(c))
				.concat(relegatedFromUpper);

			boundaryResults.push({ upper, lower, promoted: promotedFromLower, relegated: relegatedFromUpper });
		}

		let newDivision = playerDivision;
		for (const br of boundaryResults) {
			if (br.upper === playerDivision && br.relegated.includes(playerClub)) {
				newDivision = playerDivision + 1;
			}
			if (br.lower === playerDivision && br.promoted.includes(playerClub)) {
				newDivision = playerDivision - 1;
			}
		}
		newDivision = Math.max(1, Math.min(4, newDivision));

		const playerInPromoted = newDivision < playerDivision;
		const playerInRelegated = newDivision > playerDivision;

		for (let d = 1; d <= 4; d++) {
			divisionRosters[d] = rosters[d];
		}

		const newDivClubs = rosters[newDivision];

		weekNumber = 1;
		seasonNumber++;
		fixtures = generatePlayerFixtures(playerClub, newDivClubs);
		divisionSchedule = generateDivisionSchedule(newDivision, newDivClubs);
		morale = MORALE_CONFIG.scale.start;
		lastWageWeek = 0;

		standings.init(newDivClubs);

		const seasonStats: SeasonStats = {
			goals: 0,
			appearances: 0,
			xpEarned: 0
		};

		const myDivisionPromoted = boundaryResults
			.filter((br) => br.lower === playerDivision)
			.flatMap((br) => br.promoted);
		const myDivisionRelegated = boundaryResults
			.filter((br) => br.upper === playerDivision)
			.flatMap((br) => br.relegated);

		return {
			newDivision,
			playerInPromoted,
			playerInRelegated,
			boundaryResults,
			myDivisionPromoted,
			myDivisionRelegated,
			finalStandings,
			seasonStats
		};
	}

	function recordSeasonSnapshot(playerGoals: number, playerApps: number, playerXp: number) {
		seasonGoalsAtStart = playerGoals;
		seasonAppsAtStart = playerApps;
		seasonXpAtStart = playerXp;
	}

	function getSeasonStats(currentGoals: number, currentApps: number, currentXp: number): SeasonStats {
		return {
			goals: currentGoals - seasonGoalsAtStart,
			appearances: currentApps - seasonAppsAtStart,
			xpEarned: currentXp - seasonXpAtStart
		};
	}

	return {
		get weekNumber() {
			return weekNumber;
		},
		set weekNumber(v: number) {
			weekNumber = Math.max(1, v);
		},
		get seasonNumber() {
			return seasonNumber;
		},
		set seasonNumber(v: number) {
			seasonNumber = v;
		},
		get fixtures() {
			return fixtures;
		},
		set fixtures(v: Fixture[]) {
			fixtures = v;
		},
		get divisionSchedule() {
			return divisionSchedule;
		},
		set divisionSchedule(v: DivisionSchedule) {
			divisionSchedule = v;
		},
		get gamesPlayed() {
			return gamesPlayed;
		},
		set gamesPlayed(v: number) {
			gamesPlayed = v;
		},
		get phase() {
			return phase;
		},
		set phase(v: Phase) {
			phase = v;
		},
		get morale() {
			return morale;
		},
		set morale(v: number) {
			morale = v;
		},
		get lastWageWeek() {
			return lastWageWeek;
		},
		set lastWageWeek(v: number) {
			lastWageWeek = v;
		},
		get divisionRosters() {
			return divisionRosters;
		},
		set divisionRosters(v: Record<number, string[]>) {
			divisionRosters = v;
		},
		get seasonXpAtStart() {
			return seasonXpAtStart;
		},
		set seasonXpAtStart(v: number) {
			seasonXpAtStart = v;
		},
		get seasonGoalsAtStart() {
			return seasonGoalsAtStart;
		},
		set seasonGoalsAtStart(v: number) {
			seasonGoalsAtStart = v;
		},
		get seasonAppsAtStart() {
			return seasonAppsAtStart;
		},
		set seasonAppsAtStart(v: number) {
			seasonAppsAtStart = v;
		},
		get appearanceSkips() {
			return appearanceSkips;
		},
		set appearanceSkips(v: number) {
			appearanceSkips = v;
		},
		advanceWeek,
		recordGamesPlayed,
		adjustMorale,
		addAppearanceSkips,
		consumeAppearanceSkip,
		endSeason,
		recordSeasonSnapshot,
		getSeasonStats,
		initDivisionRosters
	};
}

export const season = createSeason();
