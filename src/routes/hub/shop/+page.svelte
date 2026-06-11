<script lang="ts">
	import { goto } from '$app/navigation';
	import { player } from '$lib/stores/player.svelte';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	let bought = $state(false);
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

	<Card>
		<p class="font-pixel text-xs text-subtle">Goal Cards — £100 each</p>
		<p class="mt-2 font-pixel text-xs text-primary">Balance: £{player.bankBalance}</p>

		<div class="mt-4">
			{#if bought}
				<p class="font-pixel text-xs text-success">Card added to deck!</p>
			{:else}
				<Button onclick={() => (bought = true)}>Buy Card</Button>
			{/if}
		</div>
	</Card>
</div>
