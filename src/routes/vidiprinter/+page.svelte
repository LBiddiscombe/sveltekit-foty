<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { season } from '$lib/stores/season.svelte';
	import Button from '$lib/components/Button.svelte';
	import { createTeletype, type TeletypeConfig } from './teletype.svelte';

	$effect(() => {
		season.phase = 'vidiprinter';
	});

	const scores = [
		{ home: 'FC Midtable Utd', away: 'Athletico Borough', homeScore: 2, awayScore: 1 },
		{ home: 'Real suburban', away: 'Inter City FC', homeScore: 0, awayScore: 0 },
		{ home: 'Sporting Phoenix', away: 'Albion Athletic', homeScore: 3, awayScore: 0 },
		{ home: 'Southside Rangers', away: 'North End Villa', homeScore: 1, awayScore: 2 },
		{ home: 'City Olympians', away: 'County Town', homeScore: 2, awayScore: 2 },
		{ home: 'Port Precision', away: 'Valley Warriors', homeScore: 0, awayScore: 1 },
		{ home: 'Eastside United', away: 'West Ham FC', homeScore: 4, awayScore: 0 },
		{ home: 'Riverside Athletic', away: 'Metro FC', homeScore: 1, awayScore: 1 },
		{ home: 'Stonewall Rovers', away: 'Bay Side', homeScore: 2, awayScore: 3 },
		{ home: 'Grand FC', away: 'Lakeside Town', homeScore: 0, awayScore: 2 }
	];

	const lines = scores.map((s) => `${s.home} ${s.homeScore}-${s.awayScore} ${s.away}`);

	const config: TeletypeConfig = { charSpeed: 25, linePause: 500 };
	const tty = createTeletype(lines, config);

	const pastLines = $derived(lines.slice(0, tty.currentLine));
	const currentText = $derived(tty.currentLine < lines.length ? tty.textForLine(tty.currentLine) : '');
</script>

<svelte:window
	onpointerdown={() => (tty.speed = 5)}
	onpointerup={() => (tty.speed = 25)}
	onpointerleave={() => (tty.speed = 25)}
/>

<div class="mx-auto flex min-h-dvh max-w-md flex-col px-4 py-8">
	<h2 class="mb-4 font-pixel text-sm text-primary">Vidiprinter</h2>

	<div class="flex min-h-0 flex-1 flex-col justify-end overflow-hidden">
		<div class="flex flex-col gap-1">
			{#each pastLines as line, i (i)}
				<div
					class="font-pixel text-[10px] {i === pastLines.length - 1 && tty.done
						? 'text-primary'
						: 'text-subtle'}"
				>
					{line}
				</div>
			{/each}

			{#if !tty.done}
				<div class="font-pixel text-[10px] text-primary">
					{currentText}
					{#if !tty.lineDone}
						<span class="inline-block h-2.5 w-1 animate-pulse bg-warning"></span>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<div class="mt-auto pt-4 {tty.done ? '' : 'invisible'}">
		<Button onclick={async () => await goto(resolve('/hub'))}>Continue</Button>
	</div>
</div>
