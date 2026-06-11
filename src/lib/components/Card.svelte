<script lang="ts">
	let { children }: { children?: import('svelte').Snippet } = $props();
</script>

<div class="rounded border border-subtle bg-card p-4">
	{@render children?.()}
</div>
