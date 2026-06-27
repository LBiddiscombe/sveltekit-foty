<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { standings } from '$lib/stores/standings.svelte';
	import { pickRandomIncident } from '$lib/config/incidents';
	import { CLUB_STRENGTHS } from '$lib/config/club-strengths';
	import { simAiMatch } from '$lib/match/engine';
	import { saveGame } from '$lib/save';
	import { getTransferWindow } from '$lib/config/economy';
	import {
		evaluateScout,
		processSameDivisionTransfer,
		processDivisionUpTransfer,
		hasMovedThisWindow,
		isPassiveScoutingBlocked,
		rollPassiveScout
	} from '$lib/transfer/evaluate';
	import { setScoutReport } from '$lib/stores/scout-report.svelte';
	import Button from '$lib/components/Button.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { createTeletype, type TeletypeConfig } from './teletype.svelte';
	import VidiprinterLine from '$lib/components/VidiprinterLine.svelte';

	$effect(() => {
		season.phase = 'vidiprinter';
	});

	const PLAYER_CLUB = player.club !== 'Free Agent' ? player.club : 'Exetur';

	type ScoreLine = {
		home: string;
		away: string;
		homeScore: number;
		awayScore: number;
	};

	const scoreLines = new SvelteMap<number, ScoreLine>();

	const weekFixtures = season.fixtures.filter(
		(f) => f.weekNumber === season.weekNumber && f.result
	);

	if (season.weekNumber > standings.lastProcessedWeek) {
		const results: {
			home: string;
			away: string;
			result: { homeGoals: number; awayGoals: number };
		}[] = [];

		for (const f of weekFixtures) {
			const home = f.isHome ? PLAYER_CLUB : f.opponent;
			const away = f.isHome ? f.opponent : PLAYER_CLUB;
			results.push({
				home,
				away,
				result: {
					homeGoals: f.isHome ? f.result!.goalsFor : f.result!.goalsAgainst,
					awayGoals: f.isHome ? f.result!.goalsAgainst : f.result!.goalsFor
				}
			});
		}

		const weekSchedule = season.divisionSchedule.weeks.find(
			(w) => w.weekNumber === season.weekNumber
		);
		if (weekSchedule) {
			for (const m of weekSchedule.matches) {
				if (m.home === PLAYER_CLUB || m.away === PLAYER_CLUB) continue;
				if (!m.result) {
					const homeStrength = CLUB_STRENGTHS[m.home] ?? 5;
					const awayStrength = CLUB_STRENGTHS[m.away] ?? 5;
					m.result = simAiMatch(homeStrength, awayStrength);
				}
				results.push({ home: m.home, away: m.away, result: m.result });
			}
		}

		standings.processWeekResults(results, season.weekNumber);
		saveGame();
	}

	const lines = (() => {
		const l: string[] = [];
		l.push('INCOMING RESULTS');
		l.push('----------------');
		l.push('');
		l.push(` DIVISION ${player.division}`);
		l.push('------------');
		l.push('');

		for (const f of weekFixtures) {
			const goalsFor = f.result!.goalsFor;
			const goalsAgainst = f.result!.goalsAgainst;
			const playerGoals = f.result!.playerGoals ?? 0;
			const home = f.isHome ? PLAYER_CLUB : f.opponent;
			const away = f.isHome ? f.opponent : PLAYER_CLUB;
			const homeScore = f.isHome ? goalsFor : goalsAgainst;
			const awayScore = f.isHome ? goalsAgainst : goalsFor;
			const result = goalsFor > goalsAgainst ? 'WIN' : goalsFor === goalsAgainst ? 'DRAW' : 'LOSE';

			scoreLines.set(l.length, { home, away, homeScore, awayScore });
			l.push(`  ${home.padEnd(14)} ${homeScore} - ${awayScore}    ${away}`);
			l.push(`  RESULT - ${result} : YOU SCORED ${playerGoals}`);
			l.push('');
		}

		l.push('');
		l.push(' LEAGUE TABLE');
		l.push('--------------');
		l.push('');

		const total = standings.entries.length;
		const playerPos = standings.getPosition(PLAYER_CLUB);
		const inTop3 = playerPos <= 3;
		const inBottom3 = playerPos > total - 3;

		if (total <= 6) {
			for (const entry of standings.entries) {
				const pos = standings.getPosition(entry.club);
				const marker = entry.club === PLAYER_CLUB ? '>' : ' ';
				l.push(
					`  ${marker}${String(pos).padStart(2)}. ${entry.club.padEnd(16)} ${entry.points}pts`
				);
			}
		} else {
			function addLine(entry: (typeof standings.entries)[number]) {
				const pos = standings.getPosition(entry.club);
				const marker = entry.club === PLAYER_CLUB ? '>' : ' ';
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
				const playerEntry = standings.getByClub(PLAYER_CLUB);
				if (playerEntry) addLine(playerEntry);
				if (playerPos < total - 3) l.push('   ...');
			}

			for (const entry of standings.entries.slice(-3)) addLine(entry);
		}

		return l;
	})();

	const config: TeletypeConfig = { charSpeed: 25, linePause: 500 };
	const tty = createTeletype(lines, config);

	const pastLines = $derived(lines.slice(0, tty.currentLine));
	const currentText = $derived(
		tty.currentLine < lines.length ? tty.textForLine(tty.currentLine) : ''
	);

	function onContinue() {
		const isLastWeek = season.weekNumber >= 30;

		if (isLastWeek) {
			goto(resolve('/season-review'));
			return;
		}

		season.recordGamesPlayed(weekFixtures.length);
		season.advanceWeek();
		saveGame();

		inbox.clearActioned();

		const transferWindow = getTransferWindow(season.weekNumber);
		const shouldScout =
			transferWindow !== null &&
			!hasMovedThisWindow(player.lastTransferWindow, season.seasonNumber, transferWindow) &&
			!isPassiveScoutingBlocked(season.seasonNumber, transferWindow) &&
			(player.queuedTransferCard || rollPassiveScout());

		if (shouldScout) {
			player.queuedTransferCard = false;
			const report = evaluateScout(player.club, player.division, player.careerXp, season.divisionRosters);
			if (report) {
				setScoutReport(report);
				if (report.success && report.signingFee) {
					const scoutDiv = report.scoutDivision;
					if (scoutDiv === player.division) {
						processSameDivisionTransfer(player, season, report.scoutClub, report.signingFee);
					} else {
						processDivisionUpTransfer(player, season, standings, report.scoutClub, scoutDiv, report.signingFee);
					}
					player.lastTransferWindow = { season: season.seasonNumber, window: transferWindow! };
					const nextId = Math.max(0, ...inbox.items.map((i) => i.id)) + 1;
					inbox.items = [
						...inbox.items,
						{
							id: nextId,
							type: 'news',
							subject: 'New Club',
							body: `You have joined ${report.scoutClub} in Division ${report.scoutDivision}. Report for training.`,
							actionRequired: true,
							actioned: false
						}
					];
				}
				goto(resolve('/scout-report'));
				return;
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
			goto(resolve('/hub/inbox'));
		} else {
			goto(resolve('/hub'));
		}
	}
</script>

<svelte:window
	onpointerdown={() => (tty.speed = 5)}
	onpointerup={() => (tty.speed = 25)}
	onpointerleave={() => (tty.speed = 25)}
/>

<div class="mx-auto flex min-h-dvh max-w-md flex-col bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex items-center justify-end">
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Vidiprinter</span>
	</div>

	<div class="flex min-h-0 flex-1 flex-col justify-end overflow-hidden">
		<div class="flex flex-col gap-0.5 font-pixel text-[10px] leading-relaxed">
			{#each pastLines as line, i (i)}
				{@const sc = scoreLines.get(i)}
				{@const isResultLine = line.startsWith('  RESULT')}
				{@const isScoreLine = sc !== undefined}
				{@const isHeader = line === 'INCOMING RESULTS' || line.startsWith(' LEAGUE')}
				{@const isTableLine = line.includes('pts')}

				{#if line === ''}
					<div class="h-2"></div>
				{:else if isScoreLine}
					<VidiprinterLine
						home={sc.home}
						away={sc.away}
						homeScore={sc.homeScore}
						awayScore={sc.awayScore}
						playerTeam={PLAYER_CLUB}
					/>
				{:else}
					<div
						class="whitespace-pre {isResultLine
							? 'text-subtle'
							: isHeader
								? 'text-warning'
								: isTableLine
									? 'text-primary'
									: 'text-subtle'}"
					>
						{line}
					</div>
				{/if}
			{/each}

			{#if !tty.done}
				<div class="whitespace-pre text-primary">
					{currentText}
					{#if !tty.lineDone}
						<span class="inline-block h-2.5 w-1 animate-pulse bg-warning"></span>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<div class="mt-auto pt-4 {tty.done ? '' : 'invisible'}">
		<Button onclick={onContinue}>Continue</Button>
	</div>
</div>
