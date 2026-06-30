import { season } from '$lib/stores/season.svelte';
import { player } from '$lib/stores/player.svelte';
import { standings } from '$lib/stores/standings.svelte';
import { inbox } from '$lib/stores/inbox.svelte';
import { setScoutReport } from '$lib/stores/scout-report.svelte';
import { CLUB_STRENGTHS } from '$lib/config/club-strengths';
import {
	CUP_SCHEDULE,
	CUP_DISPLAY_NAMES,
	CUP_ROUND_NAMES,
	isFaCupFinalWeek
} from '$lib/config/cups';
import { simulateMatch } from '$lib/match/engine';
import {
	getTransferWindow,
	isPassiveScoutingBlocked,
	hasMovedThisWindow,
	rollPassiveScout,
	evaluateScout,
	processSameDivisionTransfer,
	processDivisionUpTransfer
} from '$lib/transfer/evaluate';
import { pickRandomIncident } from '$lib/config/incidents';
import type { CupType, Fixture } from '$lib/types/game';

export type ScoreLine = {
	home: string;
	away: string;
	homeScore: number;
	awayScore: number;
	penalties?: boolean;
	penaltyHomeWon?: boolean;
};

type CupEntry = {
	index: number;
	home: string;
	away: string;
	homeScore: number;
	awayScore: number;
	penalties?: boolean;
	penaltyHomeWon?: boolean;
};

export type WeekResolution = {
	status: 'display' | 'auto-continue';
	lines: string[];
	scoreLines: Map<number, ScoreLine>;
	onContinue: () => string;
};

function getCupWeekInfo(week: number): { type: CupType; round: number } | null {
	for (const cupType of ['league-cup', 'fa-cup'] as const) {
		const schedule = CUP_SCHEDULE[cupType];
		for (const sr of schedule) {
			if (sr.week === week) return { type: cupType, round: sr.round };
		}
	}
	return null;
}

