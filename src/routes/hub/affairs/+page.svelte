<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { standings } from '$lib/stores/standings.svelte';
	import { MORALE_CONFIG } from '$lib/config/morale';
	import { getLevel } from '$lib/config/levels';
	import Card from '$lib/components/Card.svelte';

	const moraleBar = $derived(
		((season.morale - MORALE_CONFIG.scale.min) /
			(MORALE_CONFIG.scale.max - MORALE_CONFIG.scale.min)) *
			100
	);

	const playerClubEntry = $derived(standings.getByClub(player.club));
	const playerPosition = $derived(standings.getPosition(player.club));
	const playerLevel = $derived(getLevel(player.careerXp));

	function formClass(r: string): string {
		if (r === 'W') return 'text-success';
		if (r === 'D') return 'text-warning';
		return 'text-danger';
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-8">
	<div class="flex items-center gap-4">
		<button
			onclick={async () => await goto('/hub')}
			class="font-pixel text-xs text-subtle hover:text-primary"
		>
			← Hub
		</button>
		<h2 class="font-pixel text-sm text-primary">State of Affairs</h2>
	</div>

	<Card>
		<h4 class="mb-3 font-pixel text-xs text-primary">{player.club}</h4>
		<p class="font-pixel text-xs text-subtle">
			Division {player.division} — Week {season.weekNumber}
		</p>
	</Card>

	<Card>
		<div class="flex items-center justify-between">
			<h4 class="font-pixel text-xs text-primary">Team Morale</h4>
			<span
				class="font-pixel text-xs {season.morale >= 7
					? 'text-success'
					: season.morale >= 4
						? 'text-warning'
						: 'text-danger'}"
			>
				{season.morale}/10
			</span>
		</div>
		<div class="mt-2 h-3 overflow-hidden rounded-full bg-dark">
			<div
				class="h-full rounded-full transition-all {season.morale >= 7
					? 'bg-success'
					: season.morale >= 4
						? 'bg-warning'
						: 'bg-danger'}"
				style="width: {moraleBar}%"
			></div>
		</div>
	</Card>

	{#if playerClubEntry}
		<Card>
			<h4 class="mb-2 font-pixel text-xs text-primary">League Standings</h4>
			<div class="mb-3 rounded border border-subtle bg-dark p-2">
				<div class="flex items-center gap-2 font-pixel text-xs">
					<span class="w-6 text-center text-warning">#{playerPosition}</span>
					<span class="flex-1 text-primary">{player.club}</span>
					<span class="w-6 text-center text-subtle">{playerClubEntry.played}</span>
					<span class="w-6 text-center text-subtle">{playerClubEntry.won}</span>
					<span class="w-6 text-center text-subtle">{playerClubEntry.drawn}</span>
					<span class="w-6 text-center text-subtle">{playerClubEntry.lost}</span>
					<span class="w-6 text-center text-subtle">{playerClubEntry.goalsFor}</span>
					<span class="w-6 text-center text-subtle">{playerClubEntry.goalsAgainst}</span>
					<span class="w-6 text-center text-subtle">{playerClubEntry.goalDifference}</span>
					<span class="w-8 text-center font-bold text-primary">{playerClubEntry.points}</span>
				</div>
				<div class="mt-1 flex gap-1 font-pixel text-[10px]">
					{#each playerClubEntry.lastFive as r}
						<span class={formClass(r)}>{r}</span>
					{/each}
				</div>
			</div>

			<div class="flex flex-col gap-0.5">
				<div class="flex items-center gap-2 font-pixel text-[10px] text-subtle">
					<span class="w-6 text-center">Pos</span>
					<span class="flex-1">Club</span>
					<span class="w-6 text-center">P</span>
					<span class="w-8 text-center">Pts</span>
				</div>
				{#each standings.entries as entry, i}
					<div
						class="flex items-center gap-2 font-pixel text-[10px] {entry.club === player.club
							? 'text-primary bg-dark rounded px-0 py-0.5'
							: 'text-subtle'}"
					>
						<span class="w-6 text-center">{i + 1}</span>
						<span class="flex-1 truncate">{entry.club}</span>
						<span class="w-6 text-center">{entry.played}</span>
						<span class="w-8 text-center font-bold">{entry.points}</span>
					</div>
				{/each}
			</div>
		</Card>
	{/if}

	<Card>
		<h4 class="mb-2 font-pixel text-xs text-primary">Player Progression</h4>
		<p class="font-pixel text-xs text-subtle">Current level: {playerLevel.title}</p>
		<p class="font-pixel text-xs text-subtle">Total XP: {player.careerXp}</p>
	</Card>
</div>
