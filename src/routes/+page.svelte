<script lang="ts">
	import { goto } from '$app/navigation';
	import { player } from '$lib/stores/player.svelte';
	import { season } from '$lib/stores/season.svelte';
	import { hasSavedGame, loadGame, clearSave } from '$lib/save';
	import Button from '$lib/components/Button.svelte';

	let name = $state('');
	let showResume = $state(hasSavedGame());

	function onResume() {
		if (loadGame()) {
			goto('/hub');
		} else {
			showResume = false;
		}
	}

	function onNewCareer() {
		clearSave();
		showResume = false;
	}

	async function startCareer() {
		if (!name.trim()) return;
		player.name = name.trim();
		player.age = 17;
		player.bankBalance = 5000;
		player.careerXp = 0;
		player.wage = 75;
		season.morale = 5;
		await goto('/team-select');
	}
</script>

<div class="flex min-h-dvh flex-col items-center justify-center px-4">
	<div class="flex-1"></div>
	<div class="w-full max-w-md rounded border border-subtle bg-card p-8 text-center">
		<h1 class="font-pixel text-lg text-primary">FOOTBALLER OF THE YEAR</h1>
		<p class="mt-2 font-pixel text-xs text-subtle">— REMake —</p>

		<div class="mt-8 flex flex-col gap-4">
			{#if showResume}
				<p class="font-pixel text-xs text-subtle">A saved game was found</p>
				<Button onclick={onResume}>Resume Career</Button>
				<button
					onclick={onNewCareer}
					class="font-pixel text-xs text-subtle underline hover:text-primary"
				>
					Start new career
				</button>
			{:else}
				<input
					type="text"
					placeholder="Enter your name"
					autocomplete="off"
					bind:value={name}
					onkeydown={(e) => e.key === 'Enter' && startCareer()}
					class="w-full border border-subtle bg-dark px-4 py-3 text-center font-pixel text-[16px] text-primary placeholder-subtle outline-none focus:border-success"
				/>
				<Button onclick={startCareer} disabled={!name.trim()}>Start Career</Button>
			{/if}
		</div>
	</div>
	<div class="flex-1"></div>
	<p class="pb-3 font-pixel text-[10px] text-subtle/50">{__BUILD_SHA__}</p>
</div>