function buildCupLines(
	club: string,
	cupInfo: { type: CupType; round: number }
): {
	lines: string[];
	scoreEntries: CupEntry[];
} {
	const bracket = cupInfo.type === 'league-cup' ? season.leagueCupBracket : season.faCupBracket;
	if (!bracket) return { lines: [], scoreEntries: [] };

	const round = bracket.rounds[cupInfo.round - 1];
	if (!round) return { lines: [], scoreEntries: [] };

	const hasResults = round.ties.some((t) => t.result);
	if (!hasResults) return { lines: [], scoreEntries: [] };

	const playerTie = round.ties.find((t) => (t.home === club || t.away === club) && t.result);
	if (!playerTie) return { lines: [], scoreEntries: [] };

	const r = playerTie.result!;
	const isTwoLeg = r.homeGoals2 !== undefined;
	const cupName = CUP_DISPLAY_NAMES[cupInfo.type].toUpperCase();
	const roundName = CUP_ROUND_NAMES[cupInfo.type][cupInfo.round].toUpperCase();

	const scoreEntries: CupEntry[] = [];
	const lines: string[] = [];

	if (isTwoLeg) {
		const hdr1 = ` ${cupName} ${roundName} LEG 1`;
		lines.push(hdr1);
		lines.push('-'.repeat(hdr1.length));

		const leg1Result = `${playerTie.home.padEnd(14)} ${r.homeGoals} - ${r.awayGoals}    ${playerTie.away}`;
		scoreEntries.push({
			index: lines.length,
			home: playerTie.home,
			away: playerTie.away,
			homeScore: r.homeGoals,
			awayScore: r.awayGoals
		});
		lines.push(`  ${leg1Result}`);

		const teamGoals1 = club === playerTie.home ? r.homeGoals : r.awayGoals;
		const oppGoals1 = club === playerTie.home ? r.awayGoals : r.homeGoals;
		const leg1ResultText =
			teamGoals1 > oppGoals1 ? 'WIN' : teamGoals1 === oppGoals1 ? 'DRAW' : 'LOSE';
		const pGoals1 = r.playerLeg1Goals ?? teamGoals1;
		const leg1Line =
			r.playerLeg1Goals !== undefined &&
			r.playerLeg1Goals === 0 &&
			(!r.playerLeg1Outcomes || r.playerLeg1Outcomes.length === 0)
				? `  RESULT - ${leg1ResultText} : YOU DIDN'T PLAY`
				: `  RESULT - ${leg1ResultText} : YOU SCORED ${pGoals1}`;
		lines.push(leg1Line);
		lines.push('');

		const hdr2 = ` ${cupName} ${roundName} LEG 2`;
		lines.push(hdr2);
		lines.push('-'.repeat(hdr2.length));

		const leg2Result = `${playerTie.away.padEnd(14)} ${r.awayGoals2} - ${r.homeGoals2}    ${playerTie.home}`;
		scoreEntries.push({
			index: lines.length,
			home: playerTie.away,
			away: playerTie.home,
			homeScore: r.awayGoals2!,
			awayScore: r.homeGoals2!
		});
		lines.push(`  ${leg2Result}`);

		const teamGoals2 = club === playerTie.home ? r.homeGoals2 : r.awayGoals2;
		const oppGoals2 = club === playerTie.home ? r.awayGoals2 : r.homeGoals2;
		const leg2ResultText =
			(teamGoals2 ?? 0) > (oppGoals2 ?? 0)
				? 'WIN'
				: (teamGoals2 ?? 0) === (oppGoals2 ?? 0)
					? 'DRAW'
					: 'LOSE';
		const pGoals2 = r.playerLeg2Goals ?? teamGoals2;
		const leg2Line =
			r.playerLeg2Goals !== undefined &&
			r.playerLeg2Goals === 0 &&
			(!r.playerLeg2Outcomes || r.playerLeg2Outcomes.length === 0)
				? `  RESULT - ${leg2ResultText} : YOU DIDN'T PLAY`
				: `  RESULT - ${leg2ResultText} : YOU SCORED ${pGoals2 ?? 0}`;
		lines.push(leg2Line);
		lines.push('');

		const pens = r.resolvedBy === 'coin-toss' ? ' p' : '';
		const playerWon = r.winner === club;
		lines.push(
			`  Agg: ${r.aggHomeGoals} - ${r.aggAwayGoals}${pens}  ${playerWon ? 'WIN' : 'LOSE'}`
		);
	} else {
		const hdr = ` ${cupName} ${roundName}`;
		lines.push(hdr);
		lines.push('-'.repeat(hdr.length));

		const onPens = r.resolvedBy === 'coin-toss';
		const homeWon = r.winner === playerTie.home;
		scoreEntries.push({
			index: lines.length,
			home: playerTie.home,
			away: playerTie.away,
			homeScore: r.homeGoals,
			awayScore: r.awayGoals,
			penalties: onPens,
			penaltyHomeWon: onPens ? homeWon : undefined
		});
		const scoreLine = onPens
			? homeWon
				? `p ${r.homeGoals} - ${r.awayGoals}`
				: `${r.homeGoals} - ${r.awayGoals} p`
			: `${r.homeGoals} - ${r.awayGoals}`;
		lines.push(`  ${playerTie.home.padEnd(14)} ${scoreLine}    ${playerTie.away}`);

		const teamGoals1 = club === playerTie.home ? r.homeGoals : r.awayGoals;
		const playerWon = r.winner === club;
		const pGoals = r.playerLeg1Goals ?? teamGoals1;
		const line =
			r.playerLeg1Goals !== undefined &&
			r.playerLeg1Goals === 0 &&
			(!r.playerLeg1Outcomes || r.playerLeg1Outcomes.length === 0)
				? `  RESULT - ${playerWon ? 'WIN' : 'LOSE'} : YOU DIDN'T PLAY`
				: `  RESULT - ${playerWon ? 'WIN' : 'LOSE'} : YOU SCORED ${pGoals}`;
		lines.push(line);
	}

	return { lines, scoreEntries };
}

