<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { saveGame } from '$lib/save';
	import { CUP_ROUND_NAMES } from '$lib/config/cups';
	import type { CupType } from '$lib/types/game';
	import Button from '$lib/components/Button.svelte';

	const ROUND_ABBREV: Record<string, string> = {
		'Round 1': 'R1',
		'Round 2': 'R2',
		'Round 3': 'R3',
		'Round 4': 'R4',
		'Quarter Final': 'QF',
		'Semi Final': 'SF',
		Final: 'F'
	};

	function getCupStatus(type: CupType): { alive: boolean; label: string; stat: string } | null {
		const bracket = type === 'league-cup' ? season.leagueCupBracket : season.faCupBracket;
		if (!bracket) return null;

		const label = type === 'league-cup' ? 'LEAGUE CUP' : 'FA CUP';

		const eliminatedRound = bracket.eliminated[player.club];
		if (eliminatedRound !== undefined) {
			return {
				alive: false,
				label,
				stat: `Out ${ROUND_ABBREV[CUP_ROUND_NAMES[type][eliminatedRound]] ?? 'OUT'}`
			};
		}
		if (bracket.winner) {
			const won = bracket.winner === player.club;
			return {
				alive: won,
				label,
				stat: won ? 'WON' : 'OUT'
			};
		}

		return {
			alive: true,
			label,
			stat: `In ${ROUND_ABBREV[CUP_ROUND_NAMES[type][bracket.currentRound]] ?? 'IN'}`
		};
	}

	$effect(() => {
		season.phase = 'hub';
		if (season.weekNumber > season.lastWageWeek) {
			player.adjustBalance(player.wage);
			season.lastWageWeek = season.weekNumber;
		}
		saveGame();
	});

	const currentSeason = $derived({
		goals: player.goals - season.statsGoalsAtStart,
		appearances: player.appearances - season.statsAppsAtStart
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
			<p class="text-sm text-primary">{currentSeason.appearances}</p>
			<p class="mt-0.5 text-[9px] text-subtle">APPS</p>
			<span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-subtle">&gt;</span>
		</button>
		<button
			onclick={async () => await goto('/hub/player')}
			class="relative rounded border border-transparent bg-card p-3 text-center hover:border-primary"
		>
			<p class="text-sm text-primary">{currentSeason.goals}</p>
			<p class="mt-0.5 text-[9px] text-subtle">GOALS</p>
			<span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-subtle">&gt;</span>
		</button>
		<button
			onclick={async () => await goto('/hub/shop')}
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
			<p class="mt-0.5 text-[9px] text-subtle">FIXTURES</p>
			<span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-subtle">&gt;</span>
		</button>
	</div>

	<div class="mb-3 mt-4 grid grid-cols-2 gap-3">
		<button
			onclick={async () => await goto('/hub/cup-fixtures?cup=league-cup')}
			class="relative rounded border border-transparent bg-card p-3 text-center hover:border-primary"
		>
			{#if true}
				{@const s = getCupStatus('league-cup')}
				{#if s}
					<p class="text-sm {s.alive ? 'text-success' : 'text-danger'}">{s.stat}</p>
					<p class="mt-0.5 text-[9px] text-subtle">{s.label}</p>
				{:else}
					<p class="text-sm text-subtle">-</p>
					<p class="mt-0.5 text-[9px] text-subtle">LEAGUE CUP</p>
				{/if}
			{/if}
			<span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-subtle">&gt;</span>
		</button>
		<button
			onclick={async () => await goto('/hub/cup-fixtures?cup=fa-cup')}
			class="relative rounded border border-transparent bg-card p-3 text-center hover:border-primary"
		>
			{#if true}
				{@const s = getCupStatus('fa-cup')}
				{#if s}
					<p class="text-sm {s.alive ? 'text-success' : 'text-danger'}">{s.stat}</p>
					<p class="mt-0.5 text-[9px] text-subtle">{s.label}</p>
				{:else}
					<p class="text-sm text-subtle">-</p>
					<p class="mt-0.5 text-[9px] text-subtle">FA CUP</p>
				{/if}
			{/if}
			<span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-subtle">&gt;</span>
		</button>
	</div>

	<div class="mb-3 mt-2">
		<Button variant="secondary" onclick={async () => await goto('/training-ground')}>
			Training Ground
		</Button>
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
