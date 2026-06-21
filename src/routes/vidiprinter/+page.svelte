<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { match } from '$lib/stores/match.svelte';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { pickRandomIncident } from '$lib/config/incidents';
	import { DIVISION_4_CLUBS } from '$lib/config/teams';
	import Button from '$lib/components/Button.svelte';
	import { createTeletype, type TeletypeConfig } from './teletype.svelte';

	$effect(() => {
		season.phase = 'vidiprinter';
	});

	const PLAYER_CLUB = player.club !== 'Free Agent' ? player.club : 'Exetur';

	const opponents = [...DIVISION_4_CLUBS].filter((t) => t !== PLAYER_CLUB);

	const shuffledOpponents = [...opponents].sort(() => Math.random() - 0.5);

	const playerScore = match.result?.score[0] ?? 1;
	const conceded = match.result?.score[1] ?? 1;

	const homeResult = {
		home: PLAYER_CLUB,
		homeScore: playerScore,
		away: shuffledOpponents[0],
		awayScore: conceded,
		isHome: true
	};

	const awayResult = {
		home: shuffledOpponents[1],
		homeScore: 0,
		away: PLAYER_CLUB,
		awayScore: 1,
		isHome: false
	};

	const lines = [
		'INCOMING RESULTS',
		'----------------',
		'',
		' LEAGUE TWO',
		'------------',
		'',
		'HOME',
		`  ${homeResult.home.padEnd(14)} ${homeResult.homeScore} - ${homeResult.awayScore}    ${homeResult.away}`,
		`  RESULT - ${homeResult.homeScore > homeResult.awayScore ? 'WIN' : homeResult.homeScore === homeResult.awayScore ? 'DRAW' : 'LOSE'} : YOU SCORED ${homeResult.homeScore}`,
		'',
		'AWAY',
		`  ${awayResult.home.padEnd(14)} ${awayResult.homeScore} - ${awayResult.awayScore}    ${awayResult.away}`,
		`  RESULT - ${awayResult.awayScore > awayResult.homeScore ? 'WIN' : awayResult.awayScore === awayResult.homeScore ? 'DRAW' : 'LOSE'} : YOU SCORED ${awayResult.awayScore}`
	];

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
				{@const isResultLine = line.startsWith('  RESULT')}
				{@const isScoreLine = line.startsWith('  ') && !isResultLine && line.length > 10}
				{@const isHeader = line === 'INCOMING RESULTS'}

				{#if line === ''}
					<div class="h-2"></div>
				{:else}
					<div
						class="whitespace-pre {isResultLine
							? 'text-subtle'
							: isScoreLine
								? 'text-primary'
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
				const score = match.result?.score;
				if (score) {
					const weekFixtures = season.fixtures.filter(
						(f) => f.weekNumber === season.weekNumber
					);
					const unplayed = weekFixtures.filter((f) => !f.result);
					if (unplayed.length > 0) {
						unplayed[0].result = { goalsFor: score[0], goalsAgainst: score[1] };
					}
				}
				season.gamesPlayed++;
				season.weekNumber = Math.min(season.weekNumber + 1, 30);
				const hasIncident = Math.random() < 0.25;
				if (hasIncident) {
					const card = pickRandomIncident();
					const nextId = Math.max(0, ...inbox.items.map((i) => i.id)) + 1;
					inbox.items = [
						...inbox.items,
						{
							id: nextId,
							type: 'incident',
							subject: card.title,
							body: card.description,
							actionRequired: true,
							actioned: false,
							incidentCardId: card.id
						}
					];
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
