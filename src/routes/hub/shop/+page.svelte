<script lang="ts">
	import { goto } from '$app/navigation';
	import { player } from '$lib/stores/player.svelte';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { pickRandomIncident } from '$lib/config/incidents';
	import { goalCardPrice, incidentCardPrice } from '$lib/config/economy';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	const cardPrice = $derived(goalCardPrice(player.division));
	const incPrice = $derived(incidentCardPrice(player.division));

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
		if (player.bankBalance < cardPrice) return;
		player.adjustBalance(-cardPrice);
		player.addToDeck(Math.floor(Math.random() * 3) + 1);
		showFlash('Card added!');
	}

	function buyIncidentCard() {
		if (player.bankBalance < incPrice) return;
		player.adjustBalance(-incPrice);
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

<div class="mx-auto min-h-dvh max-w-md bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex items-center justify-between">
		<button
			onclick={async () => await goto('/hub')}
			class="flex items-center gap-1 text-[10px] text-subtle hover:text-primary"
		>
			<span class="text-xs leading-none">&lt;</span> Hub
		</button>
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Shop</span>
	</div>

	<div class="mb-5 grid grid-cols-2 gap-3">
		<div class="rounded bg-card p-3 text-center">
			<p class="text-sm text-success">£{player.bankBalance.toLocaleString()}</p>
			<p class="mt-0.5 text-[9px] text-subtle">BALANCE</p>
		</div>
		<div class="rounded bg-card p-3 text-center">
			<p class="text-sm text-primary">{player.deck.length}</p>
			<p class="mt-0.5 text-[9px] text-subtle">DECK</p>
		</div>
	</div>

	<div class="flex flex-col gap-3">
		<Card>
			<h4 class="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">
				Goal Cards
			</h4>
			<p class="text-[10px] text-subtle">
				£{cardPrice} each — adds a random 1-3 chance card to your deck
			</p>
			<div class="mt-3">
				<Button onclick={buyGoalCard} disabled={player.bankBalance < cardPrice}>
					Buy Goal Card
				</Button>
			</div>
		</Card>

		<Card>
			<h4 class="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">
				Incident Cards
			</h4>
			<p class="text-[10px] text-subtle">
				£{incPrice} — a gamble that could pay off or backfire
			</p>
			<div class="mt-3">
				<Button
					onclick={buyIncidentCard}
					disabled={player.bankBalance < incPrice}
					variant="secondary"
				>
					Buy Incident Card
				</Button>
				{#if showInboxHint}
					<a
						href="/hub/inbox"
						class="mt-3 inline-block text-[10px] text-warning underline"
					>
						Open your inbox to play it
					</a>
				{/if}
			</div>
		</Card>
	</div>

	{#if flash}
		<div class="mt-3 rounded bg-card p-2 text-center text-[10px] text-success">{flash}</div>
	{/if}
</div>
