export const XP_CONFIG = {
	played: 1,
	goal: 1,
	saved: 0,
	miss: -1,
	skipped: 0,
	promotion: 10
} as const;

export type XpConfig = typeof XP_CONFIG;
