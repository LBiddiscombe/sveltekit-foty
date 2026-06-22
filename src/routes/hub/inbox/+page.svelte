<script lang="ts">
	import { goto } from '$app/navigation';
	import { inbox } from '$lib/stores/inbox.svelte';
	import Card from '$lib/components/Card.svelte';
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-8">
	<div class="flex items-center gap-4">
		<button
			onclick={async () => await goto('/hub')}
			class="font-pixel text-xs text-subtle hover:text-primary"
		>
			← Hub
		</button>
		<h2 class="font-pixel text-sm text-primary">Inbox</h2>
	</div>

	{#each inbox.items as item (item.id)}
		<Card>
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<span class="font-pixel text-xs text-warning">{item.subject}</span>
					{#if item.actioned}
						<span class="font-pixel text-xs text-success">Read</span>
					{/if}
				</div>
				<p class="font-pixel text-xs text-primary">{item.body}</p>
				{#if !item.actioned}
					{#if item.type === 'incident' && item.incidentCardId}
						<button
							onclick={async () => await goto(`/hub/incident?inboxId=${item.id}`)}
							class="self-start border border-warning bg-dark px-3 py-1 font-pixel text-xs text-warning transition-colors hover:border-warning hover:text-primary"
						>
							Play Card
						</button>
					{:else}
						<button
							onclick={() => inbox.markRead(item.id)}
							class="self-start border border-subtle bg-dark px-3 py-1 font-pixel text-xs text-subtle transition-colors hover:border-primary hover:text-primary"
						>
							Mark Read
						</button>
					{/if}
				{/if}
			</div>
		</Card>
	{/each}

	<div class="mt-2">
		<button
			onclick={async () => await goto('/hub')}
			class="font-pixel text-xs text-subtle hover:text-primary"
		>
			← Back to Hub
		</button>
	</div>
</div>
