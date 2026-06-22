<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { pickRandomIncident } from '$lib/config/incidents';
	import Button from '$lib/components/Button.svelte';
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

	const scoreLines = new Map<number, ScoreLine>();

	const weekFixtures = season.fixtures.filter(
		(f) => f.weekNumber === season.weekNumber && f.result
	);

	const lines = (() => {
		const l: string[] = [
			'INCOMING RESULTS',
			'----------------',
			'',
			' LEAGUE TWO',
			'------------',
			'',
		];

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

		return l;
	})();

	const config: TeletypeConfig = { charSpeed: 25, linePause: 500 };
	const tty = createTeletype(lines, config);

	const pastLines = $derived(lines.slice(0, tty.currentLine));
	const currentText = $derived(
		tty.currentLine < lines.length ? tty.textForLine(tty.currentLine) : ''
	);
</script>

<svelte:window
	onpointerdown={() => (tty.speed = 5)}
	onpointerup={() => (tty.speed = 25)}
	onpointerleave={() => (tty.speed = 25)}
/>

<div class="mx-auto flex min-h-dvh max-w-md flex-col px-4 py-8">
	<h2 class="mb-4 font-pixel text-sm text-primary">Vidiprinter</h2>

	<div class="flex min-h-0 flex-1 flex-col justify-end overflow-hidden">
		<div class="flex flex-col gap-0.5 font-pixel text-[10px] leading-relaxed">
			{#each pastLines as line, i (i)}
				{@const sc = scoreLines.get(i)}
				{@const isResultLine = line.startsWith('  RESULT')}
				{@const isScoreLine = sc !== undefined}
				{@const isHeader = line === 'INCOMING RESULTS'}

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
		<Button
			onclick={async () => {
				season.recordGamesPlayed(weekFixtures.length);
				season.advanceWeek();
				inbox.clearActioned();
				const hasIncident = Math.random() < 0.25;
				if (hasIncident) {
					const card = pickRandomIncident();
					inbox.addIncident({
						subject: card.title,
						body: card.description,
						incidentCardId: card.id
					});
					await goto(resolve('/hub/inbox'));
				} else {
					await goto(resolve('/hub'));
				}
			}}
		>
			Continue
		</Button>
	</div>
</div>
