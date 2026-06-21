<script lang="ts">
	import { goto } from '$app/navigation';
	import { player } from '$lib/stores/player.svelte';
	import { season } from '$lib/stores/season.svelte';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { DIVISION_4_CLUBS } from '$lib/config/teams';
	import { generatePlayerFixtures } from '$lib/config/fixtures';

	async function selectClub(club: string) {
		player.club = club;
		player.division = 4;
		season.fixtures = generatePlayerFixtures(club, DIVISION_4_CLUBS);
		inbox.init(club);
		await goto('/hub');
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-8">
	<h2 class="font-pixel text-sm text-primary">Choose your club</h2>
	<p class="font-pixel text-xs text-subtle">Division 4</p>

	<div class="flex flex-col gap-2">
		{#each DIVISION_4_CLUBS as club (club)}
			<button
				onclick={() => selectClub(club)}
				class="flex w-full items-center border border-subtle bg-card px-4 py-3 text-left font-pixel text-xs text-primary transition-colors hover:border-primary"
			>
				{club}
			</button>
		{/each}
	</div>
</div>
