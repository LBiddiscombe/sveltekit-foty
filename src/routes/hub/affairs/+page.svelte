<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { standings } from '$lib/stores/standings.svelte';
	import { MORALE_CONFIG } from '$lib/config/morale';
	import Card from '$lib/components/Card.svelte';

	const moraleBar = $derived(
		((season.morale - MORALE_CONFIG.scale.min) /
			(MORALE_CONFIG.scale.max - MORALE_CONFIG.scale.min)) *
			100
	);

	const playerClubEntry = $derived(standings.getByClub(player.club));
	const playerPosition = $derived(standings.getPosition(player.club));

	function formClass(r: string): string {
		if (r === 'W') return 'text-success';
		if (r === 'D') return 'text-warning';
		return 'text-danger';
	}
</script>

<div class="mx-auto min-h-dvh max-w-md bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex items-center justify-between">
		<button
			onclick={async () => await goto('/hub')}
			class="flex items-center gap-1 text-[10px] text-subtle hover:text-primary"
		>
			<span class="text-xs leading-none">&lt;</span> Hub
		</button>
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">State of Affairs</span>
	</div>

	<div class="flex flex-col gap-5">
	<Card>
		<div class="flex items-start justify-between">
			<div>
				<h2 class="text-xs text-primary">{player.club}</h2>
				<p class="mt-0.5 text-[10px] text-subtle">
					Division {player.division} &middot; Week {season.weekNumber}
				</p>
			</div>
			<div class="text-right">
				<div
					class="text-[10px] tabular-nums {season.morale >= 7
						? 'text-success'
						: season.morale >= 4
							? 'text-warning'
							: 'text-danger'}"
				>
					Morale {season.morale}/10
				</div>
				<div class="mt-1.5 h-2 w-20 overflow-hidden rounded-full bg-dark">
					<div
						class="h-full rounded-full transition-all {season.morale >= 7
							? 'bg-success'
							: season.morale >= 4
								? 'bg-warning'
								: 'bg-danger'}"
						style="width: {moraleBar}%"
					></div>
				</div>
			</div>
		</div>
	</Card>

	{#if playerClubEntry}
		<Card>
			<h3 class="mb-3 text-[10px] font-bold uppercase tracking-wider text-subtle">Your Record</h3>
			<div class="grid grid-cols-3 gap-2">
				<div class="rounded border border-subtle bg-dark p-2 text-center">
					<p class="text-sm text-primary">{playerClubEntry.played}</p>
					<p class="mt-0.5 text-[9px] text-subtle">PLAYED</p>
				</div>
				<div class="rounded border border-subtle bg-dark p-2 text-center">
					<p class="text-sm text-success">{playerClubEntry.won}</p>
					<p class="mt-0.5 text-[9px] text-subtle">WON</p>
				</div>
				<div class="rounded border border-subtle bg-dark p-2 text-center">
					<p class="text-sm text-warning">{playerClubEntry.drawn}</p>
					<p class="mt-0.5 text-[9px] text-subtle">DRAWN</p>
				</div>
				<div class="rounded border border-subtle bg-dark p-2 text-center">
					<p class="text-sm text-danger">{playerClubEntry.lost}</p>
					<p class="mt-0.5 text-[9px] text-subtle">LOST</p>
				</div>
				<div class="rounded border border-subtle bg-dark p-2 text-center">
					<p class="text-sm text-primary">{playerClubEntry.goalsFor}</p>
					<p class="mt-0.5 text-[9px] text-subtle">GF</p>
				</div>
				<div class="rounded border border-subtle bg-dark p-2 text-center">
					<p class="text-sm text-primary">{playerClubEntry.goalsAgainst}</p>
					<p class="mt-0.5 text-[9px] text-subtle">GA</p>
				</div>
			</div>
			<div class="mt-2 flex items-center justify-between rounded border border-subtle bg-dark p-2">
				<div class="flex items-center gap-3">
					<span class="text-[10px] text-subtle">GD</span>
					<span
						class="text-sm {playerClubEntry.goalDifference >= 0 ? 'text-success' : 'text-danger'}"
					>
						{playerClubEntry.goalDifference > 0 ? '+' : ''}{playerClubEntry.goalDifference}
					</span>
				</div>
				<div class="flex items-center gap-3">
					<span class="text-[10px] text-subtle">Pts</span>
					<span class="text-sm font-bold text-primary">{playerClubEntry.points}</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="text-[10px] text-subtle">Form</span>
					<span class="flex gap-0.5 text-[10px]">
						{#each playerClubEntry.lastFive as r, i (i)}
							<span class={formClass(r)}>{r}</span>
						{/each}
					</span>
				</div>
			</div>
		</Card>

		<Card>
			<h3 class="mb-3 text-[10px] font-bold uppercase tracking-wider text-subtle">
				Division {player.division}
			</h3>
			<div class="flex flex-col gap-0.5">
				<div class="flex items-center gap-2 text-[9px] text-subtle">
					<span class="w-6 text-center">Pos</span>
					<span class="flex-1">Club</span>
					<span class="w-5 text-center">P</span>
					<span class="w-6 text-center">Pts</span>
				</div>
				{#each standings.entries as entry, i (entry.club)}
					<div
						class="flex items-center gap-2 rounded px-0 py-0.5 text-[10px] {entry.club === player.club
							? 'bg-dark text-primary'
							: 'text-subtle'}"
					>
						<span class="w-6 text-center {entry.club === player.club ? 'text-warning' : ''}"
							>{i + 1}</span
						>
						<span class="flex-1 truncate">{entry.club}</span>
						<span class="w-5 text-center tabular-nums">{entry.played}</span>
						<span class="w-6 text-center tabular-nums font-bold">{entry.points}</span>
					</div>
				{/each}
			</div>
		</Card>
	{/if}
	</div>
</div>
