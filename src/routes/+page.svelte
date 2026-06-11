<script lang="ts">
	import { goto } from '$app/navigation';
	import { player } from '$lib/stores/player.svelte';
	import Button from '$lib/components/Button.svelte';

	let name = $state('');

	async function startCareer() {
		if (!name.trim()) return;
		player.name = name.trim();
		await goto('/hub');
	}
</script>

<div class="flex min-h-dvh flex-col items-center justify-center px-4">
	<div class="w-full max-w-md rounded border border-subtle bg-card p-8 text-center">
		<h1 class="font-pixel text-lg text-primary">FOOTBALLER OF THE YEAR</h1>
		<p class="mt-2 font-pixel text-xs text-subtle">— REMake —</p>

		<div class="mt-8 flex flex-col gap-4">
			<input
				type="text"
				placeholder="Enter your name"
				autocomplete="off"
				bind:value={name}
				onkeydown={(e) => e.key === 'Enter' && startCareer()}
				class="w-full border border-subtle bg-dark px-4 py-3 text-center font-pixel text-[16px] text-primary placeholder-subtle outline-none focus:border-success"
			/>
			<Button onclick={startCareer} disabled={!name.trim()}>Start Career</Button>
		</div>
	</div>
</div>
