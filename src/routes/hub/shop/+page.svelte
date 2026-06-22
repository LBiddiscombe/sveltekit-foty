<script lang="ts">
	import { goto } from '$app/navigation';
	import { player } from '$lib/stores/player.svelte';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { pickRandomIncident } from '$lib/config/incidents';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	const PRICES = {
		goalCard: 100,
		incidentCard: 200
	} as const;

	let flash = $state<string | null>(null);
	let flashTimer: ReturnType<typeof setTimeout> | undefined;
	let showInboxHint = $state(false);

	function showFlash(msg: string) {
		clearTimeout(flashTimer);
		flash = msg;
		flashTimer = setTimeout(() => {
			flash = null;
		}, 1500);
	}

	function buyGoalCard() {
		if (player.bankBalance < PRICES.goalCard) return;
		player.adjustBalance(-PRICES.goalCard);
		player.addToDeck(Math.floor(Math.random() * 3) + 1);
		showFlash('Card added!');
	}

	function buyIncidentCard() {
		if (player.bankBalance < PRICES.incidentCard) return;
		player.adjustBalance(-PRICES.incidentCard);
		const card = pickRandomIncident();
		inbox.addIncident({
			subject: card.title,
			body: card.description,
			incidentCardId: card.id
		});
		showFlash('Card added to inbox!');
		showInboxHint = true;
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-8">
	<div class="flex items-center gap-4">
		<button
			onclick={async () => await goto('/hub')}
			class="font-pixel text-xs text-subtle hover:text-primary"
		>
			← Hub
		</button>
		<h2 class="font-pixel text-sm text-primary">Shop</h2>
	</div>

	<p class="font-pixel text-xs text-primary">Balance: £{player.bankBalance}</p>
	<p class="font-pixel text-xs text-subtle">Deck: {player.deck.length} cards</p>

	<Card>
		<h4 class="mb-2 font-pixel text-xs text-primary">Goal Cards</h4>
		<p class="font-pixel text-xs text-subtle">
			£{PRICES.goalCard} each — adds a random 1-3 chance card to your deck
		</p>
		<div class="mt-3">
			<Button onclick={buyGoalCard} disabled={player.bankBalance < PRICES.goalCard}>
				Buy Goal Card
			</Button>
		</div>
	</Card>

	<Card>
		<h4 class="mb-2 font-pixel text-xs text-primary">Incident Cards</h4>
		<p class="font-pixel text-xs text-subtle">
			£{PRICES.incidentCard} — a gamble that could pay off or backfire
		</p>
		<div class="mt-3">
			<Button
				onclick={buyIncidentCard}
				disabled={player.bankBalance < PRICES.incidentCard}
				variant="secondary"
			>
				Buy Incident Card
			</Button>
			{#if showInboxHint}
				<a href="/hub/inbox" class="mt-2 inline-block font-pixel text-xs text-warning underline">
					Open your inbox to play it
				</a>
			{/if}
		</div>
	</Card>

	{#if flash}
		<p class="font-pixel text-xs text-success">{flash}</p>
	{/if}
</div>
