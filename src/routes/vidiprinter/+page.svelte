<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import VidiprinterLine from '$lib/components/VidiprinterLine.svelte';

	$effect(() => {
		season.phase = 'vidiprinter';
	});

	const fakeScores = [
		{ home: 'FC Midtable Utd', away: 'Athletico Borough', homeScore: 2, awayScore: 1 },
		{ home: 'Real suburban', away: 'Inter City FC', homeScore: 0, awayScore: 0 },
		{ home: 'Sporting Phoenix', away: 'Albion Athletic', homeScore: 3, awayScore: 0 },
		{ home: 'Southside Rangers', away: 'North End Villa', homeScore: 1, awayScore: 2 },
		{ home: 'City Olympians', away: 'County Town', homeScore: 2, awayScore: 2 },
		{ home: 'Port Precision', away: 'Valley Warriors', homeScore: 0, awayScore: 1 },
		{ home: 'Eastside United', away: 'West Ham FC', homeScore: 4, awayScore: 0 },
		{ home: 'Riverside Athletic', away: 'Metro FC', homeScore: 1, awayScore: 1 },
		{ home: 'Stonewall Rovers', away: 'Bay Side', homeScore: 2, awayScore: 3 },
		{ home: 'Grand FC', away: 'Lakeside Town', homeScore: 0, awayScore: 2 }
	];

	let scrollingDone = $state(false);
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col px-4 py-8">
	<h2 class="mb-4 font-pixel text-sm text-primary">Vidiprinter</h2>

	<Card>
		<div class="animate-scroll flex flex-col gap-2" onanimationend={() => (scrollingDone = true)}>
			{#each fakeScores as score (score.home)}
				<VidiprinterLine {...score} />
			{/each}
		</div>
	</Card>

	{#if scrollingDone}
		<div class="mt-auto pt-4">
			<Button onclick={async () => await goto('/hub')}>Continue</Button>
		</div>
	{/if}
</div>

<style>
	@keyframes scroll-up {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(-100%);
		}
	}

	.animate-scroll {
		animation: scroll-up 8s linear forwards;
	}
</style>
