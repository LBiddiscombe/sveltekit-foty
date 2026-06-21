<script lang="ts">
	import { goto } from '$app/navigation';
	import { player } from '$lib/stores/player.svelte';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	const PRICES = {
		goalCard: 100,
		transferCard: 200,
		incidentCard: 200
	} as const;

	let bought = $state<Record<string, boolean>>({});

	function buy(type: keyof typeof PRICES) {
		if (player.bankBalance < PRICES[type]) return;
		player.bankBalance -= PRICES[type];
		if (type === 'goalCard') {
			player.deck.push(Math.floor(Math.random() * 3) + 1);
		}
		bought = { ...bought, [type]: true };
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

	<Card>
		<h4 class="mb-2 font-pixel text-xs text-primary">Goal Cards</h4>
		<p class="font-pixel text-xs text-subtle">
			£{PRICES.goalCard} each — adds a random 1-3 chance card to your deck
		</p>
		<div class="mt-3">
			{#if bought.goalCard}
				<p class="font-pixel text-xs text-success">Card added!</p>
			{:else}
				<Button onclick={() => buy('goalCard')} disabled={player.bankBalance < PRICES.goalCard}>
					Buy Goal Card
				</Button>
			{/if}
		</div>
	</Card>

	<Card>
		<h4 class="mb-2 font-pixel text-xs text-primary">Transfer Cards</h4>
		<p class="font-pixel text-xs text-subtle">
			£{PRICES.transferCard} — a scout evaluates you for a potential move
		</p>
		<div class="mt-3">
			{#if bought.transferCard}
				<p class="font-pixel text-xs text-success">Scout dispatched!</p>
			{:else}
				<Button
					onclick={() => buy('transferCard')}
					disabled={player.bankBalance < PRICES.transferCard}
					variant="secondary"
				>
					Buy Transfer Card
				</Button>
			{/if}
		</div>
	</Card>

	<Card>
		<h4 class="mb-2 font-pixel text-xs text-primary">Incident Cards</h4>
		<p class="font-pixel text-xs text-subtle">
			£{PRICES.incidentCard} — a gamble that could pay off or backfire
		</p>
		<div class="mt-3">
			{#if bought.incidentCard}
				<p class="font-pixel text-xs text-success">Card drawn!</p>
			{:else}
				<Button
					onclick={() => buy('incidentCard')}
					disabled={player.bankBalance < PRICES.incidentCard}
					variant="secondary"
				>
					Buy Incident Card
				</Button>
			{/if}
		</div>
	</Card>
</div>
