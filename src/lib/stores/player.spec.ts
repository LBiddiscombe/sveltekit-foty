import { describe, it, expect, beforeEach } from 'vitest';
import { player } from './player.svelte';

describe('player store', () => {
	beforeEach(() => {
		player.name = '';
		player.age = 17;
		player.bankBalance = 5000;
		player.goals = 0;
		player.appearances = 0;
	});

	it('recordAppearance increments appearances', () => {
		player.recordAppearance();
		expect(player.appearances).toBe(1);
		player.recordAppearance();
		expect(player.appearances).toBe(2);
	});

	it('addGoals increments goals', () => {
		player.addGoals(3);
		expect(player.goals).toBe(3);
		player.addGoals(2);
		expect(player.goals).toBe(5);
	});

	it('addGoals with 0 does not change goals', () => {
		player.addGoals(0);
		expect(player.goals).toBe(0);
	});

	it('appearance is recorded regardless of goals scored', () => {
		player.recordAppearance();
		player.addGoals(0);
		expect(player.appearances).toBe(1);
		expect(player.goals).toBe(0);
	});

	it('adjustBalance adds to bank balance', () => {
		player.adjustBalance(100);
		expect(player.bankBalance).toBe(5100);
	});

	it('adjustBalance subtracts from bank balance', () => {
		player.adjustBalance(-200);
		expect(player.bankBalance).toBe(4800);
	});
});
