<script lang="ts">
	interface Props {
		chances: number;
		remaining?: number;
	}

	let { chances, remaining }: Props = $props();
</script>

<div class="flex flex-col items-center gap-2 rounded border border-warning bg-card p-6 text-center">
	<span class="font-pixel text-xs text-warning">
		Goal Card
		{#if remaining !== undefined}
			<span class="text-subtle"> ({remaining} left)</span>
		{/if}
	</span>
	<span class="font-pixel text-4xl text-primary">{chances}</span>
	<span class="font-pixel text-xs text-subtle">chance{chances !== 1 ? 's' : ''}</span>
</div>