function buildLines(
	club: string,
	week: number,
	weekFixtures: Fixture[],
	cupLines: { lines: string[]; scoreEntries: CupEntry[] },
	scoreLines: Map<number, ScoreLine>
): string[] {
	const l: string[] = [];
	l.push('INCOMING RESULTS');
	l.push('----------------');
	l.push('');

	if (cupLines.lines.length > 0) {
		const cupBase = l.length;
		l.push(...cupLines.lines);
		for (const entry of cupLines.scoreEntries) {
			scoreLines.set(cupBase + entry.index, {
				home: entry.home,
				away: entry.away,
				homeScore: entry.homeScore,
				awayScore: entry.awayScore,
				penalties: entry.penalties,
				penaltyHomeWon: entry.penaltyHomeWon
			});
		}
		l.push('');
	}

	const hasLeague =
		weekFixtures.length > 0 ||
		season.divisionSchedule.weeks.some((w) => w.weekNumber === week && w.matches.length > 0);

	if (hasLeague && !isFaCupFinalWeek(week)) {
		l.push(` DIVISION ${player.division} - WEEK ${week}`);
		l.push('-----------------------');
		l.push('');

		for (const f of weekFixtures) {
			const goalsFor = f.result!.goalsFor;
			const goalsAgainst = f.result!.goalsAgainst;
			const playerGoals = f.result!.playerGoals ?? 0;
			const home = f.isHome ? club : f.opponent;
			const away = f.isHome ? f.opponent : club;
			const homeScore = f.isHome ? goalsFor : goalsAgainst;
			const awayScore = f.isHome ? goalsAgainst : goalsFor;
			const result = goalsFor > goalsAgainst ? 'WIN' : goalsFor === goalsAgainst ? 'DRAW' : 'LOSE';

			scoreLines.set(l.length, { home, away, homeScore, awayScore });
			l.push(`  ${home.padEnd(14)} ${homeScore} - ${awayScore}    ${away}`);
			const playerLine =
				f.result && playerGoals === 0 && f.result.outcomes.length === 0
					? `RESULT - ${result} : YOU DIDN'T PLAY`
					: `RESULT - ${result} : YOU SCORED ${playerGoals}`;
			l.push(`  ${playerLine}`);
			l.push('');
		}

		l.push('');
		l.push(' LEAGUE TABLE');
		l.push('--------------');
		l.push('');

		const total = standings.entries.length;
		const playerPos = standings.getPosition(club);
		const inTop3 = playerPos <= 3;
		const inBottom3 = playerPos > total - 3;

		if (total <= 6) {
			for (const entry of standings.entries) {
				const pos = standings.getPosition(entry.club);
				const marker = entry.club === club ? '>' : ' ';
				l.push(
					`  ${marker}${String(pos).padStart(2)}. ${entry.club.padEnd(16)} ${entry.points}pts`
				);
			}
		} else {
			function addLine(entry: (typeof standings.entries)[number]) {
				const pos = standings.getPosition(entry.club);
				const marker = entry.club === club ? '>' : ' ';
				l.push(
					`  ${marker}${String(pos).padStart(2)}. ${entry.club.padEnd(16)} ${entry.points}pts`
				);
			}

			for (const entry of standings.entries.slice(0, 3)) addLine(entry);

			if (inTop3) {
				l.push('   ...');
			} else if (inBottom3) {
				l.push('   ...');
			} else {
				if (playerPos > 4) l.push('   ...');
				const playerEntry = standings.getByClub(club);
				if (playerEntry) addLine(playerEntry);
				if (playerPos < total - 3) l.push('   ...');
			}

			for (const entry of standings.entries.slice(-3)) addLine(entry);
		}
	}

	return l;
}

function determineStatus(
	week: number,
	scoreLines: Map<number, ScoreLine>
): 'display' | 'auto-continue' {
	const hasLeague = season.divisionSchedule.weeks.some(
		(w) => w.weekNumber === week && w.matches.length > 0
	);
	if (hasLeague) return 'display';
	return scoreLines.size > 0 ? 'display' : 'auto-continue';
}

