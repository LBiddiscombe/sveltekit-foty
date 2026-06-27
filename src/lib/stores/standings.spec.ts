import { describe, it, expect, beforeEach } from 'vitest';
import { standings } from './standings.svelte';

const CLUBS = ['Exetur', 'Barnett', 'Croo', 'Gillingham'];

beforeEach(() => {
	standings.init(CLUBS);
});

describe('processWeekResults', () => {
	it('updates standings after first week', () => {
		standings.processWeekResults(
			[
				{ home: 'Exetur', away: 'Barnett', result: { homeGoals: 2, awayGoals: 1 } },
				{ home: 'Croo', away: 'Gillingham', result: { homeGoals: 0, awayGoals: 0 } }
			],
			1
		);

		const exetur = standings.getByClub('Exetur');
		expect(exetur?.played).toBe(1);
		expect(exetur?.points).toBe(3);
		expect(exetur?.goalsFor).toBe(2);

		expect(standings.lastProcessedWeek).toBe(1);
	});

	it('processes second week results on top of first', () => {
		standings.processWeekResults(
			[
				{ home: 'Barnett', away: 'Croo', result: { homeGoals: 1, awayGoals: 1 } },
				{ home: 'Exetur', away: 'Gillingham', result: { homeGoals: 3, awayGoals: 0 } }
			],
			1
		);

		standings.processWeekResults(
			[
				{ home: 'Exetur', away: 'Croo', result: { homeGoals: 2, awayGoals: 0 } },
				{ home: 'Barnett', away: 'Gillingham', result: { homeGoals: 0, awayGoals: 1 } }
			],
			2
		);

		const exetur = standings.getByClub('Exetur');
		expect(exetur?.played).toBe(2);
		expect(exetur?.points).toBe(6);
		expect(exetur?.goalsFor).toBe(5);

		expect(standings.lastProcessedWeek).toBe(2);
	});

	it('uses week-tracking guard instead of played check (THE FIX)', () => {
		// Week 1: guard passes (week 1 > 0)
		expect(standings.lastProcessedWeek).toBe(0);
		standings.processWeekResults(
			[{ home: 'Exetur', away: 'Barnett', result: { homeGoals: 2, awayGoals: 1 } }],
			1
		);

		expect(standings.lastProcessedWeek).toBe(1);
		expect(standings.getByClub('Exetur')?.played).toBe(1);
		expect(standings.getByClub('Exetur')?.points).toBe(3);

		// Week 2: guard passes (week 2 > 1)
		standings.processWeekResults(
			[{ home: 'Exetur', away: 'Croo', result: { homeGoals: 3, awayGoals: 0 } }],
			2
		);

		expect(standings.lastProcessedWeek).toBe(2);
		const exetur = standings.getByClub('Exetur');
		expect(exetur?.played).toBe(2);
		expect(exetur?.points).toBe(6);
	});
});
