<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { saveGame } from '$lib/save';
	import Button from '$lib/components/Button.svelte';

	$effect(() => {
		season.phase = 'hub';
		if (season.weekNumber > season.lastWageWeek) {
			player.adjustBalance(player.wage);
			season.lastWageWeek = season.weekNumber;
		}
		saveGame();
	});

	const hasUnread = $derived(inbox.unreadCount > 0);
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex items-center justify-end">
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Hub</span>
	</div>

	<div class="mb-5 flex items-center gap-4">
		<div
			class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-subtle bg-card text-lg text-primary"
		>
			{player.name.charAt(0).toUpperCase()}
		</div>
		<div>
			<h1 class="text-sm text-primary">{player.name}</h1>
			<p class="mt-0.5 text-[10px] text-subtle">
				Season {season.seasonNumber} &middot; Week {season.weekNumber} &middot; Age {player.age}
			</p>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3">
		<button
			onclick={async () => await goto('/hub/player')}
			class="relative rounded border border-transparent bg-card p-3 text-center hover:border-primary"
		>
			<p class="text-sm text-primary">{player.appearances}</p>
			<p class="mt-0.5 text-[9px] text-subtle">APPS</p>
			<span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-subtle">&gt;</span>
		</button>
		<button
			onclick={async () => await goto('/hub/player')}
			class="relative rounded border border-transparent bg-card p-3 text-center hover:border-primary"
		>
			<p class="text-sm text-primary">{player.goals}</p>
			<p class="mt-0.5 text-[9px] text-subtle">GOALS</p>
			<span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-subtle">&gt;</span>
		</button>
		<button
			onclick={async () => await goto('/hub/player')}
			class="relative rounded border border-transparent bg-card p-3 text-center hover:border-primary"
		>
			<p class="text-sm text-success">£{player.bankBalance.toLocaleString()}</p>
			<p class="mt-0.5 text-[9px] text-subtle">BANK</p>
			<span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-subtle">&gt;</span>
		</button>
		<button
			onclick={async () => await goto('/hub/shop')}
			class="relative rounded border border-transparent bg-card p-3 text-center hover:border-primary"
		>
			<p class="text-sm text-primary">{player.deck.length}</p>
			<p class="mt-0.5 text-[9px] text-subtle">GOAL CARDS</p>
			<span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-subtle">&gt;</span>
		</button>
		<button
			onclick={async () => await goto('/hub/affairs')}
			class="relative rounded border border-transparent bg-card p-3 text-center hover:border-primary"
		>
			<p class="text-sm text-primary">{player.club}</p>
			<p class="mt-0.5 text-[9px] text-subtle">TEAM</p>
			<span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-subtle">&gt;</span>
		</button>
		<button
			onclick={async () => await goto('/hub/fixtures')}
			class="relative rounded border border-transparent bg-card p-3 text-center hover:border-primary"
		>
			<p class="text-sm text-primary">Div {player.division}</p>
			<p class="mt-0.5 text-[9px] text-subtle">DIVISION</p>
			<span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-subtle">&gt;</span>
		</button>
	</div>

	<div class="mt-auto">
		{#if hasUnread}
			<Button onclick={async () => await goto('/hub/inbox')}>
				Continue to Inbox ({inbox.unreadCount})
			</Button>
		{:else}
			<Button onclick={async () => await goto('/pre-match')}>Next Match</Button>
		{/if}
	</div>
</div>
