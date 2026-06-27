<script lang="ts">
	import { goto } from '$app/navigation';
	import { inbox } from '$lib/stores/inbox.svelte';
	import Card from '$lib/components/Card.svelte';
</script>

<div class="mx-auto min-h-dvh max-w-md bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex items-center justify-between">
		<button
			onclick={async () => await goto('/hub')}
			class="flex items-center gap-1 text-[10px] text-subtle hover:text-primary"
		>
			<span class="text-xs leading-none">&lt;</span> Hub
		</button>
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Inbox</span>
	</div>

	<div class="flex flex-col gap-3">
		{#each inbox.items as item (item.id)}
			<Card>
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between">
						<span class="text-[10px] text-warning">{item.subject}</span>
						{#if item.actioned}
							<span class="text-[10px] text-success">Read</span>
						{/if}
					</div>
					<p class="text-[10px] text-primary">{item.body}</p>
					{#if !item.actioned}
						{#if item.type === 'incident' && item.incidentCardId}
							<button
								onclick={async () => await goto(`/hub/incident?inboxId=${item.id}`)}
								class="self-start border border-warning bg-dark px-3 py-1 text-[10px] text-warning transition-colors hover:border-warning hover:text-primary"
							>
								Play Card
							</button>
						{:else}
							<button
								onclick={() => inbox.markRead(item.id)}
								class="self-start border border-subtle bg-dark px-3 py-1 text-[10px] text-subtle transition-colors hover:border-primary hover:text-primary"
							>
								Mark Read
							</button>
						{/if}
					{/if}
				</div>
			</Card>
		{/each}
	</div>
</div>
