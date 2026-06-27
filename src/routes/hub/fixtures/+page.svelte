<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';

	function resultAbbr(fixture: (typeof season.fixtures)[number]): string {
		if (!fixture.result) return '';
		const { goalsFor, goalsAgainst } = fixture.result;
		if (goalsFor > goalsAgainst) return `W ${goalsFor}-${goalsAgainst}`;
		if (goalsFor === goalsAgainst) return `D ${goalsFor}-${goalsAgainst}`;
		return `L ${goalsFor}-${goalsAgainst}`;
	}

	function resultClass(fixture: (typeof season.fixtures)[number]): string {
		if (!fixture.result) return '';
		const { goalsFor, goalsAgainst } = fixture.result;
		if (goalsFor > goalsAgainst) return 'text-success';
		if (goalsFor === goalsAgainst) return 'text-warning';
		return 'text-danger';
	}

	const sortedFixtures = $derived([...season.fixtures].sort((a, b) => a.weekNumber - b.weekNumber));
</script>

<div class="mx-auto min-h-dvh max-w-md bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex items-center justify-between">
		<button
			onclick={async () => await goto('/hub')}
			class="flex items-center gap-1 text-[10px] text-subtle hover:text-primary"
		>
			<span class="text-xs leading-none">&lt;</span> Hub
		</button>
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Fixtures</span>
	</div>

	<div class="rounded bg-card p-4">
		<div class="flex flex-col gap-0.5">
			<h3 class="mb-3 text-[10px] font-bold uppercase tracking-wider text-subtle">
				Division {player.division} · Season {season.seasonNumber}
			</h3>
			<div class="flex items-center gap-2 text-[9px] text-subtle uppercase tracking-wider">
				<span class="w-4 text-right">WK</span>
				<span class="flex-1">Opponent</span>
				<span class="shrink-0 text-right">Result</span>
			</div>
			{#each sortedFixtures as fixture, i (fixture.opponent + i)}
				<div class="flex items-center gap-2 text-[10px]">
					<span class="w-4 text-right tabular-nums text-subtle">{fixture.weekNumber}</span>
					<span class="flex flex-1 items-center gap-2">
						<span class="w-4 shrink-0 text-center text-subtle">{fixture.isHome ? 'H' : 'A'}</span>
						<span class="truncate text-primary">{fixture.opponent}</span>
					</span>
					{#if fixture.result}
						<span class="flex shrink-0 items-center gap-1">
							<span class="flex items-center gap-0.5">
								{#each fixture.result.outcomes as outcome, j (j)}
									{#if outcome === 'goal'}
										<svg viewBox="0 0 8 8" width="8" height="8" class="text-success">
											<circle cx="4" cy="4" r="3.5" fill="currentColor" />
										</svg>
									{:else if outcome === 'saved'}
										<svg viewBox="0 0 8 8" width="8" height="8" class="text-warning">
											<circle
												cx="4"
												cy="4"
												r="3"
												fill="none"
												stroke="currentColor"
												stroke-width="1.2"
											/>
										</svg>
									{:else}
										<svg viewBox="0 0 8 8" width="8" height="8" class="text-danger">
											<path
												d="M1 1l6 6M7 1l-6 6"
												stroke="currentColor"
												stroke-width="1.2"
												stroke-linecap="round"
											/>
										</svg>
									{/if}
								{/each}
							</span>
							<span class="w-14 text-right tabular-nums {resultClass(fixture)}"
								>{resultAbbr(fixture)}</span
							>
						</span>
					{:else}
						<span class="shrink-0"></span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
