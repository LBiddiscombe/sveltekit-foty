<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { CUP_DISPLAY_NAMES, CUP_ROUND_NAMES, CUP_SCHEDULE } from '$lib/config/cups';
	import type { CupBracket, CupType } from '$lib/types/game';

	const cupTypes: CupType[] = ['league-cup', 'fa-cup'];

	const activeCup = $derived<CupType | 'all'>(
		$page.url.searchParams.get('cup') === 'league-cup' ||
			$page.url.searchParams.get('cup') === 'fa-cup'
			? ($page.url.searchParams.get('cup') as CupType)
			: 'all'
	);

	const visibleCups = $derived(activeCup === 'all' ? cupTypes : [activeCup]);

	const pageTitle = $derived(
		activeCup === 'all' ? 'Cup Fixtures' : `${CUP_DISPLAY_NAMES[activeCup]} Fixtures`
	);

	function getBracket(type: CupType): CupBracket | null {
		return type === 'league-cup' ? season.leagueCupBracket : season.faCupBracket;
	}

	function roundStatus(bracket: CupBracket, ri: number): 'done' | 'current' | 'upcoming' {
		if (ri < bracket.currentRound - 1) return 'done';
		if (ri === bracket.currentRound - 1) return 'current';
		return 'upcoming';
	}

	function roundHasTeams(round: CupBracket['rounds'][number]): boolean {
		return round.ties.some((t) => t.home !== '' && t.away !== '');
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex shrink-0 items-center justify-between">
		<button
			onclick={async () => await goto('/hub')}
			class="flex items-center gap-1 text-[10px] text-subtle hover:text-primary"
		>
			<span class="text-xs leading-none">&lt;</span> Hub
		</button>
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">{pageTitle}</span>
	</div>

	<div class="flex flex-col gap-6">
		{#each visibleCups as cupType (cupType)}
			{@const bracket = getBracket(cupType)}
			{@const name = CUP_DISPLAY_NAMES[cupType]}
			<div>
				{#if activeCup === 'all'}
					<h2 class="mb-3 text-sm text-primary">{name}</h2>
				{/if}

				{#if !bracket}
					<p class="text-xs text-subtle">Cup not yet drawn.</p>
				{:else}
					<div class="flex flex-col gap-3">
						{#each bracket.rounds as round, ri (round.roundNumber)}
							{@const status = roundStatus(bracket, ri)}
							{@const hasTeams = roundHasTeams(round)}
							{@const week = CUP_SCHEDULE[cupType][ri]?.week}
							<details class="rounded bg-card" open={status === 'current'}>
								<summary
									class="flex cursor-pointer items-center gap-2 px-3 py-2 text-[10px] font-bold text-warning"
								>
									<span
										>{CUP_ROUND_NAMES[cupType][round.roundNumber]}{week ? ' Wk ' + week : ''}</span
									>
									<span
										class="ml-auto rounded px-1.5 py-0.5 text-[8px] uppercase tracking-wider
											{status === 'done' ? 'bg-success/20 text-success' : ''}
											{status === 'current' ? 'bg-warning/20 text-warning' : ''}
											{status === 'upcoming' ? 'bg-subtle/20 text-subtle' : ''}"
									>
										{status === 'done' ? 'Done' : status === 'current' ? 'Current' : 'Upcoming'}
									</span>
								</summary>
								<div class="px-3 py-2">
									{#if !hasTeams}
										<p class="text-[10px] text-subtle">Not reached.</p>
									{:else}
										{@const drawnTies = round.ties.filter((t) => t.home !== '' && t.away !== '')}
										<div class="flex flex-col gap-1">
											{#each drawnTies as tie (tie.home)}
												{@const isPlayerHome = tie.home === player.club}
												{@const isPlayerAway = tie.away === player.club}
												{@const isPlayerTie = isPlayerHome || isPlayerAway}
												<div
													class="flex items-center gap-1 text-[10px] {isPlayerTie
														? 'text-primary'
														: 'text-subtle'}"
												>
													{#if tie.result}
														{@const onPens = tie.result.resolvedBy === 'coin-toss'}
														{@const showAgg = tie.result.aggHomeGoals !== undefined}
														{@const scoreDisplay = showAgg
															? `${tie.result.aggHomeGoals} - ${tie.result.aggAwayGoals}`
															: `${tie.result.homeGoals} - ${tie.result.awayGoals}`}
														<span class="w-3 text-center text-success">
															{tie.result.winner === tie.home ? 'W' : ''}
														</span>
														<span class="flex-1 truncate {isPlayerHome ? 'font-bold' : ''}"
															>{tie.home}</span
														>
														<span class="flex items-center gap-0.5 font-mono shrink-0">
															{#if onPens && tie.result.winner === tie.home}<span
																	class="text-warning">p</span
																>{/if}
															{scoreDisplay}
															{#if onPens && tie.result.winner === tie.away}<span
																	class="text-warning">p</span
																>{/if}
														</span>
														<span
															class="flex-1 truncate text-right {isPlayerAway ? 'font-bold' : ''}"
															>{tie.away}</span
														>
														<span class="w-3 text-center text-success">
															{tie.result.winner === tie.away ? 'W' : ''}
														</span>
													{:else}
														<span class="w-3"></span>
														<span class="flex-1 truncate">{tie.home}</span>
														<span class="font-mono shrink-0">v</span>
														<span class="flex-1 truncate text-right">{tie.away}</span>
														<span class="w-3"></span>
													{/if}
												</div>
											{/each}
										</div>
									{/if}
								</div>
							</details>
						{/each}
					</div>

					{#if bracket.winner}
						<div class="mt-3 rounded border border-success bg-card p-3 text-center">
							<p class="text-[10px] text-subtle">Winner</p>
							<p class="text-sm text-success">{bracket.winner}</p>
							<p class="text-[10px] text-subtle">Runner-up: {bracket.runnerUp}</p>
						</div>
					{/if}
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	details > summary {
		list-style: none;
	}
	details > summary::marker,
	details > summary::-webkit-details-marker {
		display: none;
	}
	details > summary::before {
		content: '▶';
		display: inline-block;
		font-size: 6px;
		margin-right: 6px;
		transition: transform 0.15s;
	}
	details[open] > summary::before {
		transform: rotate(90deg);
	}
</style>
