export const XP_CONFIG = {
	played: 5,
	goal: 5,
	saved: 0,
	miss: -5,
	offTarget: -5,
	skipped: 0,
	win: 5,
	draw: 2,
	loss: 0,
	promotion: 50
} as const;

export type XpConfig = typeof XP_CONFIG;