function createContinuation(club: string, week: number, weekFixtures: Fixture[]): () => string {
	return () => {
		if (isFaCupFinalWeek(week)) {
			season.recordGamesPlayed(weekFixtures.length);
			season.advanceWeek();
			return '/season-review';
		}

		if (week >= 30 && !isFaCupFinalWeek(week)) {
			season.advanceWeek();
			return '/hub';
		}

		season.recordGamesPlayed(weekFixtures.length);
		season.advanceWeek();
		inbox.clearActioned();

		const transferWindow = getTransferWindow(season.weekNumber);
		const shouldScout =
			transferWindow !== null &&
			!hasMovedThisWindow(player.lastTransferWindow, season.seasonNumber, transferWindow) &&
			!isPassiveScoutingBlocked(season.seasonNumber, transferWindow) &&
			(player.queuedTransferCard || rollPassiveScout());

		if (shouldScout) {
			player.queuedTransferCard = false;

			const report = evaluateScout(club, player.division, player.careerXp, season.divisionRosters);
			if (report) {
				setScoutReport(report);
				if (report.success && report.signingFee) {
					const scoutDiv = report.scoutDivision;
					if (scoutDiv === player.division) {
						processSameDivisionTransfer(player, season, report.scoutClub, report.signingFee);
					} else {
						processDivisionUpTransfer(
							player,
							season,
							standings,
							report.scoutClub,
							scoutDiv,
							report.signingFee
						);
					}
					player.lastTransferWindow = {
						season: season.seasonNumber,
						window: transferWindow
					};
					inbox.addMessage({
						type: 'news',
						subject: 'New Club!',
						body: `You've signed for ${report.scoutClub} in Division ${report.scoutDivision}. A fresh start — make it count!`,
						actionRequired: true
					});
				}
				return '/scout-report';
			}
		}

		const hasIncident = Math.random() < 0.25;
		if (hasIncident) {
			const card = pickRandomIncident();
			inbox.addIncident({
				subject: card.title,
				body: card.description,
				incidentCardId: card.id
			});
			return '/hub/inbox';
		}

		return '/hub';
	};
}

export function resolveWeek(): WeekResolution {
	const club = player.club !== 'Free Agent' ? player.club : 'Exetur';
	const week = season.weekNumber;

	season.simulateCupWeek();

	const weekFixtures = season.fixtures.filter((f) => f.weekNumber === week && f.result);

	if (!isFaCupFinalWeek(week) && week > standings.lastProcessedWeek) {
		const results: {
			home: string;
			away: string;
			result: { homeGoals: number; awayGoals: number };
		}[] = [];

		for (const f of weekFixtures) {
			const home = f.isHome ? club : f.opponent;
			const away = f.isHome ? f.opponent : club;
			results.push({
				home,
				away,
				result: {
					homeGoals: f.isHome ? f.result!.goalsFor : f.result!.goalsAgainst,
					awayGoals: f.isHome ? f.result!.goalsAgainst : f.result!.goalsFor
				}
			});
		}

		const weekSchedule = season.divisionSchedule.weeks.find((w) => w.weekNumber === week);
		if (weekSchedule) {
			for (const m of weekSchedule.matches) {
				if (m.home === club || m.away === club) continue;
				if (!m.result) {
					const homeStrength = CLUB_STRENGTHS[m.home] ?? 5;
					const awayStrength = CLUB_STRENGTHS[m.away] ?? 5;
					m.result = simulateMatch(homeStrength, awayStrength);
				}
				results.push({ home: m.home, away: m.away, result: m.result });
			}
		}

		standings.processWeekResults(results, week);
	}

	const cupInfo = getCupWeekInfo(week);
	const cupResult = cupInfo ? buildCupLines(club, cupInfo) : { lines: [], scoreEntries: [] };

	const scoreLines = new Map<number, ScoreLine>();
	const lines = buildLines(club, week, weekFixtures, cupResult, scoreLines);

	const status = determineStatus(week, scoreLines);
	const onContinue = createContinuation(club, week, weekFixtures);

	return { status, lines, scoreLines, onContinue };
}
