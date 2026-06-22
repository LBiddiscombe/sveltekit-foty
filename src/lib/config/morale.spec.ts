import { describe, it, expect, vi } from 'vitest';
import { MORALE_CONFIG } from './morale';

function mulberry32(seed: number): () => number {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

describe('MORALE_CONFIG', () => {
	it('has correct scale bounds', () => {
		expect(MORALE_CONFIG.scale).toEqual({ min: 1, max: 10, start: 5 });
	});

	it('has correct deltas', () => {
		expect(MORALE_CONFIG.deltas).toEqual({
			win: 1,
			draw: 0,
			loss: -1,
			twoGoalBonus: 2
		});
	});

	describe('adjustMorale', () => {
		it('adds positive deltas', () => {
			expect(MORALE_CONFIG.adjustMorale(5, 1)).toBe(6);
		});

		it('subtracts negative deltas', () => {
			expect(MORALE_CONFIG.adjustMorale(5, -1)).toBe(4);
		});

		it('clamps to min', () => {
			expect(MORALE_CONFIG.adjustMorale(1, -1)).toBe(1);
			expect(MORALE_CONFIG.adjustMorale(2, -5)).toBe(1);
		});

		it('clamps to max', () => {
			expect(MORALE_CONFIG.adjustMorale(10, 1)).toBe(10);
			expect(MORALE_CONFIG.adjustMorale(8, 5)).toBe(10);
		});

		it('handles zero delta', () => {
			expect(MORALE_CONFIG.adjustMorale(5, 0)).toBe(5);
		});

		it('handles start morale', () => {
			expect(MORALE_CONFIG.adjustMorale(MORALE_CONFIG.scale.start, 0)).toBe(5);
		});
	});

	describe('teamSimGoals', () => {
		it('returns a non-negative integer', () => {
			const rng = mulberry32(42);
			vi.spyOn(Math, 'random').mockImplementation(rng);
			const result = MORALE_CONFIG.teamSimGoals(5);
			expect(Number.isInteger(result)).toBe(true);
			expect(result).toBeGreaterThanOrEqual(0);
		});

		it('produces deterministic output with seeded random', () => {
			const rng1 = mulberry32(99);
			const rng2 = mulberry32(99);
			vi.spyOn(Math, 'random').mockImplementation(rng1);
			const a = MORALE_CONFIG.teamSimGoals(5);
			vi.spyOn(Math, 'random').mockImplementation(rng2);
			const b = MORALE_CONFIG.teamSimGoals(5);
			expect(a).toBe(b);
		});

		it('varies with morale level', () => {
			const rng = mulberry32(7);
			vi.spyOn(Math, 'random').mockImplementation(rng);
			const low = MORALE_CONFIG.teamSimGoals(1);
			const high = MORALE_CONFIG.teamSimGoals(10);
			expect(high).toBeGreaterThanOrEqual(low);
		});
	});

	describe('opponentGoals', () => {
		it('returns a non-negative integer', () => {
			const rng = mulberry32(42);
			vi.spyOn(Math, 'random').mockImplementation(rng);
			const result = MORALE_CONFIG.opponentGoals(5);
			expect(Number.isInteger(result)).toBe(true);
			expect(result).toBeGreaterThanOrEqual(0);
		});

		it('produces deterministic output with seeded random', () => {
			const rng1 = mulberry32(77);
			const rng2 = mulberry32(77);
			vi.spyOn(Math, 'random').mockImplementation(rng1);
			const a = MORALE_CONFIG.opponentGoals(5);
			vi.spyOn(Math, 'random').mockImplementation(rng2);
			const b = MORALE_CONFIG.opponentGoals(5);
			expect(a).toBe(b);
		});

		it('decreases with higher morale', () => {
			const rng = mulberry32(13);
			vi.spyOn(Math, 'random').mockImplementation(rng);
			const low = MORALE_CONFIG.opponentGoals(1);
			const high = MORALE_CONFIG.opponentGoals(10);
			expect(high).toBeLessThanOrEqual(low);
		});
	});
});
