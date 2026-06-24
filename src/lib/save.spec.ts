import { describe, it, expect, beforeEach } from 'vitest';
import {
	saveGame,
	loadGame,
	hasSavedGame,
	clearSave,
	createInMemoryAdapter,
	type SaveAdapter
} from './save';
import { player } from './stores/player.svelte';
import { season } from './stores/season.svelte';
import { inbox } from './stores/inbox.svelte';
import { match } from './stores/match.svelte';

function seedStores() {
	player.name = 'Test Player';
	player.age = 17;
	player.wage = 75;
	player.bankBalance = 5000;
	player.goals = 5;
	player.appearances = 3;
	player.club = 'Exetur';
	player.division = 4;
	player.deck = [2, 1, 3];

	season.weekNumber = 10;
	season.seasonNumber = 1;
	season.fixtures = [
		{ opponent: 'Croo', isHome: true, weekNumber: 1 },
		{ opponent: 'Barnett', isHome: false, weekNumber: 1 }
	];
	season.gamesPlayed = 2;
	season.phase = 'hub';
	season.morale = 6;

	inbox.items = [
		{
			id: 1,
			type: 'news',
			subject: 'Welcome',
			body: 'hello',
			actionRequired: false,
			actioned: false
		}
	];

	match.result = null;
}

let adapter: SaveAdapter;

beforeEach(() => {
	adapter = createInMemoryAdapter();
	seedStores();
});

describe('saveGame', () => {
	it('saves player state to adapter', () => {
		saveGame(adapter);
		const raw = adapter.getItem('foty-save');
		expect(raw).not.toBeNull();
		const data = JSON.parse(raw!);
		expect(data.player.name).toBe('Test Player');
		expect(data.player.bankBalance).toBe(5000);
		expect(data.player.goals).toBe(5);
		expect(data.player.appearances).toBe(3);
		expect(data.player.club).toBe('Exetur');
		expect(data.player.deck).toEqual([2, 1, 3]);
	});

	it('saves season state to adapter', () => {
		saveGame(adapter);
		const raw = adapter.getItem('foty-save');
		const data = JSON.parse(raw!);
		expect(data.season.weekNumber).toBe(10);
		expect(data.season.morale).toBe(6);
		expect(data.season.fixtures).toHaveLength(2);
	});

	it('saves inbox items', () => {
		saveGame(adapter);
		const raw = adapter.getItem('foty-save');
		const data = JSON.parse(raw!);
		expect(data.inboxItems).toHaveLength(1);
		expect(data.inboxItems[0].subject).toBe('Welcome');
	});

	it('does not save when there are no fixtures', () => {
		season.fixtures = [];
		saveGame(adapter);
		expect(adapter.getItem('foty-save')).toBeNull();
	});

	it('saves match result when present', () => {
		match.result = {
			played: true,
			chances: 3,
			outcomes: ['goal', 'miss', 'goal'],
			score: [3, 1],
			rating: 8
		};
		saveGame(adapter);
		const raw = adapter.getItem('foty-save');
		const data = JSON.parse(raw!);
		expect(data.matchResult).toEqual({
			played: true,
			chances: 3,
			outcomes: ['goal', 'miss', 'goal'],
			score: [3, 1],
			rating: 8
		});
	});
});

describe('loadGame', () => {
	it('restores all stores from saved state', () => {
		saveGame(adapter);

		player.name = '';
		player.bankBalance = 0;
		player.goals = 0;
		player.appearances = 0;
		season.weekNumber = 1;
		season.morale = 5;

		const result = loadGame(adapter);
		expect(result).toBe(true);
		expect(player.name).toBe('Test Player');
		expect(player.bankBalance).toBe(5000);
		expect(player.goals).toBe(5);
		expect(player.appearances).toBe(3);
		expect(season.weekNumber).toBe(10);
		expect(season.morale).toBe(6);
	});

	it('returns false when no save exists', () => {
		expect(loadGame(adapter)).toBe(false);
	});

	it('removes corrupt save and returns false', () => {
		adapter.setItem('foty-save', 'not-json');
		expect(loadGame(adapter)).toBe(false);
		expect(adapter.getItem('foty-save')).toBeNull();
	});

	it('removes save with empty fixtures and returns false', () => {
		season.fixtures = [];
		saveGame(adapter);
		expect(loadGame(adapter)).toBe(false);
		expect(adapter.getItem('foty-save')).toBeNull();
	});
});

describe('hasSavedGame', () => {
	it('returns false when no save exists', () => {
		expect(hasSavedGame(adapter)).toBe(false);
	});

	it('returns true when save exists', () => {
		saveGame(adapter);
		expect(hasSavedGame(adapter)).toBe(true);
	});
});

describe('clearSave', () => {
	it('removes saved data', () => {
		saveGame(adapter);
		clearSave(adapter);
		expect(adapter.getItem('foty-save')).toBeNull();
		expect(hasSavedGame(adapter)).toBe(false);
	});

	it('does not throw when no save exists', () => {
		expect(() => clearSave(adapter)).not.toThrow();
	});
});

describe('saveGame validation', () => {
	it('rejects save when club is Free Agent', () => {
		player.club = 'Free Agent';
		const result = saveGame(adapter);
		expect(result).toBe(false);
		expect(adapter.getItem('foty-save')).toBeNull();
	});

	it('rejects save when fixtures are empty', () => {
		season.fixtures = [];
		const result = saveGame(adapter);
		expect(result).toBe(false);
		expect(adapter.getItem('foty-save')).toBeNull();
	});

	it('returns true on successful save', () => {
		const result = saveGame(adapter);
		expect(result).toBe(true);
		expect(adapter.getItem('foty-save')).not.toBeNull();
	});
});

describe('loadGame resilience', () => {
	it('backs up corrupt JSON and returns false', () => {
		adapter.setItem('foty-save', 'not-json');
		const result = loadGame(adapter);
		expect(result).toBe(false);
		expect(adapter.getItem('foty-save')).toBeNull();
		// backup should exist under a backup key
		const backup = adapter.getItem('foty-save-backup-parse-error');
		expect(backup).toBe('not-json');
	});

	it('backs up save with empty fixtures and returns false', () => {
		const state = {
			player: { club: 'Exetur', name: 'T', age: 17, bankBalance: 5000, goals: 0, appearances: 0, division: 4, deck: [], careerXp: 0, matchXpHistory: [] },
			season: { weekNumber: 1, seasonNumber: 1, fixtures: [], divisionSchedule: { weeks: [] }, gamesPlayed: 0, phase: 'hub', morale: 5, lastWageWeek: 0 },
			inboxItems: [],
			matchResult: null,
			standings: [],
			lastProcessedWeek: 0
		};
		adapter.setItem('foty-save', JSON.stringify(state));
		const result = loadGame(adapter);
		expect(result).toBe(false);
		expect(adapter.getItem('foty-save')).toBeNull();
	});
});
