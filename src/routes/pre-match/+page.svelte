<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import Card from '$lib/components/Card.svelte';
	import DeckCard from '$lib/components/DeckCard.svelte';
	import Button from '$lib/components/Button.svelte';

	$effect(() => {
		season.phase = 'pre-match';
	});

	const nextChances = $derived(player.deck[0] ?? 1);
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-4">
	<h2 class="font-pixel text-sm text-primary">Pre-Match</h2>

	<Card>
		<DeckCard chances={nextChances} />
	</Card>

	<div class="flex w-full flex-col gap-3">
		<Button onclick={async () => await goto('/match')}>Play</Button>
		<Button variant="secondary" onclick={async () => await goto('/match?skipped=1')}>Skip</Button>
	</div>
</div>
