import { describe, it, expect, vi } from 'vitest';
import {
	playGame,
	skipGame,
	getMoraleDelta,
	consumeDeck,
	START_MORALE,
	simulateMatch,
	AI_DRAW_BREAKER
} from './engine';
import type { Outcome } from '$lib/types/game';

describe('playGame', () => {
	it('returns a MatchResult with played=true', () => {
		const result = playGame(3, 5, ['goal', 'miss', 'goal'], 'Gillingham', 'Gillingham');
		expect(result.played).toBe(true);
		expect(result.chances).toBe(3);
	});

	it('counts player goals from outcomes', () => {
		const result = playGame(3, 5, ['goal', 'goal', 'miss'], 'Gillingham', 'Gillingham');
		expect(result.outcomes.filter((o) => o === 'goal').length).toBe(2);
	});

	it('preserves outcome order', () => {
		const outcomes = ['goal', 'saved', 'miss', 'goal', 'miss'] as const;
		const result = playGame(5, 5, [...outcomes], 'Gillingham', 'Gillingham');
		expect(result.outcomes).toEqual(['goal', 'saved', 'miss', 'goal', 'miss']);
	});

	it('returns a copy of outcomes array', () => {
		const outcomes: Outcome[] = ['goal', 'miss'];
		const result = playGame(2, 5, outcomes, 'Gillingham', 'Gillingham');
		outcomes.push('goal');
		expect(result.outcomes).toEqual(['goal', 'miss']);
	});

	it('produces a score tuple with two numbers', () => {
		const result = playGame(3, 5, ['goal', 'miss', 'goal'], 'Gillingham', 'Gillingham');
		expect(Array.isArray(result.score)).toBe(true);
		expect(result.score).toHaveLength(2);
		expect(typeof result.score[0]).toBe('number');
		expect(typeof result.score[1]).toBe('number');
	});

	it('gives rating 8 for 2+ player goals', () => {
		const result = playGame(3, 5, ['goal', 'goal', 'miss'], 'Gillingham', 'Gillingham');
		expect(result.rating).toBe(8);
	});

	it('gives rating 7 for 1 player goal', () => {
		const result = playGame(3, 5, ['goal', 'miss', 'miss'], 'Gillingham', 'Gillingham');
		expect(result.rating).toBe(7);
	});

	it('gives rating 5 for 0 player goals', () => {
		const result = playGame(3, 5, ['miss', 'saved', 'miss'], 'Gillingham', 'Gillingham');
		expect(result.rating).toBe(5);
	});

	it('handles empty outcomes', () => {
		const result = playGame(0, 5, [], 'Gillingham', 'Gillingham');
		expect(result.chances).toBe(0);
		expect(result.outcomes).toEqual([]);
		expect(result.score[0]).toBeGreaterThanOrEqual(0);
		expect(result.score[1]).toBeGreaterThanOrEqual(0);
		expect(result.rating).toBe(5);
	});
});

describe('skipGame', () => {
	it('returns a MatchResult with played=false', () => {
		const result = skipGame(3, 5, 'Gillingham', 'Gillingham');
		expect(result.played).toBe(false);
	});

	it('returns empty outcomes (no chances taken)', () => {
		const result = skipGame(4, 5, 'Gillingham', 'Gillingham');
		expect(result.outcomes).toEqual([]);
	});

	it('has rating 4', () => {
		const result = skipGame(2, 5, 'Gillingham', 'Gillingham');
		expect(result.rating).toBe(4);
	});

	it('produces a score tuple', () => {
		const result = skipGame(3, 5, 'Gillingham', 'Gillingham');
		expect(result.score).toHaveLength(2);
		expect(typeof result.score[0]).toBe('number');
		expect(typeof result.score[1]).toBe('number');
	});

	it('handles zero chances', () => {
		const result = skipGame(0, 5, 'Gillingham', 'Gillingham');
		expect(result.chances).toBe(0);
		expect(result.outcomes).toEqual([]);
	});
});

describe('getMoraleDelta', () => {
	it('returns 1 for a win', () => {
		expect(getMoraleDelta([3, 1])).toBe(1);
	});

	it('returns 0 for a draw', () => {
		expect(getMoraleDelta([2, 2])).toBe(0);
	});

	it('returns -1 for a loss', () => {
		expect(getMoraleDelta([0, 2])).toBe(-1);
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

describe('AI_DRAW_BREAKER', () => {
	it('is 0.35', () => {
		expect(AI_DRAW_BREAKER).toBe(0.35);
	});
});

describe('simulateMatch', () => {
	it('returns homeGoals and awayGoals', () => {
		const result = simulateMatch(5, 5);
		expect(typeof result.homeGoals).toBe('number');
		expect(typeof result.awayGoals).toBe('number');
	});

	it('nudges 35% of draws to a home win', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		const result = simulateMatch(5, 5);
		expect(result.homeGoals).toBeGreaterThan(result.awayGoals);
		vi.restoreAllMocks();
	});
});
