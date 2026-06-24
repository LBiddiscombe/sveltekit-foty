import { wageForLevel } from '$lib/config/economy';
import { getLevel, getLevelIndex, LEVEL_UP_MESSAGES } from '$lib/config/levels';
import { inbox } from './inbox.svelte';

function randomDeck(size: number): number[] {
	return Array.from({ length: size }, () => Math.floor(Math.random() * 3) + 1);
}

function createPlayer() {
	let name = $state('');
	let age = $state(17);
	let wage = $state(wageForLevel(getLevelIndex(0)));
	let bankBalance = $state(5000);
	let goals = $state(0);
	let appearances = $state(0);
	let club = $state('Free Agent');
	let division = $state(4);
	let deck = $state<number[]>(randomDeck(10));
	let careerXp = $state(0);
	let matchXpHistory = $state<number[]>([]);

	function adjustBalance(delta: number) {
		bankBalance += delta;
	}

	function addToDeck(card: number) {
		deck.push(card);
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
			const nextId = Math.max(0, ...inbox.items.map((i) => i.id)) + 1;
			inbox.items = [
				...inbox.items,
				{
					id: nextId,
					type: 'news',
					subject: `Level Up: ${getLevel(careerXp).title}`,
					body: LEVEL_UP_MESSAGES[newLevel].replace('{wage}', String(wage)),
					actionRequired: false,
					actioned: false
				}
			];
		}
	}

	function addSeasonCards() {
		deck.push(...randomDeck(10));
	}

	function recordMatchXp(xp: number) {
		matchXpHistory = [...matchXpHistory.slice(-4), xp];
	}

	return {
		get name() {
			return name;
		},
		set name(v: string) {
			name = v;
		},
		get age() {
			return age;
		},
		set age(v: number) {
			age = v;
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
		adjustBalance,
		addToDeck,
		peekDeck,
		drawFromDeck,
		returnToDeck,
		addGoals,
		recordAppearance,
		addXp,
		addSeasonCards,
		recordMatchXp
	};
}

export const player = createPlayer();
