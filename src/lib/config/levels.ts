import type { Level } from '$lib/types/game';

export const LEVELS: Level[] = [
	{ title: 'Park Kicker', minXp: 0, division: 4 },
	{ title: 'Sunday Leaguer', minXp: 34, division: 4 },
	{ title: 'Trialist', minXp: 67, division: 4 },
	{ title: 'Prospect', minXp: 100, division: 3 },
	{ title: 'Reserve', minXp: 134, division: 3 },
	{ title: 'Fringe Player', minXp: 167, division: 3 },
	{ title: 'Squad Player', minXp: 200, division: 2 },
	{ title: 'First Team Regular', minXp: 250, division: 2 },
	{ title: 'Star Player', minXp: 300, division: 2 },
	{ title: 'International', minXp: 350, division: 1 },
	{ title: 'World Class', minXp: 420, division: 1 },
	{ title: 'Footballer of the Year', minXp: 490, division: 1 }
] as const;

export const DIVISION_XP_CAPS = {
	4: 100,
	3: 200,
	2: 350,
	1: 500
} as const;

export const DIVISION_INTEREST_THRESHOLDS = {
	4: 30,
	3: 80,
	2: 170,
	1: 300
} as const;

export function getLevel(xp: number): Level {
	let current = LEVELS[0];
	for (const level of LEVELS) {
		if (xp >= level.minXp) {
			current = level;
		}
	}
	return current;
}

export function getLevelIndex(xp: number): number {
	let idx = 0;
	for (let i = 0; i < LEVELS.length; i++) {
		if (xp >= LEVELS[i].minXp) {
			idx = i;
		}
	}
	return idx;
}

export function getNextLevelXp(xp: number): number | null {
	const idx = getLevelIndex(xp);
	if (idx >= LEVELS.length - 1) return null;
	return LEVELS[idx + 1].minXp;
}

export const LEVEL_UP_MESSAGES: Record<number, string> = {
	1: 'You\'re now a Sunday Leaguer. Your wage is now £{wage} a week.',
	2: 'Trialist status unlocked. Wage bumped to £{wage}.',
	3: 'Prospect — Division 3 awaits. Your wage rises to £{wage}.',
	4: 'Reserve grade. The club rates you at £{wage} a week now.',
	5: 'Fringe Player. First team getting closer — wage up to £{wage}.',
	6: 'Squad Player in Division 2. Your wage is now £{wage}.',
	7: 'First Team Regular. Consistent starts, £{wage} a week to match.',
	8: 'Star Player. Top-tier performances, £{wage} a week.',
	9: 'International calibre. Your wage is now £{wage}.',
	10: 'World Class. Only one level left — earning £{wage}.',
	11: 'Footballer of the Year. The pinnacle. £{wage} a week.'
};
