import type { DivisionSchedule, Fixture, Phase } from '$lib/types/game';
import { MORALE_CONFIG } from '$lib/config/morale';
import { getClubsByDivision, ALL_CLUBS } from '$lib/config/clubs';
import { generateDivisionSchedule } from '$lib/config/schedule';
import { generatePlayerFixtures } from '$lib/config/fixtures';
import { standings } from './standings.svelte';

function createSeason() {
	let weekNumber = $state(1);
	let seasonNumber = $state(1);
	let fixtures = $state<Fixture[]>([]);
	let divisionSchedule = $state<DivisionSchedule>({ weeks: [] });
	let gamesPlayed = $state(0);
	let phase = $state<Phase>('hub');
	let morale = $state(MORALE_CONFIG.scale.start);
	let lastWageWeek = $state(0);

	function advanceWeek() {
		weekNumber = Math.min(weekNumber + 1, 30);
	}

	function recordGamesPlayed(n: number) {
		gamesPlayed += n;
	}

	function adjustMorale(delta: number) {
		morale = MORALE_CONFIG.adjustMorale(morale, delta);
	}

	function endSeason(playerClub: string, playerDivision: number) {
		const entries = standings.entries;
		const sorted = [...entries].sort((a, b) => {
			if (b.points !== a.points) return b.points - a.points;
			if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
			if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
			return a.club.localeCompare(b.club);
		});

		const n = sorted.length;
		const promoted = sorted.slice(0, 3).map((s) => s.club);
		const relegated = sorted.slice(n - 3).map((s) => s.club);

		const playerInPromoted = promoted.includes(playerClub);
		const playerInRelegated = relegated.includes(playerClub);

		let newDivision = playerDivision;
		if (playerInPromoted && playerDivision > 1) newDivision = playerDivision - 1;
		if (playerInRelegated && playerDivision < 4) newDivision = playerDivision + 1;

		const newDivClubs = getClubsByDivision(newDivision).map((c) => c.name);

		weekNumber = 1;
		seasonNumber++;
		fixtures = generatePlayerFixtures(playerClub, newDivClubs);
		divisionSchedule = generateDivisionSchedule(newDivision, newDivClubs);
		morale = MORALE_CONFIG.scale.start;
		lastWageWeek = 0;

		standings.init(newDivClubs);

		return { newDivision, promoted, relegated, playerInPromoted, playerInRelegated };
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
		advanceWeek,
		recordGamesPlayed,
		adjustMorale,
		endSeason
	};
}

export const season = createSeason();
