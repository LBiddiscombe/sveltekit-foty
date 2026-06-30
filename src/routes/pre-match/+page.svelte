<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { match } from '$lib/stores/match.svelte';
	import { standings } from '$lib/stores/standings.svelte';
	import { skipGame, getMoraleDelta } from '$lib/match/engine';
	import { saveGame } from '$lib/save';
	import Card from '$lib/components/Card.svelte';
	import DeckCard from '$lib/components/DeckCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { Fixture } from '$lib/types/game';
	import {
		CUP_SCHEDULE,
		CUP_DISPLAY_NAMES,
		CUP_ROUND_NAMES,
		isLeagueCupDedicatedWeek
	} from '$lib/config/cups';

	$effect(() => {
		season.phase = 'pre-match';
		match.reset();
	});

	function ordinal(n: number): string {
		const s = ['th', 'st', 'nd', 'rd'];
		const v = n % 100;
		return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
	}

	function getPlayerCupMatches(): Fixture[] {
		const week = season.weekNumber;
		const cupMatches: Fixture[] = [];

		for (const cupType of ['league-cup', 'fa-cup'] as const) {
			const bracket = cupType === 'league-cup' ? season.leagueCupBracket : season.faCupBracket;
			if (!bracket || bracket.winner) continue;

			const schedule = CUP_SCHEDULE[cupType];
			const roundInfo = schedule.find((r) => r.week === week);
			if (!roundInfo || roundInfo.round !== bracket.currentRound) continue;
			if (player.club in bracket.eliminated) continue;

			const round = bracket.rounds[roundInfo.round - 1];
			if (!round) continue;

			const tie = round.ties.find((t) => t.home === player.club || t.away === player.club);
			if (!tie) continue;

			const isComplete =
				tie.result &&
				(roundInfo.isTwoLeg ? tie.result.homeGoals2 !== undefined : tie.result.winner !== '');
			if (isComplete) continue;

			const opponent = tie.home === player.club ? tie.away : tie.home;

			if (roundInfo.isTwoLeg) {
				const leg1Played = tie.result && tie.result.homeGoals2 === undefined;
				if (!leg1Played) {
					cupMatches.push({ opponent, isHome: tie.home === player.club, weekNumber: week, isCup: true });
				}
				cupMatches.push({ opponent, isHome: tie.away === player.club, weekNumber: week, isCup: true });
			} else {
				cupMatches.push({ opponent, isHome: tie.home === player.club, weekNumber: week, isCup: true });
			}
		}

		return cupMatches;
	}

	const leagueFixtures = $derived(
		season.fixtures.filter((f) => f.weekNumber === season.weekNumber && !f.result)
	);
	const cupFixtures = $derived(getPlayerCupMatches());

	const unplayedFixtures = $derived([...cupFixtures, ...leagueFixtures]);
	const weekFixtureCount = $derived(
		season.fixtures.filter((f) => f.weekNumber === season.weekNumber).length + cupFixtures.length
	);
	const resolvedCount = $derived(weekFixtureCount - unplayedFixtures.length);

	const hasForcedSkip = $derived(season.appearanceSkips > 0);
	const allDone = $derived(unplayedFixtures.length === 0);

	let currentIndex = $state(0);
	let intents = $state<{ fixture: Fixture; skipped: boolean }[]>([]);

	const currentFixture = $derived(unplayedFixtures[currentIndex]);
	const nextChances = $derived(player.deck[currentIndex]);
	const allChosen = $derived(intents.length === unplayedFixtures.length);
	const playedCount = $derived(intents.filter((i) => !i.skipped).length);
	const remainingCards = $derived(player.deck.length - playedCount);

	function isCupFixture(fixture: Fixture): boolean {
		return cupFixtures.some(
			(cf) => cf.opponent === fixture.opponent && cf.weekNumber === fixture.weekNumber
		);
	}

	function getCupRoundLabel(): string {
		const week = season.weekNumber;
		for (const cupType of ['league-cup', 'fa-cup'] as const) {
			const schedule = CUP_SCHEDULE[cupType];
			const roundInfo = schedule.find((r) => r.week === week);
			if (roundInfo) {
				return `${CUP_DISPLAY_NAMES[cupType]} ${CUP_ROUND_NAMES[cupType][roundInfo.round]}`;
			}
		}
		return '';
	}

	function handleForcedSkipChoice() {
		const fixture = currentFixture;
		if (!fixture) return;
		const result = skipGame(0, season.morale, player.club, fixture.opponent, fixture.isHome, fixture.isCup ?? false);
		fixture.result = {
			goalsFor: result.score[0],
			goalsAgainst: result.score[1],
			playerGoals: 0,
			outcomes: []
		};
		season.adjustMorale(getMoraleDelta(result.score));
		season.consumeAppearanceSkip();
		intents = [...intents, { fixture, skipped: true }];
		if (currentIndex < unplayedFixtures.length - 1) {
			currentIndex++;
		}
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
		saveGame();
		await goto('/vidiprinter');
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex shrink-0 items-center justify-between">
		<button
			onclick={async () => await goto('/hub')}
			class="flex items-center gap-1 text-[10px] text-subtle hover:text-primary"
		>
			<span class="text-xs leading-none">&lt;</span> Hub
		</button>
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Pre-Match</span>
	</div>

	<div class="flex flex-1 flex-col items-center justify-center gap-4">
		{#if season.leagueCupBracket && player.club in season.leagueCupBracket.eliminated && isLeagueCupDedicatedWeek(season.weekNumber)}
			<Card>
				<div class="flex flex-col items-center gap-2 py-4 text-center">
					<span class="font-pixel text-xs text-danger"
						>You're out of the League Cup — enjoy your week off.</span
					>
				</div>
			</Card>
		{/if}

		{#if season.faCupBracket && player.club in season.faCupBracket.eliminated && CUP_SCHEDULE['fa-cup'].some((r) => r.week === season.weekNumber)}
			<Card>
				<div class="flex flex-col items-center gap-2 py-4 text-center">
					<span class="font-pixel text-xs text-danger"
						>You're already out of the FA Cup. No cup match this week.</span
					>
				</div>
			</Card>
		{/if}

		{#if allDone}
			<Card>
				<div class="flex flex-col items-center gap-2 py-4 text-center">
					<span class="font-pixel text-sm text-primary">All Matches Resolved</span>
					<span class="font-pixel text-xs text-subtle"
						>All matches for this week have been resolved.</span
					>
				</div>
			</Card>
		{:else if player.deck.length === 0}
			<Card>
				<div class="flex flex-col items-center gap-2 py-4 text-center">
					<span class="font-pixel text-sm text-subtle">
						No cards in your deck — all matches this week will be simulated.
					</span>
					<span class="font-pixel text-xs text-subtle"
						>Visit the Shop between weeks to buy more.</span
					>
				</div>
			</Card>
		{:else if !allChosen && currentFixture}
			<div class="flex flex-col items-center gap-4">
				<p class="font-pixel text-xs text-subtle">
					Game {resolvedCount + currentIndex + 1} of {weekFixtureCount}
				</p>

				<Card>
					<div class="flex flex-col items-center gap-1 py-2 text-center">
						<span class="font-pixel text-xs text-subtle"
							>{currentFixture.isHome ? 'HOME' : 'AWAY'}</span
						>
						<span class="font-pixel text-lg text-primary">
							{currentFixture.opponent}
							<span class="text-subtle">
								{isCupFixture(currentFixture)
									? getCupRoundLabel()
									: `(${ordinal(standings.getPosition(currentFixture.opponent))})`}
							</span>
						</span>
					</div>
				</Card>

				{#if hasForcedSkip}
					<Card>
						<div class="flex flex-col items-center gap-2 py-4 text-center">
							<span class="font-pixel text-sm text-primary">
								You are unavailable &mdash; forced to miss this match ({season.appearanceSkips} remaining)
							</span>
							<span class="font-pixel text-xs text-subtle">The team will play without you.</span>
						</div>
					</Card>
				{:else if nextChances === undefined}
					<Card>
						<div class="flex flex-col items-center gap-2 py-4 text-center">
							<span class="font-pixel text-sm text-subtle">
								No cards left in your deck for this game.
							</span>
							<span class="font-pixel text-xs text-subtle">The match will be simulated.</span>
						</div>
					</Card>
				{:else}
					<Card>
						<DeckCard chances={nextChances} remaining={remainingCards} />
					</Card>
				{/if}
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
		{/if}
	</div>

	<div class="mt-auto shrink-0">
		{#if allDone}
			<Button onclick={handleAllResolved}>Continue</Button>
		{:else if player.deck.length === 0}
			<Button
				onclick={() => {
					intents = unplayedFixtures.map((f) => ({ fixture: f, skipped: true }));
					match.setGames(intents);
					goto('/match');
				}}
			>
				Continue
			</Button>
		{:else if !allChosen && currentFixture && hasForcedSkip}
			<Button onclick={handleForcedSkipChoice}>Skip Match</Button>
		{:else if !allChosen && currentFixture && nextChances === undefined}
			<Button onclick={() => handleChoice(true)}>Skip Match</Button>
		{:else if !allChosen && currentFixture}
			<div class="flex w-full flex-col gap-3">
				<Button onclick={() => handleChoice(false)}>Play</Button>
				<Button variant="secondary" onclick={() => handleChoice(true)}>Skip</Button>
			</div>
		{:else if allChosen}
			<Button onclick={handleContinue}>Continue</Button>
		{/if}
	</div>
</div>
