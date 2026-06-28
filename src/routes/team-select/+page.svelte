<script lang="ts">
	import { goto } from '$app/navigation';
	import { player } from '$lib/stores/player.svelte';
	import { season } from '$lib/stores/season.svelte';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { standings } from '$lib/stores/standings.svelte';
	import { getClubsByDivision } from '$lib/config/clubs';
	import { deriveFixturesFromSchedule } from '$lib/config/fixtures';
	import { generateDivisionSchedule } from '$lib/config/schedule';
	import { getLeagueWeeks } from '$lib/config/cups';

	const div4Clubs = getClubsByDivision(4).map((c) => c.name);

	async function selectClub(club: string) {
		player.club = club;
		player.division = 4;
		const leagueWeeks = getLeagueWeeks();
		const schedule = generateDivisionSchedule(4, div4Clubs, leagueWeeks);
		season.fixtures = deriveFixturesFromSchedule(club, schedule);
		season.divisionSchedule = schedule;
		standings.init(div4Clubs);
		season.recordStatsSnapshot(0, 0, 0, 0, 0, 0);
		season.initCupBrackets();
		inbox.init(club);
		await goto('/hub');
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-8">
	<h2 class="font-pixel text-sm text-primary">Choose your club</h2>
	<p class="font-pixel text-xs text-subtle">Division 4</p>

	<div class="flex flex-col gap-2">
		{#each div4Clubs as club (club)}
			<button
				onclick={() => selectClub(club)}
				class="flex w-full items-center border border-subtle bg-card px-4 py-3 text-left font-pixel text-xs text-primary transition-colors hover:border-primary"
			>
				{club}
			</button>
		{/each}
	</div>
</div>
