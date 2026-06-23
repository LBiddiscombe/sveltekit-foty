import { describe, it, expect } from 'vitest';
import { generatePlayerFixtures } from './fixtures';
import { getClubsByDivision } from './clubs';

describe('generatePlayerFixtures', () => {
	const div4Clubs = getClubsByDivision(4).map((c) => c.name);
	const playerClub = 'Exetur';
	const fixtures = generatePlayerFixtures(playerClub, div4Clubs);

	it('returns exactly 46 fixtures', () => {
		expect(fixtures).toHaveLength(46);
	});

	it('spans exactly 30 weeks', () => {
		const weeks = new Set(fixtures.map((f) => f.weekNumber));
		expect(weeks.size).toBe(30);
		expect(Math.min(...weeks)).toBe(1);
		expect(Math.max(...weeks)).toBe(30);
	});

	it('has 16 double-game weeks and 14 single-game weeks', () => {
		const gameCount = new Map<number, number>();
		for (const f of fixtures) {
			gameCount.set(f.weekNumber, (gameCount.get(f.weekNumber) ?? 0) + 1);
		}
		const doubleGameWeeks = [...gameCount.values()].filter((c) => c === 2).length;
		const singleGameWeeks = [...gameCount.values()].filter((c) => c === 1).length;
		expect(doubleGameWeeks).toBe(16);
		expect(singleGameWeeks).toBe(14);
	});

	it('does not include the player club as an opponent', () => {
		for (const f of fixtures) {
			expect(f.opponent).not.toBe(playerClub);
		}
	});

	it('plays each opponent exactly twice', () => {
		const opponentCount = new Map<string, number>();
		for (const f of fixtures) {
			opponentCount.set(f.opponent, (opponentCount.get(f.opponent) ?? 0) + 1);
		}
		for (const [opponent, count] of opponentCount) {
			expect(count, `${opponent} should appear twice`).toBe(2);
		}
	});

	it('plays one home and one away against each opponent', () => {
		const opponentHome = new Map<string, boolean[]>();
		for (const f of fixtures) {
			const venues = opponentHome.get(f.opponent) ?? [];
			venues.push(f.isHome);
			opponentHome.set(f.opponent, venues);
		}
		for (const [opponent, venues] of opponentHome) {
			expect(venues.filter(Boolean), `${opponent} should have 1 home`).toHaveLength(1);
			expect(
				venues.filter((v) => !v),
				`${opponent} should have 1 away`
			).toHaveLength(1);
		}
	});

	it('includes all division clubs as opponents', () => {
		const opponents = new Set(fixtures.map((f) => f.opponent));
		const expected = div4Clubs.filter((c) => c !== playerClub);
		for (const club of expected) {
			expect(opponents.has(club)).toBe(true);
		}
	});

	it('assigns correct week numbers to all fixtures', () => {
		for (const f of fixtures) {
			expect(f.weekNumber).toBeGreaterThanOrEqual(1);
			expect(f.weekNumber).toBeLessThanOrEqual(30);
		}
	});

	it('produces different fixture lists for different players', () => {
		const otherFixtures = generatePlayerFixtures('Croo', div4Clubs);
		const firstOpponents = fixtures.map((f) => f.opponent).join(',');
		const secondOpponents = otherFixtures.map((f) => f.opponent).join(',');
		expect(firstOpponents).not.toBe(secondOpponents);
	});

	it('all fixtures have no result initially', () => {
		for (const f of fixtures) {
			expect(f.result).toBeUndefined();
		}
	});
});
