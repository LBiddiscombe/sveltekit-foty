<script lang="ts">
	import { goto } from '$app/navigation';
	import Minigame from '$lib/components/minigames/Minigame.svelte';
	import { createPenaltySketch } from '$lib/components/minigames/PenaltySketch';
	import { createFirstTimeFinishSketch } from '$lib/components/minigames/FirstTimeFinishSketch';
	import { createReboundSketch } from '$lib/components/minigames/ReboundSketch';
	import type { Outcome } from '$lib/types/game';

	type Drill = 'penalty' | 'first-time-finish' | 'rebound';

	let selectedDrill = $state<Drill | null>(null);
	let attempt = $state(0);
	let outcomeText = $state<string | null>(null);
	let awaitingRestart = $state(false);

	const sketchFactory = $derived(
		selectedDrill === 'penalty'
			? createPenaltySketch
			: selectedDrill === 'rebound'
				? createReboundSketch
				: createFirstTimeFinishSketch
	);

	function handleComplete(outcome: Outcome) {
		if (awaitingRestart) return;
		awaitingRestart = true;

		outcomeText = outcome === 'goal' ? 'Goal!' : outcome === 'saved' ? 'Saved!' : 'Missed!';

		setTimeout(() => {
			outcomeText = null;
			awaitingRestart = false;
			attempt++;
		}, 1500);
	}

	function pickDrill(drill: Drill) {
		selectedDrill = drill;
		attempt = 0;
		outcomeText = null;
		awaitingRestart = false;
	}
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col bg-dark px-4 py-6 font-pixel text-primary">
	<button
		onclick={async () => await goto('/hub')}
		class="mb-4 flex items-center gap-1 self-start text-xs text-subtle hover:text-primary"
	>
		&lsaquo; Hub
	</button>

	{#if selectedDrill === null}
		<div class="mb-6">
			<h1 class="text-base text-primary">Training Ground</h1>
			<p class="mt-1 text-[10px] text-subtle">
				Pick a drill to practice. No impact on your career.
			</p>
		</div>

		<div class="flex flex-col gap-4">
			<div class="rounded border border-subtle bg-card p-4">
				<img
					src="/minigames/first-time-finish-screenshot.jpeg"
					alt="First-Time Finish"
					class="mb-3 w-full rounded object-cover"
				/>
				<h2 class="mb-1 text-sm text-primary">First-Time Finish</h2>
				<ul class="mb-3 list-inside list-disc text-[10px] text-subtle">
					<li>Tap the ball as it approaches to volley it first time</li>
					<li>Tap further from the ball for wider angles</li>
					<li>Tap below the ball to lift it, above to keep it low</li>
					<li>Power is automatic — focus on timing and direction</li>
				</ul>
				<button
					onclick={() => pickDrill('first-time-finish')}
					class="w-full rounded bg-warning px-4 py-2 text-center font-pixel text-xs uppercase tracking-wide text-dark"
				>
					Practice
				</button>
			</div>

			<div class="rounded border border-subtle bg-card p-4">
				<img
					src="/minigames/penalty-screenshot.jpeg"
					alt="Penalty"
					class="mb-3 w-full rounded object-cover"
				/>
				<h2 class="mb-1 text-sm text-primary">Penalty</h2>
				<ul class="mb-3 list-inside list-disc text-[10px] text-subtle">
					<li>Tap &amp; hold on the ball to charge your shot</li>
					<li>Release to kick — time the power bar for placement</li>
					<li>Tap further from the ball for wider angles</li>
					<li>Tap below the ball to lift it, above to keep it low</li>
				</ul>
				<button
					onclick={() => pickDrill('penalty')}
					class="w-full rounded bg-warning px-4 py-2 text-center font-pixel text-xs uppercase tracking-wide text-dark"
				>
					Practice
				</button>
			</div>

			<div class="rounded border border-subtle bg-card p-4">
				<img
					src="/minigames/rebound-screenshot.jpeg"
					alt="Rebound"
					class="mb-3 w-full rounded object-cover"
				/>
				<h2 class="mb-1 text-sm text-primary">Rebound</h2>
				<ul class="mb-3 list-inside list-disc text-[10px] text-subtle">
					<li>A CPU shot is saved by the keeper — react to the rebound</li>
					<li>Tap the rebounding ball to shoot it first time</li>
					<li>Aim for the open goal while the keeper recovers</li>
					<li>Keeper may dive again for a second save</li>
				</ul>
				<button
					onclick={() => pickDrill('rebound')}
					class="w-full rounded bg-warning px-4 py-2 text-center font-pixel text-xs uppercase tracking-wide text-dark"
				>
					Practice
				</button>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-4">
			{#key attempt}
				<Minigame
					oncomplete={handleComplete}
					createSketch={sketchFactory}
					showCrowd={false}
					skipIntro={true}
					{outcomeText}
				/>
			{/key}
		</div>
	{/if}
</div>
