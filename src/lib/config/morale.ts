export const MORALE_CONFIG = {
	scale: { min: 1, max: 10, start: 5 },

	deltas: {
		win: 1,
		draw: 0,
		loss: -1
	},

	adjustMorale(current: number, delta: number): number {
		const clamped = Math.max(
			MORALE_CONFIG.scale.min,
			Math.min(MORALE_CONFIG.scale.max, current + delta)
		);
		return clamped;
	}
};

export type MoraleConfig = typeof MORALE_CONFIG;
