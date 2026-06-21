import { player } from '$lib/stores/player.svelte';
import { season } from '$lib/stores/season.svelte';
import { inbox } from '$lib/stores/inbox.svelte';
import { match } from '$lib/stores/match.svelte';
import type { InboxItem, MatchResult } from '$lib/types/game';
import { browser } from '$app/environment';

const SAVE_KEY = 'foty-save';

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
		gamesPlayed: number;
		phase: string;
		morale: number;
	};
	inboxItems: InboxItem[];
	matchResult: MatchResult | null;
}

export function saveGame(): void {
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
			gamesPlayed: season.gamesPlayed,
			phase: season.phase,
			morale: season.morale
		},
		inboxItems: JSON.parse(JSON.stringify(inbox.items)),
		matchResult: match.result ? JSON.parse(JSON.stringify(match.result)) : null
	};

	try {
		localStorage.setItem(SAVE_KEY, JSON.stringify(state));
	} catch {
		// storage full or unavailable — silently degrade
	}
}

export function loadGame(): boolean {
	if (!browser) return false;
	const raw = localStorage.getItem(SAVE_KEY);
	if (!raw) return false;

	try {
		const state: SaveState = JSON.parse(raw);

		player.name = state.player.name;
		player.age = state.player.age;
		player.wage = state.player.wage;
		player.bankBalance = state.player.bankBalance;
		player.goals = state.player.goals;
		player.appearances = state.player.appearances;
		player.club = state.player.club;
		player.division = state.player.division;
		player.deck = state.player.deck;

		season.weekNumber = state.season.weekNumber;
		season.seasonNumber = state.season.seasonNumber;
		season.gamesPlayed = state.season.gamesPlayed;
		season.phase = state.season.phase as typeof season.phase;
		season.morale = state.season.morale;

		inbox.items = state.inboxItems;

		match.result = state.matchResult;

		return true;
	} catch {
		localStorage.removeItem(SAVE_KEY);
		return false;
	}
}

export function hasSavedGame(): boolean {
	if (!browser) return false;
	return localStorage.getItem(SAVE_KEY) !== null;
}

export function clearSave(): void {
	if (!browser) return;
	localStorage.removeItem(SAVE_KEY);
}
