<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
import { saveGame } from '$lib/save';
import { player } from '$lib/stores/player.svelte';
import { season } from '$lib/stores/season.svelte';
import './layout.css';

	let { children } = $props();

	onMount(() => {
		const handler = () => saveGame();
		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	});

	onMount(() => {
		const isDefault = player.club === 'Free Agent' && season.fixtures.length === 0;
		const path = window.location.pathname;
		if (isDefault && path !== '/') {
			goto('/');
		}
	});
</script>

<div class="min-h-dvh select-none bg-dark font-pixel">
	{@render children()}
</div>
