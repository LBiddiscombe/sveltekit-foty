import { clamp } from '$lib/utils';

export const MORALE_CONFIG = {
	scale: { min: 1, max: 10, start: 5 },

	deltas: {
		win: 1,
		draw: 0,
		loss: -1
	},

	adjustMorale(current: number, delta: number): number {
		return clamp(current + delta, MORALE_CONFIG.scale.min, MORALE_CONFIG.scale.max);
	}
};

export type MoraleConfig = typeof MORALE_CONFIG;
