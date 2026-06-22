import { player } from '$lib/stores/player.svelte';
import { season } from '$lib/stores/season.svelte';
import { inbox } from '$lib/stores/inbox.svelte';
import { match } from '$lib/stores/match.svelte';
import type { Fixture, InboxItem, MatchResult } from '$lib/types/game';

const SAVE_KEY = 'foty-save';

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
		wage: number;
		bankBalance: number;
		goals: number;
		appearances: number;
		club: string;
		division: number;
		deck: number[];
	};
	season: {
		weekNumber: number;
		seasonNumber: number;
		fixtures: Fixture[];
		gamesPlayed: number;
		phase: string;
		morale: number;
	};
	inboxItems: InboxItem[];
	matchResult: MatchResult | null;
}

export function saveGame(adapter: SaveAdapter = localStorageAdapter): void {
	if (!season.fixtures || season.fixtures.length === 0) return;
	const state: SaveState = {
		player: {
			name: player.name,
			age: player.age,
			wage: player.wage,
			bankBalance: player.bankBalance,
			goals: player.goals,
			appearances: player.appearances,
			club: player.club,
			division: player.division,
			deck: [...player.deck]
		},
		season: {
			weekNumber: season.weekNumber,
			seasonNumber: season.seasonNumber,
			fixtures: JSON.parse(JSON.stringify(season.fixtures)),
			gamesPlayed: season.gamesPlayed,
			phase: season.phase,
			morale: season.morale
		},
		inboxItems: JSON.parse(JSON.stringify(inbox.items)),
		matchResult: match.result ? JSON.parse(JSON.stringify(match.result)) : null
	};

	try {
		adapter.setItem(SAVE_KEY, JSON.stringify(state));
	} catch {
		// silently degrade
	}
}

export function loadGame(adapter: SaveAdapter = localStorageAdapter): boolean {
	const raw = adapter.getItem(SAVE_KEY);
	if (!raw) return false;

	try {
		const state: SaveState = JSON.parse(raw);

		if (!state.season.fixtures || state.season.fixtures.length === 0) {
			adapter.removeItem(SAVE_KEY);
			return false;
		}

		player.name = state.player.name;
		player.age = state.player.age;
		player.wage = state.player.wage;
		player.bankBalance = state.player.bankBalance;
		player.goals = state.player.goals;
		player.appearances = state.player.appearances;
		player.club = state.player.club;
		player.division = state.player.division;
		player.deck = state.player.deck;

		season.weekNumber = Math.max(1, state.season.weekNumber);
		season.seasonNumber = state.season.seasonNumber;
		season.fixtures = state.season.fixtures;
		season.gamesPlayed = state.season.gamesPlayed;
		season.phase = state.season.phase as typeof season.phase;
		season.morale = state.season.morale;

		inbox.items = state.inboxItems;

		match.result = state.matchResult;

		return true;
	} catch {
		adapter.removeItem(SAVE_KEY);
		return false;
	}
}

export function hasSavedGame(adapter: SaveAdapter = localStorageAdapter): boolean {
	return adapter.getItem(SAVE_KEY) !== null;
}

export function clearSave(adapter: SaveAdapter = localStorageAdapter): void {
	adapter.removeItem(SAVE_KEY);
}
