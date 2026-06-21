<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import Card from '$lib/components/Card.svelte';
	import { MORALE_CONFIG } from '$lib/config/morale';

	const moraleBar = $derived(
		((season.morale - MORALE_CONFIG.scale.min) /
			(MORALE_CONFIG.scale.max - MORALE_CONFIG.scale.min)) *
			100
	);
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

	<Card>
		<div class="grid grid-cols-2 gap-4 text-center">
			<div>
				<p class="font-pixel text-lg text-primary">{player.goals}</p>
				<p class="font-pixel text-xs text-subtle">Goals scored</p>
			</div>
			<div>
				<p class="font-pixel text-lg text-primary">{player.appearances}</p>
				<p class="font-pixel text-xs text-subtle">Appearances</p>
			</div>
		</div>
	</Card>

	<Card>
		<p class="font-pixel text-xs text-subtle">Games played: {season.gamesPlayed}</p>
		<p class="mt-1 font-pixel text-xs text-subtle">League position: — (fixtures placeholder)</p>
	</Card>
</div>
