<script lang="ts">
	import { goto } from '$app/navigation';
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
		<h2 class="font-pixel text-sm text-primary">Fixtures</h2>
	</div>

	<Card>
		<p class="font-pixel text-xs text-subtle">Fixtures would appear here.</p>
	</Card>
</div>
