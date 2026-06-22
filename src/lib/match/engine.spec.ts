import { describe, it, expect, vi } from 'vitest';
import { playGame, skipGame, getMoraleDelta, consumeDeck, START_MORALE } from './engine';
import type { MatchResult, Outcome } from '$lib/types/game';

describe('playGame', () => {
	it('returns a MatchResult with played=true', () => {
		const result = playGame(3, 5, ['goal', 'miss', 'goal']);
		expect(result.played).toBe(true);
		expect(result.chances).toBe(3);
	});

	it('counts player goals from outcomes', () => {
		const result = playGame(3, 5, ['goal', 'goal', 'miss']);
		expect(result.outcomes.filter((o) => o === 'goal').length).toBe(2);
	});

	it('preserves outcome order', () => {
		const outcomes = ['goal', 'saved', 'miss', 'goal', 'off-target'] as const;
		const result = playGame(5, 5, [...outcomes]);
		expect(result.outcomes).toEqual(['goal', 'saved', 'miss', 'goal', 'off-target']);
	});

	it('returns a copy of outcomes array', () => {
		const outcomes: Outcome[] = ['goal', 'miss'];
		const result = playGame(2, 5, outcomes);
		outcomes.push('goal');
		expect(result.outcomes).toEqual(['goal', 'miss']);
	});

	it('produces a score tuple with two numbers', () => {
		const result = playGame(3, 5, ['goal', 'miss', 'goal']);
		expect(Array.isArray(result.score)).toBe(true);
		expect(result.score).toHaveLength(2);
		expect(typeof result.score[0]).toBe('number');
		expect(typeof result.score[1]).toBe('number');
	});

	it('gives rating 8 for 2+ player goals', () => {
		const result = playGame(3, 5, ['goal', 'goal', 'miss']);
		expect(result.rating).toBe(8);
	});

	it('gives rating 7 for 1 player goal', () => {
		const result = playGame(3, 5, ['goal', 'miss', 'miss']);
		expect(result.rating).toBe(7);
	});

	it('gives rating 5 for 0 player goals', () => {
		const result = playGame(3, 5, ['miss', 'saved', 'off-target']);
		expect(result.rating).toBe(5);
	});

	it('handles empty outcomes', () => {
		const result = playGame(0, 5, []);
		expect(result.chances).toBe(0);
		expect(result.outcomes).toEqual([]);
		expect(result.score[0]).toBeGreaterThanOrEqual(0);
		expect(result.score[1]).toBeGreaterThanOrEqual(0);
		expect(result.rating).toBe(5);
	});
});

describe('skipGame', () => {
	it('returns a MatchResult with played=false', () => {
		const result = skipGame(3, 5);
		expect(result.played).toBe(false);
	});

	it('fills all outcomes as miss', () => {
		const result = skipGame(4, 5);
		expect(result.outcomes).toEqual(['miss', 'miss', 'miss', 'miss']);
	});

	it('has rating 4', () => {
		const result = skipGame(2, 5);
		expect(result.rating).toBe(4);
	});

	it('produces a score tuple', () => {
		const result = skipGame(3, 5);
		expect(result.score).toHaveLength(2);
		expect(typeof result.score[0]).toBe('number');
		expect(typeof result.score[1]).toBe('number');
	});

	it('handles zero chances', () => {
		const result = skipGame(0, 5);
		expect(result.chances).toBe(0);
		expect(result.outcomes).toEqual([]);
	});
});

describe('getMoraleDelta', () => {
	it('returns positive delta for a win', () => {
		const delta = getMoraleDelta([3, 1], 2);
		expect(delta).toBeGreaterThan(0);
	});

	it('returns zero delta for a draw', () => {
		const delta = getMoraleDelta([2, 2], 1);
		expect(delta).toBe(0);
	});

	it('returns negative delta for a loss', () => {
		const delta = getMoraleDelta([0, 2], 0);
		expect(delta).toBeLessThan(0);
	});

	it('applies two-goal bonus when player scores 2+ goals', () => {
		const base = getMoraleDelta([3, 1], 1);
		const bonus = getMoraleDelta([3, 1], 2);
		expect(bonus).toBeGreaterThan(base);
	});

	it('applies two-goal bonus even on a loss when player scores 2+ goals', () => {
		const delta = getMoraleDelta([1, 3], 2);
		expect(delta).toBeGreaterThan(0);
	});
});

describe('consumeDeck', () => {
	it('removes the first card when not skipped', () => {
		const deck = [3, 1, 2];
		consumeDeck(deck, false);
		expect(deck).toEqual([1, 2]);
	});

	it('moves first card to back when skipped', () => {
		const deck = [3, 1, 2];
		consumeDeck(deck, true);
		expect(deck).toEqual([1, 2, 3]);
	});

	it('does nothing on empty deck', () => {
		const deck: number[] = [];
		consumeDeck(deck, false);
		expect(deck).toEqual([]);
	});

	it('does nothing on empty deck when skipped', () => {
		const deck: number[] = [];
		consumeDeck(deck, true);
		expect(deck).toEqual([]);
	});
});

describe('START_MORALE', () => {
	it('is a number', () => {
		expect(typeof START_MORALE).toBe('number');
	});
});
