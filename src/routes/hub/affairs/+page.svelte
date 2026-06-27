<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { standings } from '$lib/stores/standings.svelte';

	const playerClubEntry = $derived(standings.getByClub(player.club));

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

	<div class="mb-5 flex items-center gap-4">
		<div
			class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-subtle bg-card text-lg text-primary"
		>
			{player.club.charAt(0).toUpperCase()}
		</div>
		<div>
			<h1 class="text-sm text-primary">{player.club}</h1>
			<p class="mt-0.5 text-[10px] text-subtle">
				Division {player.division} &middot; Week {season.weekNumber}
			</p>
		</div>
	</div>

	{#if playerClubEntry}
		<div class="mb-5 grid grid-cols-3 gap-3">
			<div class="rounded bg-card p-3 text-center">
				<p class="text-base text-primary">{playerClubEntry.played}</p>
				<p class="mt-0.5 text-[9px] text-subtle">PLAYED</p>
			</div>
			<div class="rounded bg-card p-3 text-center">
				<div class="flex min-h-6 items-center justify-center gap-0.5 text-[10px]">
					{#each playerClubEntry.lastFive as r, i (i)}
						<span class={formClass(r)}>{r}</span>
					{/each}
				</div>
				<p class="mt-0.5 text-[9px] text-subtle">FORM</p>
			</div>
			<div class="rounded bg-card p-3 text-center">
				<p
					class="text-base {season.morale >= 7
						? 'text-success'
						: season.morale >= 4
							? 'text-warning'
							: 'text-danger'}"
				>
					{season.morale}/10
				</p>
				<p class="mt-0.5 text-[9px] text-subtle">MORALE</p>
			</div>
			<div class="rounded bg-card p-3 text-center">
				<p class="text-base text-success">{playerClubEntry.won}</p>
				<p class="mt-0.5 text-[9px] text-subtle">WON</p>
			</div>
			<div class="rounded bg-card p-3 text-center">
				<p class="text-base text-warning">{playerClubEntry.drawn}</p>
				<p class="mt-0.5 text-[9px] text-subtle">DRAWN</p>
			</div>
			<div class="rounded bg-card p-3 text-center">
				<p class="text-base text-danger">{playerClubEntry.lost}</p>
				<p class="mt-0.5 text-[9px] text-subtle">LOST</p>
			</div>
			<div class="rounded bg-card p-3 text-center">
				<p class="text-base text-primary">{playerClubEntry.goalsFor}</p>
				<p class="mt-0.5 text-[9px] text-subtle">FOR</p>
			</div>
			<div class="rounded bg-card p-3 text-center">
				<p class="text-base text-primary">{playerClubEntry.goalsAgainst}</p>
				<p class="mt-0.5 text-[9px] text-subtle">AGAINST</p>
			</div>
			<div class="rounded bg-card p-3 text-center">
				<p
					class="text-base {playerClubEntry.goalDifference >= 0
						? 'text-success'
						: 'text-danger'}"
				>
					{playerClubEntry.goalDifference > 0 ? '+' : ''}{playerClubEntry.goalDifference}
				</p>
				<p class="mt-0.5 text-[9px] text-subtle">GD</p>
			</div>
		</div>

		<div class="rounded bg-card p-4">
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
		</div>
	{/if}
</div>
