import { describe, it, expect, vi } from 'vitest';
import { generateDivisionSchedule } from '$lib/config/schedule';
import { standings } from '$lib/stores/standings.svelte';
import { MORALE_CONFIG } from '$lib/config/morale';
import { getClubsByDivision } from '$lib/config/clubs';

function mulberry32(seed: number): () => number {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function makePoisson(lambda: number): number {
	const L = Math.exp(-lambda);
	let k = 0;
	let p = 1;
	do {
		k++;
		p *= Math.random();
	} while (p > L);
	return k - 1;
}

const CLUB_STRENGTHS: Record<string, number> = {
	'Man Citeh': 10,
	'Man Untied': 9,
	Liverpoool: 9,
	Chelsee: 8,
	Arsenul: 8,
	Spurs: 8,
	Viller: 7,
	Newcassel: 7,
	Forrist: 7,
	Bryton: 6,
	Lestur: 6,
	Rexham: 6,
	'West Ham': 6,
	Boro: 5,
	Woolvz: 5,
	Saynts: 5,
	'West Brom': 5,
	Blackbirn: 5,
	'Sheff Yoonited': 5,
	York: 5,
	Bornmuth: 5,
	Brentfurd: 5,
	Coventry: 5,
	Pallace: 5,
	Evarton: 5,
	Fullum: 5,
	Hull: 5,
	Ipswitch: 5,
	Leeds: 5,
	Sunderlun: 5,
	Norrich: 5,
	'Cue Pee Arr': 5,
	Stoak: 5,
	'Bristol City': 5,
	Swanzee: 5,
	Wattfud: 5,
	Cardif: 5,
	'Sheff Wensday': 5,
	Wickham: 5,
	Birmingum: 4,
	Burnlee: 4,
	Darbee: 4,
	Millwol: 4,
	Pompee: 4,
	Prestun: 4,
	Boltun: 4,
	Charltun: 4,
	Linkun: 4,
	Chesterfeeld: 4,
	Rotherum: 4,
	Blackpool: 4,
	Huddersfeeld: 4,
	Stockport: 4,
	Wimbledon: 4,
	Peterbura: 4,
	Redding: 4,
	Bradfud: 3,
	Barnslee: 3,
	Burtun: 3,
	Doncaster: 3,
	Oxfud: 3,
	Plimuth: 3,
	Wiggun: 3,
	Looton: 3,
	Mansfeeld: 3,
	'Notts County': 3,
	Orient: 3,
	'Em Kay Dons': 3,
	Stevenij: 3,
	Bromlee: 3,
	Caimbridge: 3,
	'Port Vayle': 3,
	Walsawl: 3,
	Grimzbee: 3,
	Tranmere: 3,
	Shroosbury: 3,
	Northamptun: 3,
	'Bristol Rovers': 3,
	Fleetwud: 3,
	Swindun: 3,
	Salfud: 3,
	Colchestur: 3,
	Oldum: 3,
	Newport: 2,
	Rochdayle: 2,
	Croo: 2,
	Barnett: 2,
	Cheltnum: 2,
	Ackrington: 2,
	Crawlee: 2,
	Exetur: 2,
	Gillingham: 1
};

function strengthOf(club: string): number {
	return CLUB_STRENGTHS[club] ?? 3;
}

type FormulaConfig = {
	name: string;
	teamLambda: (strength: number, morale: number) => number;
	oppLambda: (strength: number, morale: number) => number;
	startMorale?: number;
	/** Array of possible player goal outcomes (picked uniformly) */
	playerGoalDist?: number[];
	/** Base lambda for AI-vs-AI matches (default 0.3) */
	aiBase?: number;
};

function simAi(homeStrength: number, awayStrength: number, base = 0.3) {
	return {
		homeGoals: makePoisson(base + homeStrength * 0.1),
		awayGoals: makePoisson(base + awayStrength * 0.1)
	};
}

const FORMULAS: FormulaConfig[] = [
	{
		name: 'baseline',
		teamLambda: (s, m) => 0.3 + s * 0.1 + m * 0.05,
		oppLambda: (s, m) => 0.3 + s * 0.1 - m * 0.05
	},
	{
		name: 'm0.02-team-only',
		teamLambda: (s, m) => 0.3 + s * 0.1 + m * 0.02,
		oppLambda: (_s, _m) => 0.3 + _s * 0.1
	},
	{
		name: 'm0.015-team-only',
		teamLambda: (s, m) => 0.3 + s * 0.1 + m * 0.015,
		oppLambda: (_s, _m) => 0.3 + _s * 0.1
	},
	{
		name: 'm0.01-team-only',
		teamLambda: (s, m) => 0.3 + s * 0.1 + m * 0.01,
		oppLambda: (_s, _m) => 0.3 + _s * 0.1
	},
	{
		name: 'm0.02-team-start3',
		teamLambda: (s, m) => 0.3 + s * 0.1 + m * 0.02,
		oppLambda: (_s, _m) => 0.3 + _s * 0.1,
		startMorale: 3
	},
	{
		name: 'baseline-start3',
		teamLambda: (s, m) => 0.3 + s * 0.1 + m * 0.05,
		oppLambda: (s, m) => 0.3 + s * 0.1 - m * 0.05,
		startMorale: 3
	},
	{
		name: 'no-morale-player-goals',
		teamLambda: (s, _m) => 0.3 + s * 0.1,
		oppLambda: (s, _m) => 0.3 + s * 0.1
	},
	{
		name: 'no-morale-fewer-goals',
		teamLambda: (s, _m) => 0.3 + s * 0.1,
		oppLambda: (s, _m) => 0.3 + s * 0.1,
		playerGoalDist: [0, 0, 1]
	},
	{
		name: 'no-morale-rare-goals',
		teamLambda: (s, _m) => 0.3 + s * 0.1,
		oppLambda: (s, _m) => 0.3 + s * 0.1,
		playerGoalDist: [0, 0, 0, 1]
	},
	{
		name: 'baseline-fewer-goals',
		teamLambda: (s, m) => 0.3 + s * 0.1 + m * 0.05,
		oppLambda: (s, m) => 0.3 + s * 0.1 - m * 0.05,
		playerGoalDist: [0, 0, 0, 0, 1]
	},
	{
		name: 'lower-base-m0.01-team',
		teamLambda: (s, m) => 0.2 + s * 0.1 + m * 0.01,
		oppLambda: (_s, _m) => 0.2 + _s * 0.1
	},
	{
		name: 'base-0.5-m0.01-team-only',
		teamLambda: (s, m) => 0.5 + s * 0.1 + m * 0.01,
		oppLambda: (_s, _m) => 0.5 + _s * 0.1,
		aiBase: 0.5
	}
];

const SEEDS = [
	42, 99, 7, 13, 888, 1234, 555, 7777, 9001, 2024, 111, 222, 333, 444, 666, 789, 4321, 8888, 9999,
	5555
];

interface SimResult {
	position: number;
	points: number;
	gd: number;
	won: boolean;
	moraleMin: number;
	moraleMax: number;
	goalsFor: number;
	goalsAgainst: number;
	playerGoalsTotal: number;
	drawPct: number;
}

function simulateSeason(seed: number, formula: FormulaConfig): SimResult {
	const rng = mulberry32(seed);
	vi.spyOn(Math, 'random').mockImplementation(rng);

	const clubs = getClubsByDivision(4).map((c) => c.name);
	const schedule = generateDivisionSchedule(4, clubs);
	standings.init(clubs);

	let morale = formula.startMorale ?? 5;
	const moraleVals: number[] = [morale];
	let playerGoalsTotal = 0;
	let totalDraws = 0;
	let totalGames = 0;

	const playerClub = 'Croo';
	const gamesPlayed = 23;

	const playerGames = new Set<string>();
	const allMatches: { week: number; opponent: string }[] = [];
	for (const week of schedule.weeks) {
		for (const m of week.matches) {
			if (m.home === playerClub) allMatches.push({ week: week.weekNumber, opponent: m.away });
			if (m.away === playerClub) allMatches.push({ week: week.weekNumber, opponent: m.home });
		}
	}
	const chosen = [...allMatches].sort(() => Math.random() - 0.5).slice(0, gamesPlayed);
	for (const cm of chosen) {
		playerGames.add(`${cm.week}-${cm.opponent}`);
	}

	for (const week of schedule.weeks) {
		const results: {
			home: string;
			away: string;
			result: { homeGoals: number; awayGoals: number };
		}[] = [];

		for (const m of week.matches) {
			if (m.home === playerClub || m.away === playerClub) {
				const opponent = m.home === playerClub ? m.away : m.home;
				const key = `${week.weekNumber}-${opponent}`;
				const isPlaying = playerGames.has(key);

				const teamGoals = makePoisson(formula.teamLambda(strengthOf(playerClub), morale));
				const oppGoals = makePoisson(formula.oppLambda(strengthOf(opponent), morale));

				let gf: number, ga: number;
				if (isPlaying) {
					const dist = formula.playerGoalDist ?? [0, 0, 0, 1, 1, 2];
					const playerGoals = dist[Math.floor(Math.random() * dist.length)];
					playerGoalsTotal += playerGoals;
					if (m.home === playerClub) {
						gf = teamGoals + playerGoals;
						ga = oppGoals;
					} else {
						gf = oppGoals;
						ga = teamGoals + playerGoals;
					}
					const result = gf > ga ? 'win' : gf === ga ? 'draw' : 'loss';
					morale = MORALE_CONFIG.adjustMorale(morale, MORALE_CONFIG.deltas[result]);
				} else {
					if (m.home === playerClub) {
						gf = teamGoals;
						ga = oppGoals;
					} else {
						gf = oppGoals;
						ga = teamGoals;
					}
					const result = gf > ga ? 'win' : gf === ga ? 'draw' : 'loss';
					morale = MORALE_CONFIG.adjustMorale(morale, MORALE_CONFIG.deltas[result]);
				}

				totalDraws += gf === ga ? 1 : 0;
				totalGames++;
				results.push({ home: m.home, away: m.away, result: { homeGoals: gf, awayGoals: ga } });
			} else {
				const aiResult = simAi(strengthOf(m.home), strengthOf(m.away), formula.aiBase);
				totalDraws += aiResult.homeGoals === aiResult.awayGoals ? 1 : 0;
				totalGames++;
				results.push({ home: m.home, away: m.away, result: aiResult });
			}
		}

		standings.processWeekResults(results, week.weekNumber);
		moraleVals.push(morale);
	}

	const sorted = [...standings.entries].sort((a, b) => {
		if (b.points !== a.points) return b.points - a.points;
		if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
		if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
		return a.club.localeCompare(b.club);
	});

	const crooIdx = sorted.findIndex((s) => s.club === 'Croo');
	const entry = sorted[crooIdx];

	return {
		position: crooIdx + 1,
		points: entry.points,
		gd: entry.goalDifference,
		won: crooIdx === 0,
		moraleMin: Math.min(...moraleVals),
		moraleMax: Math.max(...moraleVals),
		goalsFor: entry.goalsFor,
		goalsAgainst: entry.goalsAgainst,
		playerGoalsTotal,
		drawPct: totalGames > 0 ? totalDraws / totalGames : 0
	};
}

function simulatePureAi(seed: number): { position: number; points: number } {
	const rng = mulberry32(seed);
	vi.spyOn(Math, 'random').mockImplementation(rng);

	const clubs = getClubsByDivision(4).map((c) => c.name);
	const schedule = generateDivisionSchedule(4, clubs);
	standings.init(clubs);

	for (const week of schedule.weeks) {
		const results: {
			home: string;
			away: string;
			result: { homeGoals: number; awayGoals: number };
		}[] = [];
		for (const m of week.matches) {
			results.push({
				home: m.home,
				away: m.away,
				result: simAi(strengthOf(m.home), strengthOf(m.away))
			});
		}
		standings.processWeekResults(results, week.weekNumber);
	}

	const sorted = [...standings.entries].sort((a, b) => {
		if (b.points !== a.points) return b.points - a.points;
		if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
		if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
		return a.club.localeCompare(b.club);
	});

	const crooIdx = sorted.findIndex((s) => s.club === 'Croo');
	return { position: crooIdx + 1, points: sorted[crooIdx].points };
}

// Skip in normal test runs. Run with: change `skip` to `only` temporarily
// or: npx vitest run src/lib/diagnose-balance.spec.ts --project server
describe.skip('formula comparison', () => {
	it('compares all formula variants across 10 seeds', () => {
		const tables: { name: string; results: SimResult[] }[] = [];

		for (const formula of FORMULAS) {
			const results = SEEDS.map((seed) => simulateSeason(seed, formula));
			tables.push({ name: formula.name, results });
		}

		const pureAi = SEEDS.map((seed) => simulatePureAi(seed));
		const pureAiAvgPos = pureAi.reduce((s, r) => s + r.position, 0) / pureAi.length;
		const pureAiAvgPts = pureAi.reduce((s, r) => s + r.points, 0) / pureAi.length;

		for (const table of tables) {
			const r = table.results;
			const wins = r.filter((x) => x.won).length;
			const avgPos = r.reduce((s, x) => s + x.position, 0) / r.length;
			const avgPts = r.reduce((s, x) => s + x.points, 0) / r.length;
			const avgGd = r.reduce((s, x) => s + x.gd, 0) / r.length;
			const avgMoraleMax = r.reduce((s, x) => s + x.moraleMax, 0) / r.length;
			const avgMoraleMin = r.reduce((s, x) => s + x.moraleMin, 0) / r.length;
			const avgPlayerGoals = r.reduce((s, x) => s + x.playerGoalsTotal, 0) / r.length;

			const avgDraw = r.reduce((s, x) => s + x.drawPct, 0) / r.length;
			console.log(`\n── ${table.name} ───────────────────────────────────────`);
			console.log(
				`  Wins:    ${wins}/${SEEDS.length}  (${((wins / SEEDS.length) * 100).toFixed(0)}%)`
			);
			console.log(`  AvgPos:  ${avgPos.toFixed(1)}`);
			console.log(`  AvgPts:  ${avgPts.toFixed(0)}`);
			console.log(`  AvgGD:   ${avgGd.toFixed(0)}`);
			console.log(`  Draws:   ${(avgDraw * 100).toFixed(0)}% of matches`);
			console.log(`  Morale:  ${avgMoraleMin.toFixed(0)} → ${avgMoraleMax.toFixed(0)}`);
			console.log(`  PlayerG: ${avgPlayerGoals.toFixed(0)}/season`);
			console.log(`  ── Per-seed ──`);
			for (let i = 0; i < r.length; i++) {
				const x = r[i];
				const mark = x.won ? '🏆' : '  ';
				console.log(
					`  ${mark} Seed ${String(SEEDS[i]).padStart(4)}: pos=${x.position} pts=${x.points} gd=${x.gd} morale=${x.moraleMin}→${x.moraleMax} pG=${x.playerGoalsTotal}`
				);
			}
		}

		console.log(`\n── pure-ai (no player) ────────────────────────────────`);
		console.log(`  Avg Croo position: ${pureAiAvgPos.toFixed(1)}`);
		console.log(`  Avg Croo points:   ${pureAiAvgPts.toFixed(0)}`);
		console.log(`  ── Per-seed ──`);
		for (let i = 0; i < pureAi.length; i++) {
			console.log(
				`  Seed ${String(SEEDS[i]).padStart(4)}: pos=${pureAi[i].position} pts=${pureAi[i].points}`
			);
		}

		const baselineWins = tables[0].results.filter((x) => x.won).length;
		expect(baselineWins).toBeGreaterThanOrEqual(0);
	});

	function runTwoSeasons(seed: number, formula: FormulaConfig): string {
		const playerClub = 'Croo';
		const rng = mulberry32(seed);
		vi.spyOn(Math, 'random').mockImplementation(rng);

		const div4Clubs = getClubsByDivision(4).map((c) => c.name);
		const div3Clubs = getClubsByDivision(3).map((c) => c.name);

		let schedule = generateDivisionSchedule(4, div4Clubs);
		standings.init(div4Clubs);

		let morale = formula.startMorale ?? 5;
		let playerGoalsTotal = 0;

		const s1games = new Set<string>();
		const allS1: { w: number; o: string }[] = [];
		for (const week of schedule.weeks) {
			for (const m of week.matches) {
				if (m.home === playerClub) allS1.push({ w: week.weekNumber, o: m.away });
				if (m.away === playerClub) allS1.push({ w: week.weekNumber, o: m.home });
			}
		}
		for (const g of [...allS1].sort(() => Math.random() - 0.5).slice(0, 23)) {
			s1games.add(`${g.w}-${g.o}`);
		}

		for (const week of schedule.weeks) {
			const results: {
				home: string;
				away: string;
				result: { homeGoals: number; awayGoals: number };
			}[] = [];
			for (const m of week.matches) {
				if (m.home === playerClub || m.away === playerClub) {
					const opp = m.home === playerClub ? m.away : m.home;
					const key = `${week.weekNumber}-${opp}`;
					const playing = s1games.has(key);
					const tg = makePoisson(formula.teamLambda(strengthOf(playerClub), morale));
					const og = makePoisson(formula.oppLambda(strengthOf(opp), morale));
					let gf: number, ga: number;
					if (playing) {
						const pg = [0, 0, 0, 1, 1, 2][Math.floor(Math.random() * 6)];
						playerGoalsTotal += pg;
						if (m.home === playerClub) {
							gf = tg + pg;
							ga = og;
						} else {
							gf = og;
							ga = tg + pg;
						}
						const r = gf > ga ? 'win' : gf === ga ? 'draw' : 'loss';
						morale = MORALE_CONFIG.adjustMorale(morale, MORALE_CONFIG.deltas[r]);
					} else {
						if (m.home === playerClub) {
							gf = tg;
							ga = og;
						} else {
							gf = og;
							ga = tg;
						}
						morale = MORALE_CONFIG.adjustMorale(
							morale,
							MORALE_CONFIG.deltas[gf > ga ? 'win' : gf === ga ? 'draw' : 'loss']
						);
					}
					results.push({ home: m.home, away: m.away, result: { homeGoals: gf, awayGoals: ga } });
				} else {
					results.push({
						home: m.home,
						away: m.away,
						result: simAi(strengthOf(m.home), strengthOf(m.away), formula.aiBase)
					});
				}
			}
			standings.processWeekResults(results, week.weekNumber);
		}

		const s1Sorted = [...standings.entries].sort(
			(a, b) =>
				b.points - a.points ||
				b.goalDifference - a.goalDifference ||
				b.goalsFor - a.goalsFor ||
				a.club.localeCompare(b.club)
		);
		const s1Idx = s1Sorted.findIndex((s) => s.club === playerClub);
		const s1Pos = s1Idx + 1;
		const promoted = s1Pos <= 3;

		const promotedFromDiv4 = s1Sorted.slice(0, 3).map((s) => s.club);
		const relegatedFromDiv3 = [...div3Clubs]
			.sort((a, b) => (CLUB_STRENGTHS[a] ?? 3) - (CLUB_STRENGTHS[b] ?? 3))
			.slice(0, 3);
		const newDiv3 = div3Clubs
			.filter((c) => !relegatedFromDiv3.includes(c))
			.concat(promotedFromDiv4);
		const newDiv4 = div4Clubs
			.filter((c) => !promotedFromDiv4.includes(c))
			.concat(relegatedFromDiv3);

		const s2Division = promoted ? 3 : 4;
		const s2Clubs = promoted ? newDiv3 : newDiv4;
		schedule = generateDivisionSchedule(s2Division, s2Clubs);
		standings.init(s2Clubs);
		morale = 5;
		let s2PlayerGoals = 0;

		const s2games = new Set<string>();
		const allS2: { w: number; o: string }[] = [];
		for (const week of schedule.weeks) {
			for (const m of week.matches) {
				if (m.home === playerClub) allS2.push({ w: week.weekNumber, o: m.away });
				if (m.away === playerClub) allS2.push({ w: week.weekNumber, o: m.home });
			}
		}
		for (const g of [...allS2].sort(() => Math.random() - 0.5).slice(0, 23)) {
			s2games.add(`${g.w}-${g.o}`);
		}

		for (const week of schedule.weeks) {
			const results: {
				home: string;
				away: string;
				result: { homeGoals: number; awayGoals: number };
			}[] = [];
			for (const m of week.matches) {
				if (m.home === playerClub || m.away === playerClub) {
					const opp = m.home === playerClub ? m.away : m.home;
					const key = `${week.weekNumber}-${opp}`;
					const playing = s2games.has(key);
					const tg = makePoisson(formula.teamLambda(strengthOf(playerClub), morale));
					const og = makePoisson(formula.oppLambda(strengthOf(opp), morale));
					let gf: number, ga: number;
					if (playing) {
						const pg = [0, 0, 0, 1, 1, 2][Math.floor(Math.random() * 6)];
						s2PlayerGoals += pg;
						if (m.home === playerClub) {
							gf = tg + pg;
							ga = og;
						} else {
							gf = og;
							ga = tg + pg;
						}
						const r = gf > ga ? 'win' : gf === ga ? 'draw' : 'loss';
						morale = MORALE_CONFIG.adjustMorale(morale, MORALE_CONFIG.deltas[r]);
					} else {
						if (m.home === playerClub) {
							gf = tg;
							ga = og;
						} else {
							gf = og;
							ga = tg;
						}
						morale = MORALE_CONFIG.adjustMorale(
							morale,
							MORALE_CONFIG.deltas[gf > ga ? 'win' : gf === ga ? 'draw' : 'loss']
						);
					}
					results.push({ home: m.home, away: m.away, result: { homeGoals: gf, awayGoals: ga } });
				} else {
					results.push({
						home: m.home,
						away: m.away,
						result: simAi(strengthOf(m.home), strengthOf(m.away), formula.aiBase)
					});
				}
			}
			standings.processWeekResults(results, week.weekNumber);
		}

		const s2Sorted = [...standings.entries].sort(
			(a, b) =>
				b.points - a.points ||
				b.goalDifference - a.goalDifference ||
				b.goalsFor - a.goalsFor ||
				a.club.localeCompare(b.club)
		);
		const s2Idx = s2Sorted.findIndex((s) => s.club === playerClub);
		const s2Pos = s2Idx + 1;

		const divLabel = promoted ? 'Div3' : 'Div4 (not promoted)';
		return `  Seed ${String(seed).padStart(4)}: S1 pos=${s1Pos} ${promoted ? '↑PROMOTED' : 'stayed'} → S2 in ${divLabel} pos=${s2Pos} pG1=${playerGoalsTotal} pG2=${s2PlayerGoals}`;
	}

	it('two-season comparison: all candidate formulas', () => {
		const f02: FormulaConfig = {
			name: 'm0.02-team-only',
			teamLambda: (s, m) => 0.3 + s * 0.1 + m * 0.02,
			oppLambda: (_s, _m) => 0.3 + _s * 0.1
		};
		const f01: FormulaConfig = {
			name: 'm0.01-team-only',
			teamLambda: (s, m) => 0.3 + s * 0.1 + m * 0.01,
			oppLambda: (_s, _m) => 0.3 + _s * 0.1
		};
		const f05: FormulaConfig = {
			name: 'base-0.5-m0.01-team-only',
			teamLambda: (s, m) => 0.5 + s * 0.1 + m * 0.01,
			oppLambda: (_s, _m) => 0.5 + _s * 0.1,
			aiBase: 0.5
		};

		const all = [f02, f01, f05];
		for (const formula of all) {
			const results = SEEDS.map((s) => runTwoSeasons(s, formula));
			const promoted = results.filter((l) => l.includes('↑PROMOTED')).length;
			console.log(`\n── ${formula.name} ───────────────────────────────────────`);
			console.log(
				`  Promoted from Div4: ${promoted}/${SEEDS.length} (${((promoted / SEEDS.length) * 100).toFixed(0)}%)`
			);
			console.log(`  ── Per-seed ──`);
			results.forEach((l) => console.log(l));
		}

		expect(SEEDS.length).toBeGreaterThan(0);
	});
});
