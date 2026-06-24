<script lang="ts">
	import { goto } from '$app/navigation';
import { season } from '$lib/stores/season.svelte';
import { inbox } from '$lib/stores/inbox.svelte';
import { player } from '$lib/stores/player.svelte';
import { saveGame } from '$lib/save';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	$effect(() => {
		season.phase = 'hub';
		if (season.weekNumber > season.lastWageWeek) {
			player.adjustBalance(player.wage);
			season.lastWageWeek = season.weekNumber;
		}
		saveGame();
	});

	const menuItems = [
		{ label: 'Shop', href: '/hub/shop' },
		{ label: 'Fixtures', href: '/hub/fixtures' },
		{ label: 'Inbox', href: '/hub/inbox' },
		{ label: 'Player Status', href: '/hub/player' },
		{ label: 'State of Affairs', href: '/hub/affairs' }
	];

	const hasUnread = $derived(inbox.unreadCount > 0);
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-8">
	<h2 class="font-pixel text-sm text-primary">Week {season.weekNumber}</h2>

	<Card>
		<div class="flex flex-col gap-3">
			{#each menuItems as item (item.href)}
				<button
					onclick={async () => await goto(item.href)}
					class="flex w-full items-center justify-center gap-2 border border-subtle bg-dark px-4 py-3 text-center font-pixel text-xs text-primary transition-colors hover:border-primary"
				>
					{item.label}
					{#if item.href === '/hub/inbox' && inbox.unreadCount > 0}
						<span class="rounded-full bg-danger px-1.5 py-0.5 font-pixel text-[10px] text-dark">
							{inbox.unreadCount}
						</span>
					{/if}
				</button>
			{/each}
		</div>
	</Card>

	<div class="mt-auto">
		<Button onclick={async () => await goto('/pre-match')} disabled={hasUnread}>Next Match</Button>
	</div>
</div>
