import { describe, it, expect, beforeEach } from 'vitest';
import { saveGame, loadGame, createInMemoryAdapter, type SaveAdapter } from './save';
import { player } from './stores/player.svelte';
import { season } from './stores/season.svelte';
import { inbox } from './stores/inbox.svelte';
import { standings } from './stores/standings.svelte';
import { match } from './stores/match.svelte';
import { getClubsByDivision } from './config/clubs';
import { ECONOMY } from './config/economy';
import { deriveFixturesFromSchedule } from './config/fixtures';
import { generateDivisionSchedule } from './config/schedule';

const CLUB = 'Ackrington';

function defaultStores() {
	player.name = '';
	player.wage = ECONOMY.weeklyWages[4];
	player.bankBalance = 5000;
	player.goals = 0;
	player.appearances = 0;
	player.club = 'Free Agent';
	player.division = 4;
	player.deck = [2, 1, 3];
	player.careerXp = 0;
	player.matchXpHistory = [];

	season.weekNumber = 1;
	season.seasonNumber = 1;
	season.fixtures = [];
	season.divisionSchedule = { weeks: [] };
	season.gamesPlayed = 0;
	season.phase = 'hub';
	season.morale = 5;
	season.lastWageWeek = 0;

	inbox.items = [];
	match.result = null;
	standings.entries = [];
	standings.lastProcessedWeek = 0;
}

describe('full career flow persistence', () => {
	let adapter: SaveAdapter;

	beforeEach(() => {
		adapter = createInMemoryAdapter();
		defaultStores();
	});

	it('retains weekNumber and standings after full weekly cycle save/load', () => {
		const div4Clubs = getClubsByDivision(4).map((c) => c.name);

		// team-select
		player.name = 'TestPlayer';
		player.bankBalance = 5000;
		player.club = CLUB;
		player.division = 4;
		const schedule = generateDivisionSchedule(4, div4Clubs);
		season.fixtures = deriveFixturesFromSchedule(CLUB, schedule);
		season.divisionSchedule = schedule;
		standings.init(div4Clubs);
		inbox.init(CLUB);

		// hub visit (week 1)
		season.phase = 'hub';
		if (season.weekNumber > season.lastWageWeek) {
			player.adjustBalance(ECONOMY.weeklyWages[4]);
			season.lastWageWeek = season.weekNumber;
		}
		saveGame(adapter);

		// answer inbox
		inbox.items = inbox.items.map((i) => ({ ...i, actioned: true }));

		// play week 1 matches
		const weekFixtures = season.fixtures.filter((f) => f.weekNumber === 1);
		for (const f of weekFixtures) {
			f.result = { goalsFor: 2, goalsAgainst: 1, playerGoals: 1, outcomes: [] };
		}

		// vidiprinter
		season.phase = 'vidiprinter';
		if (season.weekNumber > standings.lastProcessedWeek) {
			const results: {
				home: string;
				away: string;
				result: { homeGoals: number; awayGoals: number };
			}[] = [];
			for (const f of weekFixtures) {
				const home = f.isHome ? CLUB : f.opponent;
				const away = f.isHome ? f.opponent : CLUB;
				results.push({
					home,
					away,
					result: {
						homeGoals: f.isHome ? f.result!.goalsFor : f.result!.goalsAgainst,
						awayGoals: f.isHome ? f.result!.goalsAgainst : f.result!.goalsFor
					}
				});
			}
			standings.processWeekResults(results, season.weekNumber);
			saveGame(adapter);
		}

		// onContinue: advance week
		season.recordGamesPlayed(weekFixtures.length);
		season.advanceWeek(); // weekNumber → 2
		saveGame(adapter);

		// hub visit (week 2)
		season.phase = 'hub';
		if (season.weekNumber > season.lastWageWeek) {
			player.adjustBalance(ECONOMY.weeklyWages[4]);
			season.lastWageWeek = season.weekNumber;
		}
		saveGame(adapter);

		// ── Simulate page refresh (clear stores) ──
		defaultStores();

		// ── Title page: loadGame ──
		const loaded = loadGame(adapter);
		expect(loaded).toBe(true);

		// ── Check stores BEFORE simulating hub $effect ──
		expect(season.weekNumber).toBe(2);
		expect(standings.entries).toHaveLength(div4Clubs.length);
		expect(standings.lastProcessedWeek).toBe(1);

		const entryBefore = standings.getByClub(CLUB);
		expect(entryBefore).toBeDefined();
		expect(entryBefore!.played).toBeGreaterThan(0);

		// ── Simulate hub $effect ──
		season.phase = 'hub';
		if (season.weekNumber > season.lastWageWeek) {
			player.adjustBalance(ECONOMY.weeklyWages[4]);
			season.lastWageWeek = season.weekNumber;
		}
		saveGame(adapter);

		// ── Verify everything survived the hub $effect ──
		expect(season.weekNumber).toBe(2);
		expect(season.lastWageWeek).toBe(2);
		expect(standings.entries).toHaveLength(div4Clubs.length);

		const entryAfter = standings.getByClub(CLUB);
		expect(entryAfter).toBeDefined();
		expect(entryAfter!.played).toBeGreaterThan(0);
	});
});
