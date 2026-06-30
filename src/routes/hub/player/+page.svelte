<script lang="ts">
	import { goto } from '$app/navigation';
	import { player } from '$lib/stores/player.svelte';
	import { season } from '$lib/stores/season.svelte';
	import { LEVELS, getLevel, getLevelIndex, getNextLevelXp } from '$lib/config/levels';

	const currentSeason = $derived({
		chances: player.chances - player.statsChancesAtStart,
		saves: player.saves - player.statsSavesAtStart,
		misses: player.misses - player.statsMissesAtStart,
		goals: player.goals - player.statsGoalsAtStart,
		appearances: player.appearances - player.statsAppsAtStart,
		xp: player.careerXp - player.statsXpAtStart
	});

	const archiveTotal = $derived(
		player.statsArchive.reduce(
			(acc, e) => ({
				chances: acc.chances + e.chances,
				saves: acc.saves + e.saves,
				misses: acc.misses + e.misses,
				goals: acc.goals + e.goals,
				appearances: acc.appearances + e.appearances,
				xp: acc.xp + e.xpEarned
			}),
			{ chances: 0, saves: 0, misses: 0, goals: 0, appearances: 0, xp: 0 }
		)
	);

	const careerTotal = $derived({
		chances: archiveTotal.chances + currentSeason.chances,
		saves: archiveTotal.saves + currentSeason.saves,
		misses: archiveTotal.misses + currentSeason.misses,
		goals: archiveTotal.goals + currentSeason.goals,
		appearances: archiveTotal.appearances + currentSeason.appearances,
		xp: archiveTotal.xp + currentSeason.xp
	});

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

	<div class="mb-5 rounded bg-card p-4">
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

	<div class="mb-5 grid grid-cols-2 gap-3">
		<div class="rounded bg-card p-3 text-center">
			<p class="text-base text-primary">{currentSeason.appearances}</p>
			<p class="mt-0.5 text-[9px] text-subtle">APPS</p>
		</div>
		<div class="rounded bg-card p-3 text-center">
			<p class="text-base text-primary">{currentSeason.goals}</p>
			<p class="mt-0.5 text-[9px] text-subtle">GOALS</p>
		</div>
	</div>

	<div class="mb-5 grid grid-cols-2 gap-3">
		<div class="rounded bg-card p-3 text-center">
			<p class="text-sm text-success">£{player.bankBalance.toLocaleString()}</p>
			<p class="mt-0.5 text-[9px] text-subtle">BALANCE</p>
		</div>
		<div class="rounded bg-card p-3 text-center">
			<p class="text-sm text-success">£{player.wage}</p>
			<p class="mt-0.5 text-[9px] text-subtle">WAGE</p>
		</div>
	</div>

	{#if player.matchXpHistory.length > 0}
		<div class="rounded bg-card p-4">
			<h2 class="mb-3 text-[10px] text-subtle">RECENT FORM</h2>
			<div class="flex items-end gap-2" style="height: 48px">
				{#each player.matchXpHistory as xp, i (i)}
					<div class="flex flex-1 flex-col items-center justify-end">
						<div
							class="w-full rounded-sm {xp >= 4
								? 'bg-success'
								: xp >= 2
									? 'bg-warning'
									: 'bg-danger'}"
							style="height: {(xp + 1) * 3}px"
						></div>
						<span class="mt-1 text-[9px] text-subtle">{xp}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="mt-5 rounded bg-card p-4">
		<h2 class="mb-4 text-[10px] text-subtle">CAREER STATS</h2>

		<h3 class="mb-2 text-[9px] text-subtle">
			{player.club} · Season {season.seasonNumber} (in progress)
		</h3>
		<div class="mb-4 grid grid-cols-6 gap-1 text-center text-[9px]">
			<span class="text-subtle">APP</span>
			<span class="text-subtle">CHN</span>
			<span class="text-subtle">GLS</span>
			<span class="text-subtle">SVD</span>
			<span class="text-subtle">MSS</span>
			<span class="text-subtle">XP</span>
			<span class="text-primary">{currentSeason.appearances}</span>
			<span class="text-primary">{currentSeason.chances}</span>
			<span class="text-success">{currentSeason.goals}</span>
			<span class="text-warning">{currentSeason.saves}</span>
			<span class="text-danger">{currentSeason.misses}</span>
			<span class="text-warning">+{currentSeason.xp}</span>
			<span></span>
			<span></span>
			<span class="text-success"
				>{currentSeason.chances > 0
					? Math.round((currentSeason.goals / currentSeason.chances) * 100) + '%'
					: ''}</span
			>
			<span class="text-warning"
				>{currentSeason.chances > 0
					? Math.round((currentSeason.saves / currentSeason.chances) * 100) + '%'
					: ''}</span
			>
			<span class="text-danger"
				>{currentSeason.chances > 0
					? Math.round((currentSeason.misses / currentSeason.chances) * 100) + '%'
					: ''}</span
			>
			<span></span>
		</div>

		{#if player.statsArchive.length > 0}
			<h3 class="mb-2 text-[9px] text-subtle">SEASON HISTORY</h3>
			<div class="mb-4 flex flex-col gap-2">
				{#each [...player.statsArchive].reverse() as entry, i (i)}
					<div class="rounded bg-dark p-2 text-[9px]">
						<div class="mb-1 flex items-center gap-2">
							<span class="text-subtle">S{entry.seasonNumber}</span>
							<span class="text-primary">{entry.club}</span>
							<span class="text-subtle">Div {entry.division}</span>
							{#if entry.finalPosition !== null}
								<span class="ml-auto text-subtle"
									>{entry.finalPosition}{entry.finalPosition === 1
										? 'st'
										: entry.finalPosition === 2
											? 'nd'
											: entry.finalPosition === 3
												? 'rd'
												: 'th'}</span
								>
							{:else}
								<span class="ml-auto text-subtle">-</span>
							{/if}
						</div>
						<div class="grid grid-cols-6 gap-1 text-center">
							<span class="text-subtle">APP</span>
							<span class="text-subtle">CHN</span>
							<span class="text-subtle">GLS</span>
							<span class="text-subtle">SVD</span>
							<span class="text-subtle">MSS</span>
							<span class="text-subtle">XP</span>
							<span class="text-primary">{entry.appearances}</span>
							<span class="text-primary">{entry.chances}</span>
							<span class="text-success">{entry.goals}</span>
							<span class="text-warning">{entry.saves}</span>
							<span class="text-danger">{entry.misses}</span>
							<span class="text-warning">+{entry.xpEarned}</span>
							<span></span>
							<span></span>
							<span class="text-success"
								>{entry.chances > 0
									? Math.round((entry.goals / entry.chances) * 100) + '%'
									: ''}</span
							>
							<span class="text-warning"
								>{entry.chances > 0
									? Math.round((entry.saves / entry.chances) * 100) + '%'
									: ''}</span
							>
							<span class="text-danger"
								>{entry.chances > 0
									? Math.round((entry.misses / entry.chances) * 100) + '%'
									: ''}</span
							>
							<span></span>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<h3 class="mb-2 text-[9px] text-subtle">CAREER TOTALS</h3>
		<div class="grid grid-cols-6 gap-1 text-center text-[9px]">
			<span class="text-subtle">APP</span>
			<span class="text-subtle">CHN</span>
			<span class="text-subtle">GLS</span>
			<span class="text-subtle">SVD</span>
			<span class="text-subtle">MSS</span>
			<span class="text-subtle">XP</span>
			<span class="text-primary">{careerTotal.appearances}</span>
			<span class="text-primary">{careerTotal.chances}</span>
			<span class="text-success">{careerTotal.goals}</span>
			<span class="text-warning">{careerTotal.saves}</span>
			<span class="text-danger">{careerTotal.misses}</span>
			<span class="text-warning">+{careerTotal.xp}</span>
			<span></span>
			<span></span>
			<span class="text-success"
				>{careerTotal.chances > 0
					? Math.round((careerTotal.goals / careerTotal.chances) * 100) + '%'
					: ''}</span
			>
			<span class="text-warning"
				>{careerTotal.chances > 0
					? Math.round((careerTotal.saves / careerTotal.chances) * 100) + '%'
					: ''}</span
			>
			<span class="text-danger"
				>{careerTotal.chances > 0
					? Math.round((careerTotal.misses / careerTotal.chances) * 100) + '%'
					: ''}</span
			>
			<span></span>
		</div>
	</div>
</div>
