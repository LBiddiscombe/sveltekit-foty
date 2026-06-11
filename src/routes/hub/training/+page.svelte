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
		<h2 class="font-pixel text-sm text-primary">Training</h2>
	</div>

	<Card>
		<p class="font-pixel text-xs text-subtle">Select stat focus for this week:</p>
		<div class="mt-4 flex flex-col gap-3">
			{#each Object.entries(statLabels) as [key, label] (key)}
				<label
					class="flex cursor-pointer items-center gap-3 border border-subtle bg-dark p-3 transition-colors hover:border-primary"
				>
					<input
						type="radio"
						name="trainingFocus"
						value={key}
						checked={player.trainingFocus === key}
						onchange={() => (player.trainingFocus = key as keyof typeof player.stats)}
						class="h-4 w-4 accent-success"
					/>
					<span class="font-pixel text-xs text-primary">{label}</span>
				</label>
			{/each}
		</div>
	</Card>
</div>
