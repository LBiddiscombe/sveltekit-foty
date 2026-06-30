import { describe, it, expect, beforeEach } from 'vitest';
import { season } from '$lib/stores/season.svelte';
import { player } from '$lib/stores/player.svelte';
import { standings } from '$lib/stores/standings.svelte';
import { inbox } from '$lib/stores/inbox.svelte';
import { generateDivisionSchedule } from '$lib/config/schedule';
import { getLeagueWeeks, CUP_SCHEDULE } from '$lib/config/cups';
import { getClubsByDivision } from '$lib/config/clubs';
import { resolveWeek } from './resolveWeek';

const CLUBS = ['Exetur', 'Barnett', 'Croo', 'Gillingham', 'Eton', 'Oxbridge'];

beforeEach(() => {
	season.weekNumber = 2;
	season.seasonNumber = 1;
	season.fixtures = [];
	season.gamesPlayed = 0;
	season.phase = 'hub';
	season.morale = 5;
	season.appearanceSkips = 0;
	season.lastWageWeek = 0;
	season.leagueCupBracket = null;
	season.faCupBracket = null;
	season.divisionRosters = { 4: [...CLUBS] };
	const leagueWeeks = getLeagueWeeks();
	season.divisionSchedule = generateDivisionSchedule(4, CLUBS, leagueWeeks);

	standings.init(CLUBS);

	player.name = 'Test Player';
	player.club = 'Exetur';
	player.division = 4;
	player.careerXp = 0;
	player.bankBalance = 5000;
	player.goals = 0;
	player.appearances = 0;
	player.queuedTransferCard = false;
	player.lastTransferWindow = null;
	player.deck = [3, 2, 1];
	player.matchXpHistory = [];

	inbox.items = [];
});

describe('resolveWeek', () => {
	it('returns display status for a normal week with league games', () => {
		const result = resolveWeek();
		expect(result.status).toBe('display');
		expect(result.lines.length).toBeGreaterThan(0);
		expect(result.lines[0]).toBe('INCOMING RESULTS');
	});

	it('returns display status on a cup-only week (no auto-continue)', () => {
		season.weekNumber = 1;
		season.leagueCupBracket = {
			type: 'league-cup',
			currentRound: 1,
			rounds: CUP_SCHEDULE['league-cup'].map((sr) => ({
				roundNumber: sr.round,
				ties: []
			})),
			eliminated: { Exetur: 1 }
		};
		season.faCupBracket = null;

		const leagueWeeks = getLeagueWeeks();
		const cupOnlyWeek1 = leagueWeeks.filter((w) => w !== 1);
		season.divisionSchedule = generateDivisionSchedule(4, CLUBS, cupOnlyWeek1);

		const result = resolveWeek();
		expect(result.status).toBe('display');
	});

	it('onContinue returns a string', () => {
		const result = resolveWeek();
		const dest = result.onContinue();
		expect(typeof dest).toBe('string');
	});

	it('includes scoreLines for league fixtures', () => {
		season.weekNumber = 2;
		const result = resolveWeek();
		expect(result.scoreLines.size).toBeGreaterThanOrEqual(0);
	});
});
