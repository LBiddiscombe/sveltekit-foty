<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { match } from '$lib/stores/match.svelte';
	import { standings } from '$lib/stores/standings.svelte';
	import { skipGame, getMoraleDelta } from '$lib/match/engine';
	import Card from '$lib/components/Card.svelte';
	import DeckCard from '$lib/components/DeckCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { Fixture } from '$lib/types/game';

	$effect(() => {
		season.phase = 'pre-match';
		match.reset();
	});

	function ordinal(n: number): string {
		const s = ['th', 'st', 'nd', 'rd'];
		const v = n % 100;
		return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
	}

	const unplayedFixtures = $derived(
		season.fixtures.filter((f) => f.weekNumber === season.weekNumber && !f.result)
	);

	const hasForcedSkip = $derived(season.appearanceSkips > 0);
	const allDone = $derived(unplayedFixtures.length === 0);

	let currentIndex = $state(0);
	let intents = $state<{ fixture: Fixture; skipped: boolean }[]>([]);

	const currentFixture = $derived(unplayedFixtures[currentIndex]);
	const nextChances = $derived(player.deck[currentIndex] ?? 1);
	const allChosen = $derived(intents.length === unplayedFixtures.length);

	function handleForcedSkip() {
		const next = season.fixtures.find(
			(f) => f.weekNumber === season.weekNumber && !f.result
		);
		if (!next) return;
		const result = skipGame(0, season.morale);
		next.result = {
			goalsFor: result.score[0],
			goalsAgainst: result.score[1],
			playerGoals: 0,
			outcomes: []
		};
		season.adjustMorale(getMoraleDelta(result.score, 0));
		season.consumeAppearanceSkip();
	}

	function handleChoice(skipped: boolean) {
		const fixture = currentFixture;
		if (!fixture) return;
		intents = [...intents, { fixture, skipped }];
		if (currentIndex < unplayedFixtures.length - 1) {
			currentIndex++;
		}
	}

	async function handleContinue() {
		match.setGames(intents);
		await goto('/match');
	}

	async function handleAllResolved() {
		await goto('/vidiprinter');
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-4">
	<h2 class="font-pixel text-sm text-primary">Pre-Match</h2>

	{#if hasForcedSkip}
		<Card>
			<div class="flex flex-col items-center gap-2 py-4 text-center">
				<span class="font-pixel text-sm text-primary">
					You are unavailable — forced to miss this match
					({season.appearanceSkips} remaining)
				</span>
				<span class="font-pixel text-xs text-subtle">The team will play without you.</span>
			</div>
		</Card>

		<Button onclick={handleForcedSkip}>Continue</Button>
	{:else if allDone}
		<Card>
			<div class="flex flex-col items-center gap-2 py-4 text-center">
				<span class="font-pixel text-sm text-primary">All Matches Resolved</span>
				<span class="font-pixel text-xs text-subtle">All matches for this week have been resolved.</span>
			</div>
		</Card>

		<Button onclick={handleAllResolved}>Continue</Button>
	{:else if player.deck.length === 0}
		<Card>
			<div class="flex flex-col items-center gap-2 py-4 text-center">
				<span class="font-pixel text-sm text-subtle">
					No cards in your deck — all matches this week will be simulated.
				</span>
				<span class="font-pixel text-xs text-subtle">Visit the Shop between weeks to buy more.</span
				>
			</div>
		</Card>

		<Button
			onclick={() => {
				intents = unplayedFixtures.map((f) => ({ fixture: f, skipped: true }));
				match.setGames(intents);
				goto('/match');
			}}
		>
			Continue
		</Button>
	{:else if !allChosen && currentFixture}
		<p class="font-pixel text-xs text-subtle">
			Game {currentIndex + 1} of {unplayedFixtures.length}
		</p>

		<Card>
			<div class="flex flex-col items-center gap-1 py-2 text-center">
				<span class="font-pixel text-xs text-subtle">{currentFixture.isHome ? 'HOME' : 'AWAY'}</span
				>
					<span class="font-pixel text-lg text-primary">
					{currentFixture.opponent}
					<span class="text-subtle">({ordinal(standings.getPosition(currentFixture.opponent))})</span>
				</span>
			</div>
		</Card>

		<Card>
			<DeckCard chances={nextChances} />
		</Card>

		<div class="flex w-full flex-col gap-3">
			<Button onclick={() => handleChoice(false)}>Play</Button>
			<Button variant="secondary" onclick={() => handleChoice(true)}>Skip</Button>
		</div>
	{:else if allChosen}
		<Card>
			<div class="flex flex-col items-center gap-2 py-4 text-center">
				<span class="font-pixel text-sm text-primary">All Set</span>
				<span class="font-pixel text-xs text-subtle">
					{unplayedFixtures.length} game{unplayedFixtures.length !== 1 ? 's' : ''} ready
				</span>
			</div>
		</Card>

		<Button onclick={handleContinue}>Continue</Button>
	{/if}
</div>
