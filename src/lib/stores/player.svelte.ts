import type { Outcome, StatsArchiveEntry, TransferWindowState } from '$lib/types/game';
import { wageForLevel } from '$lib/config/economy';
import { getLevel, getLevelIndex, LEVEL_UP_MESSAGES } from '$lib/config/levels';
import { inbox } from './inbox.svelte';
import { season } from './season.svelte';
import { range, randomInt } from '$lib/utils';

function randomDeck(size: number): number[] {
	return range(size).map(() => randomInt(1, 4));
}

function createPlayer() {
	let name = $state('');
	let wage = $state(wageForLevel(getLevelIndex(0)));
	let bankBalance = $state(5000);
	let goals = $state(0);
	let appearances = $state(0);
	let club = $state('Free Agent');
	let division = $state(4);
	let deck = $state<number[]>(randomDeck(10));
	let careerXp = $state(0);
	let matchXpHistory = $state<number[]>([]);
	let statsArchive = $state<StatsArchiveEntry[]>([]);
	let chances = $state(0);
	let saves = $state(0);
	let misses = $state(0);
	let queuedTransferCard = $state(false);
	let lastTransferWindow = $state<TransferWindowState | null>(null);

	function adjustBalance(delta: number) {
		bankBalance = Math.max(0, bankBalance + delta);
	}

	function addToDeck(card: number) {
		deck.push(card);
	}

	function addDeckCards(n: number) {
		deck.push(...randomDeck(n));
	}

	function removeDeckCards(n: number) {
		deck.splice(0, Math.min(n, deck.length));
	}

	function multiplyWage(factor: number) {
		wage = Math.round(wage * factor);
	}

	function peekDeck(): number {
		return deck[0] ?? 1;
	}

	function drawFromDeck(): number | undefined {
		return deck.shift();
	}

	function returnToDeck(card: number) {
		deck.push(card);
	}

	function addGoals(n: number) {
		goals += n;
	}

	function recordAppearance() {
		appearances++;
	}

	function addXp(delta: number) {
		const oldLevel = getLevelIndex(careerXp);
		careerXp = Math.max(0, careerXp + delta);
		const newLevel = getLevelIndex(careerXp);
		wage = wageForLevel(newLevel);
		if (newLevel > oldLevel && LEVEL_UP_MESSAGES[newLevel]) {
			inbox.addMessage({
				type: 'news',
				subject: `Level Up: ${getLevel(careerXp).title}`,
				body: LEVEL_UP_MESSAGES[newLevel].replace('{wage}', String(wage)),
				actionRequired: false
			});
		}
	}

	function addSeasonCards() {
		deck.push(...randomDeck(10));
	}

	function recordMatchXp(xp: number) {
		matchXpHistory = [...matchXpHistory.slice(-4), xp];
	}

	function recordMatchOutcomes(outcomes: Outcome[]) {
		for (const o of outcomes) {
			if (o === 'saved') saves++;
			else if (o === 'miss') misses++;
			chances++;
		}
	}

	function archiveCurrentStats(
		seasonNumber: number,
		division: number,
		finalPosition: number | null
	) {
		const period = season.getStatsSinceSnapshot(
			goals,
			appearances,
			careerXp,
			chances,
			saves,
			misses
		);
		statsArchive = [
			...statsArchive,
			{
				seasonNumber,
				club,
				division,
				chances: period.chances,
				saves: period.saves,
				misses: period.misses,
				goals: period.goals,
				appearances: period.appearances,
				xpEarned: period.xpEarned,
				finalPosition
			}
		];
		season.recordStatsSnapshot(goals, appearances, careerXp, chances, saves, misses);
	}

	return {
		get name() {
			return name;
		},
		set name(v: string) {
			name = v;
		},
		get age() {
			return 17 + (season.seasonNumber - 1);
		},
		get wage() {
			return wage;
		},
		set wage(v: number) {
			wage = v;
		},
		get bankBalance() {
			return bankBalance;
		},
		set bankBalance(v: number) {
			bankBalance = v;
		},
		get goals() {
			return goals;
		},
		set goals(v: number) {
			goals = v;
		},
		get appearances() {
			return appearances;
		},
		set appearances(v: number) {
			appearances = v;
		},
		get club() {
			return club;
		},
		set club(v: string) {
			club = v;
		},
		get division() {
			return division;
		},
		set division(v: number) {
			division = v;
		},
		get deck() {
			return deck;
		},
		set deck(v: number[]) {
			deck = v;
		},
		get careerXp() {
			return careerXp;
		},
		set careerXp(v: number) {
			careerXp = v;
		},
		get matchXpHistory() {
			return matchXpHistory;
		},
		set matchXpHistory(v: number[]) {
			matchXpHistory = v;
		},
		get statsArchive() {
			return statsArchive;
		},
		set statsArchive(v: StatsArchiveEntry[]) {
			statsArchive = v;
		},
		get chances() {
			return chances;
		},
		set chances(v: number) {
			chances = v;
		},
		get saves() {
			return saves;
		},
		set saves(v: number) {
			saves = v;
		},
		get misses() {
			return misses;
		},
		set misses(v: number) {
			misses = v;
		},
		get queuedTransferCard() {
			return queuedTransferCard;
		},
		set queuedTransferCard(v: boolean) {
			queuedTransferCard = v;
		},
		get lastTransferWindow() {
			return lastTransferWindow;
		},
		set lastTransferWindow(v: TransferWindowState | null) {
			lastTransferWindow = v;
		},
		adjustBalance,
		addToDeck,
		addDeckCards,
		removeDeckCards,
		multiplyWage,
		peekDeck,
		drawFromDeck,
		returnToDeck,
		addGoals,
		recordAppearance,
		addXp,
		addSeasonCards,
		recordMatchXp,
		recordMatchOutcomes,
		archiveCurrentStats
	};
}

export const player = createPlayer();
