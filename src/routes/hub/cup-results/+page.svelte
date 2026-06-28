<script lang="ts">
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { CUP_DISPLAY_NAMES, CUP_ROUND_NAMES } from '$lib/config/cups';
	import type { CupBracket, CupType } from '$lib/types/game';

	function getBracket(type: CupType): CupBracket | null {
		return type === 'league-cup' ? season.leagueCupBracket : season.faCupBracket;
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex shrink-0 items-center justify-between">
		<button
			onclick={() => history.back()}
			class="flex items-center gap-1 text-[10px] text-subtle hover:text-primary"
		>
			<span class="text-xs leading-none">&lt;</span> Back
		</button>
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Cup Results</span>
	</div>

	<div class="flex flex-col gap-6">
		{#each (['league-cup', 'fa-cup'] as const) as cupType (cupType)}
			{@const bracket = getBracket(cupType)}
			{@const name = CUP_DISPLAY_NAMES[cupType]}
			<div>
				<h2 class="mb-3 text-sm text-primary">{name}</h2>

				{#if !bracket}
					<p class="text-xs text-subtle">Cup not yet drawn.</p>
				{:else}
					<div class="flex flex-col gap-3">
						{#each bracket.rounds as round, ri (round.roundNumber)}
							{@const hasResults = round.ties.some((t) => t.result)}
							{@const isCurrentOrFuture = ri >= bracket.currentRound - 1}
							<div class="rounded border border-subtle bg-card p-3">
								<h3 class="mb-2 text-[10px] font-bold text-warning">{CUP_ROUND_NAMES[cupType][round.roundNumber]}</h3>

								{#if !hasResults && isCurrentOrFuture && !bracket.winner}
									<p class="text-[10px] text-subtle">Not yet played.</p>
								{:else if !hasResults}
									<p class="text-[10px] text-subtle">Not reached.</p>
								{:else}
									<div class="flex flex-col gap-1">
										{#each round.ties as tie}
											{@const isPlayerHome = tie.home === player.club}
											{@const isPlayerAway = tie.away === player.club}
											{@const isPlayerTie = isPlayerHome || isPlayerAway}
											<div class="flex items-center gap-1 text-[10px] {isPlayerTie ? 'text-primary' : 'text-subtle'}">
												{#if tie.result}
													{@const onPens = tie.result.resolvedBy === 'coin-toss'}
													{@const showAgg = tie.result.aggHomeGoals !== undefined}
													{@const scoreDisplay = showAgg ? `${tie.result.aggHomeGoals} - ${tie.result.aggAwayGoals}` : `${tie.result.homeGoals} - ${tie.result.awayGoals}`}
													<span class="w-3 text-center text-success">
														{tie.result.winner === tie.home ? 'W' : ''}
													</span>
													<span class="flex-1 truncate {isPlayerHome ? 'font-bold' : ''}">{tie.home}</span>
													<span class="flex items-center gap-0.5 font-mono shrink-0">
														{#if onPens}<span class="text-warning">p</span>{/if}
														{scoreDisplay}
													</span>
													<span class="flex-1 truncate text-right {isPlayerAway ? 'font-bold' : ''}">{tie.away}</span>
													<span class="w-3 text-center text-success">
														{tie.result.winner === tie.away ? 'W' : ''}
													</span>
												{:else}
													<span class="w-3"></span>
													<span class="flex-1 truncate">{tie.home || 'TBD'}</span>
													<span class="font-mono shrink-0">v</span>
													<span class="flex-1 truncate text-right">{tie.away || 'TBD'}</span>
													<span class="w-3"></span>
												{/if}
											</div>
										{/each}
									</div>
								{/if}
							</div>
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
