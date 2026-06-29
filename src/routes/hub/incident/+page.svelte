<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { season } from '$lib/stores/season.svelte';
	import { incidentCardById } from '$lib/config/incidents';
	import type { IncidentOutcome, IncidentEffectDescriptor } from '$lib/types/game';
	import { saveGame } from '$lib/save';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	const inboxId = $derived(Number($page.url.searchParams.get('inboxId')));
	const item = $derived(inbox.items.find((i) => i.id === inboxId));
	const card = $derived(item?.incidentCardId ? incidentCardById(item.incidentCardId) : undefined);

	type TickerState = 'spinning' | 'decelerating' | 'stopped';

	function fmt(e: IncidentEffectDescriptor): string {
		const val = e.scale === 'wage' ? Math.round((e.delta * player.wage) / 10) * 10 : e.delta;
		const sign = val > 0 ? '+' : '';
		switch (e.type) {
			case 'bankBalance':
				return `${sign}£${val}`;
			case 'morale':
				return `Morale ${sign}${e.delta}`;
			case 'xp':
				return `XP ${sign}${e.delta}`;
			case 'deckAdd':
				return `+${e.delta} cards`;
			case 'deckRemove':
				return `${e.delta > 0 ? '-' : ''}${Math.abs(e.delta)} cards`;
			case 'appearanceSkip':
				return `Miss ${e.delta} match${e.delta !== 1 ? 'es' : ''}`;
			case 'wageMultiplier':
				return `Wage ×${e.delta}`;
			default:
				return '';
		}
	}

	function formatEffects(outcome: IncidentOutcome): string {
		if (outcome.effects.length === 0) return 'Nothing happens.';
		return outcome.effects.map(fmt).join(', ');
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

		tickerState = 'decelerating';
		const delays = [150, 250, 400, 700, 1200];
		const c = card;
		const randomSkips = Math.floor(Math.random() * 4);
		let skipCount = 0;

		function decelerate(step: number) {
			if (skipCount < randomSkips) {
				advance();
				skipCount++;
				setTimeout(() => decelerate(step), 20);
				return;
			}

			if (step >= delays.length) {
				result = c.outcomes[currentIndex];
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
			const delta =
				effect.scale === 'wage' ? Math.round((effect.delta * player.wage) / 10) * 10 : effect.delta;
			switch (effect.type) {
				case 'bankBalance':
					player.adjustBalance(delta);
					break;
				case 'morale':
					season.adjustMorale(effect.delta);
					break;
				case 'xp':
					player.addXp(effect.delta);
					break;
				case 'deckAdd':
					player.addDeckCards(effect.delta);
					break;
				case 'deckRemove':
					player.removeDeckCards(effect.delta);
					break;
				case 'appearanceSkip':
					season.addAppearanceSkips(effect.delta);
					break;
				case 'wageMultiplier':
					player.multiplyWage(effect.delta);
					break;
			}
		}
	}

	function onContinue() {
		if (!item || !result) return;
		applyEffects(result);
		saveGame();
		inbox.markRead(item.id);
		goto('/hub/inbox');
	}

	$effect(() => {
		if (!card || !item) {
			goto('/hub/inbox');
			return;
		}

		startSpinning();

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex shrink-0 items-center justify-end">
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Incident</span>
	</div>

	{#if card}
		<div class="flex flex-1 flex-col items-center justify-center gap-8">
			<Card>
				<div class="flex flex-col items-center gap-4 py-4 text-center">
					<h2 class="font-pixel text-sm text-primary">{card.title}</h2>
					<p class="font-pixel text-xs text-subtle">{card.description}</p>
				</div>
			</Card>

			<div class="w-full max-w-sm">
				<div
					class="flex h-36 items-center justify-center rounded-lg border border-muted bg-card px-6"
				>
					<div class="flex flex-col items-center justify-center gap-3 text-center">
						<p class="font-pixel text-sm leading-relaxed text-primary">
							{card.outcomes[currentIndex].label}
						</p>
						<p class="font-pixel text-xs text-warning">
							{formatEffects(card.outcomes[currentIndex])}
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-auto shrink-0">
			<Button
				onclick={tickerState === 'spinning'
					? stop
					: tickerState === 'stopped'
						? onContinue
						: undefined}
				disabled={tickerState === 'decelerating'}
			>
				{tickerState === 'spinning'
					? 'Stop'
					: tickerState === 'decelerating'
						? 'Spinning down\u2026'
						: 'Continue'}
			</Button>
		</div>
	{/if}
</div>
