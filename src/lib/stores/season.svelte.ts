import type { DivisionSchedule, Fixture, Phase, Standing } from '$lib/types/game';
import { MORALE_CONFIG } from '$lib/config/morale';
import { getClubsByDivision } from '$lib/config/clubs';
import { CLUB_STRENGTHS } from '$lib/config/club-strengths';
import { generateDivisionSchedule } from '$lib/config/schedule';
import { deriveFixturesFromSchedule } from '$lib/config/fixtures';
import { standings } from './standings.svelte';

export type BoundaryResult = {
	upper: number;
	lower: number;
	promoted: string[];
	relegated: string[];
};

export type SeasonStats = {
	chances: number;
	saves: number;
	misses: number;
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
	let statsXpAtStart = $state(0);
	let statsGoalsAtStart = $state(0);
	let statsAppsAtStart = $state(0);
	let statsChancesAtStart = $state(0);
	let statsSavesAtStart = $state(0);
	let statsMissesAtStart = $state(0);

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

			boundaryResults.push({
				upper,
				lower,
				promoted: promotedFromLower,
				relegated: relegatedFromUpper
			});
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
		const newSchedule = generateDivisionSchedule(newDivision, newDivClubs);
		fixtures = deriveFixturesFromSchedule(playerClub, newSchedule);
		divisionSchedule = newSchedule;
		morale = MORALE_CONFIG.scale.start;
		lastWageWeek = 0;

		standings.init(newDivClubs);

		const seasonStats: SeasonStats = {
			chances: 0,
			saves: 0,
			misses: 0,
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

	function recordStatsSnapshot(
		playerGoals: number,
		playerApps: number,
		playerXp: number,
		playerChances: number = 0,
		playerSaves: number = 0,
		playerMisses: number = 0
	) {
		statsGoalsAtStart = playerGoals;
		statsAppsAtStart = playerApps;
		statsXpAtStart = playerXp;
		statsChancesAtStart = playerChances;
		statsSavesAtStart = playerSaves;
		statsMissesAtStart = playerMisses;
	}

	function getStatsSinceSnapshot(
		currentGoals: number,
		currentApps: number,
		currentXp: number,
		currentChances: number = 0,
		currentSaves: number = 0,
		currentMisses: number = 0
	): SeasonStats {
		return {
			chances: currentChances - statsChancesAtStart,
			saves: currentSaves - statsSavesAtStart,
			misses: currentMisses - statsMissesAtStart,
			goals: currentGoals - statsGoalsAtStart,
			appearances: currentApps - statsAppsAtStart,
			xpEarned: currentXp - statsXpAtStart
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
		get statsXpAtStart() {
			return statsXpAtStart;
		},
		set statsXpAtStart(v: number) {
			statsXpAtStart = v;
		},
		get statsGoalsAtStart() {
			return statsGoalsAtStart;
		},
		set statsGoalsAtStart(v: number) {
			statsGoalsAtStart = v;
		},
		get statsAppsAtStart() {
			return statsAppsAtStart;
		},
		set statsAppsAtStart(v: number) {
			statsAppsAtStart = v;
		},
		get statsChancesAtStart() {
			return statsChancesAtStart;
		},
		set statsChancesAtStart(v: number) {
			statsChancesAtStart = v;
		},
		get statsSavesAtStart() {
			return statsSavesAtStart;
		},
		set statsSavesAtStart(v: number) {
			statsSavesAtStart = v;
		},
		get statsMissesAtStart() {
			return statsMissesAtStart;
		},
		set statsMissesAtStart(v: number) {
			statsMissesAtStart = v;
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
		recordStatsSnapshot,
		getStatsSinceSnapshot,
		initDivisionRosters
	};
}

export const season = createSeason();
