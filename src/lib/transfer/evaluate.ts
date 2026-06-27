import type { ScoutReport, TransferWindowState } from '$lib/types/game';
import { getClubsByDivision } from '$lib/config/clubs';
import { getLevel, getTargetBandsForScout } from '$lib/config/levels';
import { transferSigningFee } from '$lib/config/economy';
import { CLUB_STRENGTHS } from '$lib/config/club-strengths';
import { generatePlayerFixtures } from '$lib/config/fixtures';
import { generateDivisionSchedule } from '$lib/config/schedule';
import { simAiMatch } from '$lib/match/engine';
import { standings } from '$lib/stores/standings.svelte';

export function getTransferWindow(weekNumber: number): 1 | 2 | null {
	if (weekNumber >= 1 && weekNumber <= 4) return 1;
	if (weekNumber >= 16 && weekNumber <= 19) return 2;
	return null;
}

export function isPassiveScoutingBlocked(seasonNumber: number, window: 1 | 2): boolean {
	return seasonNumber === 1 && window === 1;
}

export function hasMovedThisWindow(
	lastTransfer: TransferWindowState | null,
	currentSeason: number,
	currentWindow: 1 | 2
): boolean {
	if (!lastTransfer) return false;
	return lastTransfer.season === currentSeason && lastTransfer.window === currentWindow;
}

export function rollPassiveScout(): boolean {
	return Math.random() < 0.25;
}

export function pickScoutDivision(playerDivision: number): number {
	if (playerDivision === 1) return 1;
	return Math.random() < 0.5 ? playerDivision : playerDivision - 1;
}

export function pickScoutClub(
	playerClub: string,
	scoutDivision: number,
	divisionRosters: Record<number, string[]>
): string | null {
	const clubs = (divisionRosters[scoutDivision] ?? getClubsByDivision(scoutDivision).map((c) => c.name)).filter(
		(c) => c !== playerClub
	);
	if (clubs.length === 0) return null;
	return clubs[Math.floor(Math.random() * clubs.length)];
}

export function pickTargetBand(scoutDivision: number, playerDivision: number) {
	const bands = getTargetBandsForScout(scoutDivision, playerDivision);
	if (bands.length === 0) return null;
	return bands[Math.floor(Math.random() * bands.length)];
}

export function evaluateScout(
	playerClub: string,
	playerDivision: number,
	careerXp: number,
	divisionRosters: Record<number, string[]>
): ScoutReport | null {
	const scoutDiv = pickScoutDivision(playerDivision);
	const scoutClub = pickScoutClub(playerClub, scoutDiv, divisionRosters);
	if (!scoutClub) return null;

	const targetBand = pickTargetBand(scoutDiv, playerDivision);
	if (!targetBand) return null;

	const playerLevel = getLevel(careerXp);
	const success = careerXp >= targetBand.minXp;

	const report: ScoutReport = {
		scoutClub,
		scoutDivision: scoutDiv,
		targetBandName: targetBand.title,
		targetBandMinXp: targetBand.minXp,
		success,
		playerLevelName: playerLevel.title,
		playerXp: careerXp
	};

	if (success) {
		const fee = transferSigningFee(
			Math.max(75, careerXp * 2),
			scoutDiv,
			playerDivision
		);
		report.signingFee = fee;
	}

	return report;
}

export function processSameDivisionTransfer(
	player: { archiveCurrentStats: (season: number, division: number, pos: number | null) => void; club: string; division: number; adjustBalance: (n: number) => void; addDeckCards: (n: number) => void; wage: number },
	season: { weekNumber: number; seasonNumber: number; divisionRosters: Record<number, string[]> },
	newClub: string,
	signingFee: number
) {
	const currentSeason = season.seasonNumber;
	const currentDiv = player.division;

	player.archiveCurrentStats(currentSeason, currentDiv, null);

	player.club = newClub;
	player.adjustBalance(signingFee);
	player.addDeckCards(10);

	const newDivClubs = season.divisionRosters[currentDiv] ?? [];
	const fixtures = generatePlayerFixtures(newClub, newDivClubs);
	const week = season.weekNumber;
	const remainingFixtures = fixtures.filter((f) => f.weekNumber >= week);
	season.divisionRosters[currentDiv] = newDivClubs;
	return { remainingFixtures, newDivision: currentDiv };
}

export function processDivisionUpTransfer(
	player: { archiveCurrentStats: (season: number, division: number, pos: number | null) => void; club: string; division: number; adjustBalance: (n: number) => void; addDeckCards: (n: number) => void; wage: number },
	seasonState: { weekNumber: number; seasonNumber: number; divisionRosters: Record<number, string[]> },
	standingsStore: typeof standings,
	newClub: string,
	newDivision: number,
	signingFee: number
) {
	const currentSeason = seasonState.seasonNumber;

	player.archiveCurrentStats(currentSeason, player.division, null);

	player.club = newClub;
	player.division = newDivision;
	player.adjustBalance(signingFee);
	player.addDeckCards(10);

	const newDivClubs = seasonState.divisionRosters[newDivision] ?? getClubsByDivision(newDivision).map((c) => c.name);

	const fullSchedule = generateDivisionSchedule(newDivision, newDivClubs);
	const fixtures = generatePlayerFixtures(newClub, newDivClubs);

	const currentWeek = seasonState.weekNumber;

	for (const week of fullSchedule.weeks) {
		if (week.weekNumber >= currentWeek) break;
		for (const match of week.matches) {
			if (!match.result) {
				const homeStrength = CLUB_STRENGTHS[match.home] ?? 5;
				const awayStrength = CLUB_STRENGTHS[match.away] ?? 5;
				match.result = simAiMatch(homeStrength, awayStrength);
			}
		}
	}

	standingsStore.init(newDivClubs);
	for (const week of fullSchedule.weeks) {
		if (week.weekNumber >= currentWeek) break;
		const results = week.matches.map((m) => ({
			home: m.home,
			away: m.away,
			result: m.result!
		}));
		standingsStore.processWeekResults(results, week.weekNumber);
	}

	const remainingFixtures = fixtures.filter((f) => f.weekNumber >= currentWeek);

	seasonState.divisionRosters[newDivision] = newDivClubs;

	return { remainingFixtures, fullSchedule };
}
