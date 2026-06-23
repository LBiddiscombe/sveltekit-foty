<script lang="ts">
	import { goto } from '$app/navigation';
	import { player } from '$lib/stores/player.svelte';
	import { getLevel, getNextLevelXp } from '$lib/config/levels';
	import Card from '$lib/components/Card.svelte';

	const level = $derived(getLevel(player.careerXp));
	const nextXp = $derived(getNextLevelXp(player.careerXp));
	const currentLevelXp = $derived(level.minXp);

	const xpProgress = $derived(
		nextXp !== null && nextXp > currentLevelXp
			? ((player.careerXp - currentLevelXp) / (nextXp - currentLevelXp)) * 100
			: 100
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
		<h2 class="font-pixel text-sm text-primary">Player Status</h2>
	</div>

	<Card>
		<div class="flex flex-col items-center gap-2 text-center">
			<div
				class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-subtle bg-dark"
			>
				<span class="font-pixel text-lg text-primary">
					{player.name.charAt(0).toUpperCase()}
				</span>
			</div>
			<h3 class="font-pixel text-sm text-primary">{player.name}</h3>
			<p class="font-pixel text-xs text-subtle">
				{player.club} — Div {player.division}
			</p>
			<p class="font-pixel text-xs text-subtle">Age {player.age}</p>
		</div>
	</Card>

	<Card>
		<h4 class="mb-3 font-pixel text-xs text-primary">Level</h4>
		<p class="font-pixel text-sm text-success">{level.title}</p>
		<div class="mt-2 h-3 overflow-hidden rounded-full bg-dark">
			<div
				class="h-full rounded-full bg-success transition-all"
				style="width: {Math.min(xpProgress, 100)}%"
			></div>
		</div>
		<div class="mt-1 flex justify-between font-pixel text-[10px] text-subtle">
			<span>XP: {player.careerXp}</span>
			{#if nextXp !== null}
				<span>Next: {nextXp}</span>
			{:else}
				<span>MAX</span>
			{/if}
		</div>
	</Card>

	<Card>
		<div class="grid grid-cols-2 gap-4 text-center">
			<div>
				<p class="font-pixel text-lg text-primary">{player.goals}</p>
				<p class="font-pixel text-xs text-subtle">Goals</p>
			</div>
			<div>
				<p class="font-pixel text-lg text-primary">{player.appearances}</p>
				<p class="font-pixel text-xs text-subtle">Apps</p>
			</div>
		</div>
		<div class="mt-3 text-center">
			<p class="font-pixel text-xs text-subtle">Weekly wage: £{player.wage}</p>
		</div>
	</Card>

	{#if player.matchXpHistory.length > 0}
		<Card>
			<h4 class="mb-2 font-pixel text-xs text-primary">Recent Form (XP)</h4>
			<div class="flex gap-2 font-pixel text-xs">
				{#each player.matchXpHistory as xp, i}
					<div
						class="flex h-8 w-8 items-center justify-center rounded {xp >= 10
							? 'bg-success text-dark'
							: xp >= 5
								? 'bg-warning text-dark'
								: 'bg-danger text-dark'}"
					>
						{xp}
					</div>
				{/each}
			</div>
		</Card>
	{/if}
</div>
