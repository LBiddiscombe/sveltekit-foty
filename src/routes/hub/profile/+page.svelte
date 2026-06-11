<script lang="ts">
	import { goto } from '$app/navigation';
	import { player } from '$lib/stores/player.svelte';
	import Card from '$lib/components/Card.svelte';

	const statLabels: Record<string, string> = {
		power: 'Power',
		accuracy: 'Accuracy',
		technique: 'Technique',
		athleticism: 'Athleticism'
	};
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-8">
	<div class="flex items-center gap-4">
		<button
			onclick={async () => await goto('/hub')}
			class="font-pixel text-xs text-subtle hover:text-primary"
		>
			← Hub
		</button>
		<h2 class="font-pixel text-sm text-primary">Profile</h2>
	</div>

	<Card>
		<div class="flex flex-col items-center gap-2 text-center">
			<div
				class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-subtle bg-dark"
			>
				<span class="font-pixel text-lg text-primary">
					{player.name.charAt(0).toUpperCase()}
				</span>
			</div>
			<h3 class="font-pixel text-sm text-primary">{player.name}</h3>
			<p class="font-pixel text-xs text-subtle">{player.club} — Div {player.division}</p>
		</div>
	</Card>

	<Card>
		<h4 class="mb-3 font-pixel text-xs text-primary">Stats</h4>
		<div class="flex flex-col gap-3">
			{#each Object.entries(statLabels) as [key, label] (key)}
				<div class="flex items-center gap-3">
					<span class="w-24 shrink-0 font-pixel text-xs text-subtle">{label}</span>
					<div class="h-3 flex-1 overflow-hidden rounded-full bg-dark">
						<div
							class="h-full rounded-full transition-all"
							style="width: {player.stats[key as keyof typeof player.stats] *
								10}%; background-color: #4ade80"
						></div>
					</div>
					<span class="w-6 text-right font-pixel text-xs text-primary">
						{player.stats[key as keyof typeof player.stats]}
					</span>
				</div>
			{/each}
		</div>
	</Card>

	<Card>
		<div class="grid grid-cols-2 gap-4 text-center">
			<div>
				<p class="font-pixel text-lg text-primary">{player.goals}</p>
				<p class="font-pixel text-xs text-subtle">Goals</p>
			</div>
			<div>
				<p class="font-pixel text-lg text-primary">{player.appearances}</p>
				<p class="font-pixel text-xs text-subtle">Apps</p>
			</div>
		</div>
	</Card>
</div>
