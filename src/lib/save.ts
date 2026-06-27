import { player } from '$lib/stores/player.svelte';
import { season } from '$lib/stores/season.svelte';
import { inbox } from '$lib/stores/inbox.svelte';
import { match } from '$lib/stores/match.svelte';
import { standings } from '$lib/stores/standings.svelte';
import { wageForLevel } from '$lib/config/economy';
import { getLevelIndex } from '$lib/config/levels';
import type { DivisionSchedule, Fixture, InboxItem, MatchResult, Standing } from '$lib/types/game';

const SAVE_KEY = 'foty-save';
const SAVE_BACKUP_KEY = 'foty-save-backup';

export interface SaveAdapter {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
}

export const localStorageAdapter: SaveAdapter = {
	getItem(key: string): string | null {
		if (typeof localStorage === 'undefined') return null;
		try {
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	},
	setItem(key: string, value: string): void {
		if (typeof localStorage === 'undefined') return;
		try {
			localStorage.setItem(key, value);
		} catch {
			// storage full or unavailable — silently degrade
		}
	},
	removeItem(key: string): void {
		if (typeof localStorage === 'undefined') return;
		try {
			localStorage.removeItem(key);
		} catch {
			// silently degrade
		}
	}
};

export function createInMemoryAdapter(): SaveAdapter {
	const store = new Map<string, string>();
	return {
		getItem(key: string): string | null {
			return store.get(key) ?? null;
		},
		setItem(key: string, value: string): void {
			store.set(key, value);
		},
		removeItem(key: string): void {
			store.delete(key);
		}
	};
}

interface SaveState {
	player: {
		name: string;
		age: number;
		bankBalance: number;
		goals: number;
		appearances: number;
		club: string;
		division: number;
		deck: number[];
		careerXp: number;
		matchXpHistory: number[];
	};
	season: {
		weekNumber: number;
		seasonNumber: number;
		fixtures: Fixture[];
		divisionSchedule: DivisionSchedule;
		gamesPlayed: number;
		phase: string;
		morale: number;
		lastWageWeek: number;
		divisionRosters: Record<string, string[]>;
		seasonXpAtStart: number;
		seasonGoalsAtStart: number;
		seasonAppsAtStart: number;
		appearanceSkips: number;
	};
	inboxItems: InboxItem[];
	matchResult: MatchResult | null;
	standings: Standing[];
	lastProcessedWeek: number;
}

function hasValidState(): boolean {
	return (
		player.club !== 'Free Agent' &&
		player.club !== '' &&
		season.fixtures.length > 0
	);
}

export function saveGame(adapter: SaveAdapter = localStorageAdapter): boolean {
	if (!hasValidState()) return false;

	const state: SaveState = {
		player: {
			name: player.name,
			age: player.age,
			bankBalance: player.bankBalance,
			goals: player.goals,
			appearances: player.appearances,
			club: player.club,
			division: player.division,
			deck: [...player.deck],
			careerXp: player.careerXp,
			matchXpHistory: [...player.matchXpHistory]
		},
		season: {
			weekNumber: season.weekNumber,
			seasonNumber: season.seasonNumber,
			fixtures: JSON.parse(JSON.stringify(season.fixtures)),
			divisionSchedule: JSON.parse(JSON.stringify(season.divisionSchedule)),
			gamesPlayed: season.gamesPlayed,
			phase: season.phase,
			morale: season.morale,
			lastWageWeek: season.lastWageWeek,
			divisionRosters: JSON.parse(JSON.stringify(season.divisionRosters)),
			seasonXpAtStart: season.seasonXpAtStart,
			seasonGoalsAtStart: season.seasonGoalsAtStart,
			seasonAppsAtStart: season.seasonAppsAtStart,
			appearanceSkips: season.appearanceSkips
		},
		inboxItems: JSON.parse(JSON.stringify(inbox.items)),
		matchResult: match.result ? JSON.parse(JSON.stringify(match.result)) : null,
		standings: JSON.parse(JSON.stringify(standings.entries)),
		lastProcessedWeek: standings.lastProcessedWeek
	};

	try {
		adapter.setItem(SAVE_KEY, JSON.stringify(state));
		return true;
	} catch {
		return false;
	}
}

export function loadGame(adapter: SaveAdapter = localStorageAdapter): boolean {
	const raw = adapter.getItem(SAVE_KEY);
	if (!raw) return false;

	let state: SaveState;
	try {
		state = JSON.parse(raw);
	} catch {
		backupAndRemove(adapter, raw, 'parse-error');
		return false;
	}

	if (!state.season?.fixtures || state.season.fixtures.length === 0) {
		backupAndRemove(adapter, raw, 'empty-fixtures');
		return false;
	}

	if (!state.player?.club || state.player.club === 'Free Agent') {
		backupAndRemove(adapter, raw, 'invalid-player');
		return false;
	}

	try {
		player.name = state.player.name;
		player.age = state.player.age;
		player.bankBalance = state.player.bankBalance;
		player.goals = state.player.goals;
		player.appearances = state.player.appearances;
		player.club = state.player.club;
		player.division = state.player.division;
		player.deck = state.player.deck;
		player.careerXp = state.player.careerXp ?? 0;
		player.wage = wageForLevel(getLevelIndex(player.careerXp));
		player.matchXpHistory = state.player.matchXpHistory ?? [];

		season.weekNumber = Math.max(1, state.season.weekNumber);
		season.seasonNumber = state.season.seasonNumber;
		season.fixtures = state.season.fixtures;
		season.divisionSchedule = state.season.divisionSchedule ?? { weeks: [] };
		season.gamesPlayed = state.season.gamesPlayed;
		season.phase = state.season.phase as typeof season.phase;
		season.morale = state.season.morale;
		season.lastWageWeek = state.season.lastWageWeek ?? 0;
		if (state.season.divisionRosters) {
			season.divisionRosters = state.season.divisionRosters;
		}
		season.seasonXpAtStart = state.season.seasonXpAtStart ?? 0;
		season.seasonGoalsAtStart = state.season.seasonGoalsAtStart ?? 0;
		season.seasonAppsAtStart = state.season.seasonAppsAtStart ?? 0;
		season.appearanceSkips = state.season.appearanceSkips ?? 0;

		inbox.items = state.inboxItems;

		match.result = state.matchResult;

		if (state.standings && state.standings.length > 0) {
			standings.entries = state.standings;
		}
		standings.lastProcessedWeek = state.lastProcessedWeek ?? 0;

		return true;
	} catch (err) {
		backupAndRemove(adapter, raw, `restore-error: ${err}`);
		return false;
	}
}

function backupAndRemove(adapter: SaveAdapter, raw: string, reason: string) {
	try {
		adapter.setItem(`${SAVE_BACKUP_KEY}-${reason}`, raw);
	} catch {
		// backup storage full — just remove the save
	}
	adapter.removeItem(SAVE_KEY);
}

export function hasSavedGame(adapter: SaveAdapter = localStorageAdapter): boolean {
	return adapter.getItem(SAVE_KEY) !== null;
}

export function clearSave(adapter: SaveAdapter = localStorageAdapter): void {
	adapter.removeItem(SAVE_KEY);
}
