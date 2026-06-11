<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<div class="min-h-dvh select-none bg-dark font-pixel">
	{@render children()}
</div>
