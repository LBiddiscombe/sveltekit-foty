function poisson(lambda: number): number {
	const L = Math.exp(-lambda);
	let k = 0;
	let p = 1;
	do {
		k++;
		p *= Math.random();
	} while (p > L);
	return k - 1;
}

export const MORALE_CONFIG = {
	scale: { min: 1, max: 10, start: 5 },

	deltas: {
		win: 1,
		draw: 0,
		loss: -1,
		twoGoalBonus: 2
	},

	teamSimGoals(morale: number): number {
		const lambda = 0.8 + morale * 0.1;
		return poisson(lambda);
	},

	opponentGoals(morale: number): number {
		const lambda = 0.3 + (MORALE_CONFIG.scale.max - morale) * 0.1;
		return poisson(lambda);
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
