<script lang="ts">
	import { goto } from '$app/navigation';
	import { player } from '$lib/stores/player.svelte';
	import { LEVELS, getLevel, getLevelIndex, getNextLevelXp } from '$lib/config/levels';

	const level = $derived(getLevel(player.careerXp));
	const nextXp = $derived(getNextLevelXp(player.careerXp));
	const currentLevelXp = $derived(level.minXp);
	const currentLevelIndex = $derived(getLevelIndex(player.careerXp));
	const nextLevel = $derived(LEVELS[currentLevelIndex + 1] ?? null);
	const xpProgress = $derived(
		nextXp !== null && nextXp > currentLevelXp
			? ((player.careerXp - currentLevelXp) / (nextXp - currentLevelXp)) * 100
			: 100
	);
</script>

<div class="mx-auto min-h-dvh max-w-md bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex items-center justify-between">
		<button
			onclick={async () => await goto('/hub')}
			class="flex items-center gap-1 text-[10px] text-subtle hover:text-primary"
		>
			<span class="text-xs leading-none">&lt;</span> Hub
		</button>
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Player Status</span>
	</div>

	<div class="mb-5 flex items-center gap-4">
		<div
			class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-subtle bg-card text-lg text-primary"
		>
			{player.name.charAt(0).toUpperCase()}
		</div>
		<div>
			<h1 class="text-sm text-primary">{player.name}</h1>
			<p class="mt-0.5 text-[10px] text-subtle">
				{player.club} · Div {player.division} · Age {player.age}
			</p>
		</div>
	</div>

	<div class="mb-5 grid grid-cols-3 gap-3">
		<div class="rounded  bg-card p-3 text-center">
			<p class="text-base text-primary">{player.goals}</p>
			<p class="mt-0.5 text-[9px] text-subtle">GOALS</p>
		</div>
		<div class="rounded  bg-card p-3 text-center">
			<p class="text-base text-primary">{player.appearances}</p>
			<p class="mt-0.5 text-[9px] text-subtle">APPS</p>
		</div>
		<div class="rounded  bg-card p-3 text-center">
			<p class="text-base text-success">£{player.wage}</p>
			<p class="mt-0.5 text-[9px] text-subtle">WAGE</p>
		</div>
	</div>

	<div class="mb-5 rounded  bg-card p-4">
		<div class="flex items-baseline justify-between">
			<span class="text-[10px] text-subtle">{level.title}</span>
			{#if nextLevel !== null}
				<span class="text-[9px] text-subtle">Next: {nextLevel.title}</span>
			{:else}
				<span class="text-[9px] text-success">MAX LEVEL</span>
			{/if}
		</div>
		<div class="mb-1 mt-2 h-2 overflow-hidden rounded-full bg-dark">
			<div
				class="h-full rounded-full bg-success transition-all"
				style="width: {Math.min(xpProgress, 100)}%"
			></div>
		</div>
		<div class="flex justify-between text-[9px] text-subtle">
			<span>{player.careerXp} XP</span>
			<span>{nextXp !== null ? `${nextXp} XP` : 'MAX'}</span>
		</div>
	</div>

	<div class="mb-5 rounded  bg-card p-4">
		<div class="flex items-center justify-between">
			<span class="text-[10px] text-subtle">Bank Balance</span>
			<span class="text-sm text-success">£{player.bankBalance.toLocaleString()}</span>
		</div>
	</div>

	{#if player.matchXpHistory.length > 0}
		<div class="rounded  bg-card p-4">
			<h2 class="mb-3 text-[10px] text-subtle">RECENT FORM</h2>
			<div class="flex items-end gap-2" style="height: 48px">
				{#each player.matchXpHistory as xp, i (i)}
					<div class="flex flex-1 flex-col items-center justify-end">
						<div
							class="w-full rounded-sm {xp >= 10
								? 'bg-success'
								: xp >= 5
									? 'bg-warning'
									: 'bg-danger'}"
							style="height: {Math.max(xp * 3, 6)}px"
						></div>
						<span class="mt-1 text-[9px] text-subtle">{xp}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
