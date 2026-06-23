<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { season } from '$lib/stores/season.svelte';
	import { incidentCardById } from '$lib/config/incidents';
	import type { IncidentOutcome } from '$lib/types/game';
	import { saveGame } from '$lib/save';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	const inboxId = $derived(Number($page.url.searchParams.get('inboxId')));
	const item = $derived(inbox.items.find((i) => i.id === inboxId));
	const card = $derived(item?.incidentCardId ? incidentCardById(item.incidentCardId) : undefined);

	type TickerState = 'spinning' | 'decelerating' | 'stopped';

	function formatEffects(outcome: IncidentOutcome): string {
		if (outcome.effects.length === 0) return '—';
		const parts = outcome.effects.map((e) => {
			if (e.type === 'bankBalance') return `${e.delta > 0 ? '+' : ''}£${e.delta}`;
			if (e.type === 'morale') return `Morale ${e.delta > 0 ? '+' : ''}${e.delta}`;
			if (e.type === 'xp') return `XP ${e.delta > 0 ? '+' : ''}${e.delta}`;
			return '';
		});
		return parts.join(', ');
	}
	let tickerState = $state<TickerState>('spinning');
	let currentIndex = $state(0);
	let result: IncidentOutcome | null = $state(null);
	let intervalId: ReturnType<typeof setInterval> | undefined = $state(undefined);

	function advance() {
		if (!card) return;
		currentIndex = (currentIndex + 1) % card.outcomes.length;
	}

	function startSpinning() {
		tickerState = 'spinning';
		intervalId = setInterval(advance, 100);
	}

	function stop() {
		if (tickerState !== 'spinning' || !card) return;
		if (intervalId) clearInterval(intervalId);

		const outcomes = card.outcomes;
		tickerState = 'decelerating';
		const delays = [150, 250, 400, 700, 1200];

		function decelerate(step: number) {
			if (step >= delays.length) {
				result = outcomes[currentIndex];
				tickerState = 'stopped';
				return;
			}
			setTimeout(() => {
				advance();
				decelerate(step + 1);
			}, delays[step]);
		}

		decelerate(0);
	}

	function applyEffects(outcome: IncidentOutcome) {
		for (const effect of outcome.effects) {
			if (effect.type === 'bankBalance') {
				player.adjustBalance(effect.delta);
			} else if (effect.type === 'morale') {
				season.adjustMorale(effect.delta);
			} else if (effect.type === 'xp') {
				player.addXp(effect.delta);
			}
		}
	}

	function onContinue() {
		if (!item || !result) return;
		applyEffects(result);
		saveGame();
		inbox.markRead(item.id);
		goto('/hub');
	}

	$effect(() => {
		if (!card || !item) {
			goto('/hub');
			return;
		}

		startSpinning();

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-4">
	{#if card}
		<Card>
			<div class="flex flex-col items-center gap-4 py-4 text-center">
				<h2 class="font-pixel text-sm text-primary">{card.title}</h2>
				<p class="font-pixel text-xs text-subtle">{card.description}</p>
			</div>
		</Card>

		<Card>
			<div class="flex flex-col gap-2">
				<p class="mb-2 font-pixel text-xs text-subtle">Outcome:</p>
				{#each card.outcomes as outcome, i (i)}
					<div
						class="flex w-full items-center gap-2 px-3 py-1.5 font-pixel text-[10px] transition-all {i ===
						currentIndex
							? 'outline-2 outline-offset-[-2px] outline-primary text-primary bg-dark'
							: 'text-subtle'}"
					>
						<span class="inline-block w-3 shrink-0 text-center">
							{i === currentIndex ? '>' : ''}
						</span>
						<span class="flex-1">{outcome.label}</span>
						<span class="shrink-0 {i === currentIndex ? 'text-warning' : 'text-subtle'}">
							{formatEffects(outcome)}
						</span>
					</div>
				{/each}
			</div>
		</Card>

		{#if tickerState === 'spinning'}
			<Button onclick={stop}>Stop</Button>
		{:else if tickerState === 'decelerating'}
			<p class="font-pixel text-xs text-subtle">Decelerating...</p>
		{:else if result}
			<div class="text-center">
				<p class="font-pixel text-xs {card.theme === 'positive' ? 'text-success' : 'text-danger'}">
					{result.label}
				</p>
				{#if result.effects.length === 0}
					<p class="mt-2 font-pixel text-xs text-subtle">Nothing happens.</p>
				{/if}
				{#each result.effects as effect (effect.type)}
					<p class="mt-1 font-pixel text-xs text-primary">
						{#if effect.type === 'bankBalance'}
							£{effect.delta > 0 ? '+' : ''}{effect.delta}
						{:else if effect.type === 'morale'}
							Morale {effect.delta > 0 ? '+' : ''}{effect.delta}
						{:else if effect.type === 'xp'}
							XP {effect.delta > 0 ? '+' : ''}{effect.delta}
						{/if}
					</p>
				{/each}
				<div class="mt-6">
					<Button onclick={onContinue}>Continue</Button>
				</div>
			</div>
		{/if}
	{/if}
</div>
