import { describe, it, expect } from 'vitest';
import { ALL_CLUBS } from './clubs';
import { generateAllCupBrackets, simulateCupRound } from './cups';
import type { CupBracket } from '$lib/types/game';

const DIV_CLUBS: Record<number, Set<string>> = {};
for (let d = 1; d <= 4; d++) {
	DIV_CLUBS[d] = new Set(ALL_CLUBS.filter((c) => c.division === d).map((c) => c.name));
}

function simulateFullCup(): CupBracket {
	const { leagueCup } = generateAllCupBrackets();
	let bracket = leagueCup;
	for (let r = 0; r < bracket.rounds.length; r++) {
		bracket = simulateCupRound(bracket);
		if (bracket.winner) break;
	}
	return bracket;
}

function getAliveTeamsAtRound(bracket: CupBracket, roundNumber: number): string[] {
	const alive = new Set(bracket.rounds[0].ties.flatMap((t) => [t.home, t.away]));
	for (const [club, elimRound] of Object.entries(bracket.eliminated)) {
		if (elimRound <= roundNumber) alive.delete(club);
	}
	return [...alive];
}

function winnerDivision(winner: string | undefined): number {
	if (!winner) return 0;
	const club = ALL_CLUBS.find((c) => c.name === winner);
	return club?.division ?? 0;
}

const ITER = 5000;

// Skip in normal test runs. Run with: change `skip` to `only` temporarily
// or: npx vitest run src/lib/cups-distribution.spec.ts --project server
describe.skip('Cup winner distribution', () => {
	it('should show division of winner for league cup', () => {
		const winsByDiv: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
		const r2ByDiv: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [] };

		for (let i = 0; i < ITER; i++) {
			const b = simulateFullCup();
			const div = winnerDivision(b.winner);
			winsByDiv[div]++;

			for (let d = 1; d <= 4; d++) {
				r2ByDiv[d].push(getAliveTeamsAtRound(b, 2).filter((c) => DIV_CLUBS[d].has(c)).length);
			}
		}

		const total = ITER;
		console.log(`\n=== League Cup Winner Distribution (${ITER} iters, post-fix) ===`);
		for (let d = 1; d <= 4; d++) {
			const pct = ((winsByDiv[d] / total) * 100).toFixed(1);
			const avg = (r2ByDiv[d].reduce((a, b) => a + b, 0) / r2ByDiv[d].length).toFixed(1);
			const clubCount = d === 0 ? 36 : ALL_CLUBS.filter((c) => c.division === d).length;
			console.log(
				`  Div ${d} (${clubCount} clubs): ${winsByDiv[d]} wins (${pct}%)  —  avg ${avg}/${clubCount} alive at R2`
			);
		}

		// With division multiplier fix (2.0/1.2/1.0/0.8), Div 1 should dominate
		expect(winsByDiv[1] / total).toBeGreaterThan(0.85);
		// Extreme scenario (≤5 Div1 at R2) should be very rare
		const extreme = r2ByDiv[1].filter((n) => n <= 5).length / r2ByDiv[1].length;
		expect(extreme).toBeLessThan(0.005);

		console.log(`\nReal-world benchmarks:`);
		console.log(`  League Cup winners outside top flight since 1980: ~2%`);
		console.log(`  FA Cup winners outside top flight last 100yrs: ~4%`);
	});
});
