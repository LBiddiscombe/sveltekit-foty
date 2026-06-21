export const MORALE_CONFIG = {
	scale: { min: 1, max: 10, start: 5 },

	deltas: {
		win: 1,
		draw: 0,
		loss: -1,
		twoGoalBonus: 2
	},

	effect: {
		goalsPerMoralePoint: 0.2,
		skipBaseGoals: 0.5
	},

	opponentGoals(morale: number): number {
		return Math.max(0, Math.round(MORALE_CONFIG.scale.max - morale) * 0.25);
	},

	playerSimGoals(morale: number): number {
		const raw =
			(morale - 4) * MORALE_CONFIG.effect.goalsPerMoralePoint + MORALE_CONFIG.effect.skipBaseGoals;
		return Math.max(0, Math.round(raw));
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
