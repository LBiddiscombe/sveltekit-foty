<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { saveGame } from '$lib/save';
	import { XP_CONFIG } from '$lib/config/xp';

	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { EndSeasonResult } from '$lib/stores/season.svelte';

	$effect(() => {
		season.phase = 'season-review';
	});

	const oldDivision = player.division;
	const oldSeasonNumber = season.seasonNumber;
	const result: EndSeasonResult = season.endSeason(player.club, oldDivision);

	player.division = result.newDivision;
	player.addSeasonCards();
	if (result.playerInPromoted) {
		player.addXp(XP_CONFIG.promotion);
		const promotionBonus = player.wage * 15;
		player.adjustBalance(promotionBonus);
	}

	const seasonStats = season.getStatsSinceSnapshot(
		player.goals,
		player.appearances,
		player.careerXp
	);
	const playerPosition = result.finalStandings.findIndex((s) => s.club === player.club) + 1;
	player.archiveCurrentStats(oldSeasonNumber, oldDivision, playerPosition);

	function statusText(): string {
		if (result.playerInPromoted) return 'PROMOTED!';
		if (result.playerInRelegated) return 'RELEGATED';
		return 'MID-TABLE';
	}

	function statusClass(): string {
		if (result.playerInPromoted) return 'text-success';
		if (result.playerInRelegated) return 'text-danger';
		return 'text-warning';
	}

	function divisionName(d: number): string {
		return `Division ${d}`;
	}

	function onContinue() {
		inbox.addSeasonNews(
			season.seasonNumber,
			player.club,
			result.newDivision,
			result.playerInPromoted,
			result.playerInRelegated
		);
		saveGame();
		goto(resolve('/hub'));
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col px-4 py-8">
	<h2 class="mb-4 font-pixel text-sm text-primary">Season {season.seasonNumber - 1} Review</h2>

	<Card>
		<h4 class="mb-2 font-pixel text-xs text-primary">Your Season</h4>
		<div class="flex flex-col gap-1 font-pixel text-[10px] text-subtle">
			<p>Club: <span class="text-primary">{player.club}</span></p>
			<p>
				Finished: <span class={statusClass()}>{statusText()}</span>
			</p>
			<p>New Division: <span class="text-primary">{divisionName(result.newDivision)}</span></p>
			<p>Goals: <span class="text-primary">{seasonStats.goals}</span></p>
			<p>Appearances: <span class="text-primary">{seasonStats.appearances}</span></p>
			<p>XP Earned: <span class="text-primary">+{seasonStats.xpEarned}</span></p>
			{#if result.playerInPromoted}
				<p>Promotion Bonus: <span class="text-success">+{XP_CONFIG.promotion} XP</span></p>
				<p>Season Bonus: <span class="text-success">+£{player.wage * 15}</span></p>
			{/if}
		</div>
	</Card>

	{#if result.myDivisionPromoted.length > 0 || result.myDivisionRelegated.length > 0}
		<Card>
			<h4 class="mb-2 font-pixel text-xs text-primary">Division {oldDivision} Movements</h4>
			<div class="flex flex-col gap-1 font-pixel text-[10px] text-subtle">
				{#if result.myDivisionPromoted.length > 0}
					<p class="text-success">Promoted: {result.myDivisionPromoted.join(', ')}</p>
				{/if}
				{#if result.myDivisionRelegated.length > 0}
					<p class="text-danger">Relegated: {result.myDivisionRelegated.join(', ')}</p>
				{/if}
			</div>
		</Card>
	{/if}

	<Card>
		<h4 class="mb-2 font-pixel text-xs text-primary">Final Standings</h4>
		<div class="flex flex-col gap-0.5">
			<div class="flex items-center gap-2 font-pixel text-[10px] text-subtle">
				<span class="w-6 text-center">Pos</span>
				<span class="flex-1">Club</span>
				<span class="w-6 text-center">P</span>
				<span class="w-8 text-center">Pts</span>
			</div>
			{#each result.finalStandings as entry, i (entry.club)}
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

	<div class="mt-6">
		<Button onclick={onContinue}>Continue to New Season</Button>
	</div>
</div>
