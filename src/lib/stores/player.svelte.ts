import type { PlayerStats } from '$lib/types/game';

function randomDeck(size: number): number[] {
	return Array.from({ length: size }, () => Math.floor(Math.random() * 3) + 1);
}

function createPlayer() {
	let name = $state('');
	let age = $state(17);
	const stats = $state<PlayerStats>({ power: 5, accuracy: 5, technique: 5, athleticism: 5 });
	let trainingFocus = $state<keyof PlayerStats>('power');
	let wage = $state(0);
	let bankBalance = $state(5000);
	let goals = $state(0);
	let appearances = $state(0);
	let club = $state('Free Agent');
	let division = $state(4);
	let deck = $state<number[]>(randomDeck(10));

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
		get stats() {
			return stats;
		},
		get trainingFocus() {
			return trainingFocus;
		},
		set trainingFocus(v: keyof PlayerStats) {
			trainingFocus = v;
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
		}
	};
}

export const player = createPlayer();
