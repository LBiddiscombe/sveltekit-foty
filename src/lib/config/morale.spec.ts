import { describe, it, expect } from 'vitest';
import { MORALE_CONFIG } from './morale';

describe('MORALE_CONFIG', () => {
	it('has correct scale bounds', () => {
		expect(MORALE_CONFIG.scale).toEqual({ min: 1, max: 10, start: 5 });
	});

	it('has correct deltas', () => {
		expect(MORALE_CONFIG.deltas).toEqual({
			win: 1,
			draw: 0,
			loss: -1
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
});
