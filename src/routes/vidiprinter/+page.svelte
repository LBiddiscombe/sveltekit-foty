<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { saveGame } from '$lib/save';
	import { resolveWeek } from '$lib/week-resolve/resolveWeek';
	import { createTeletype, type TeletypeConfig } from './teletype.svelte';
	import Button from '$lib/components/Button.svelte';
	import VidiprinterLine from '$lib/components/VidiprinterLine.svelte';

	$effect(() => {
		season.phase = 'vidiprinter';
	});

	const resolution = resolveWeek();

	let autoContinued = $state(false);

	onMount(() => {
		if (resolution.status === 'auto-continue' && !autoContinued) {
			autoContinued = true;
			const dest = resolution.onContinue();
			saveGame();
			goto(dest);
		}
	});

	const tty = createTeletype(resolution.lines, { charSpeed: 25, linePause: 500 });

	const pastLines = $derived(resolution.lines.slice(0, tty.currentLine));
	const currentText = $derived(
		tty.currentLine < resolution.lines.length ? tty.textForLine(tty.currentLine) : ''
	);

	function handleContinue() {
		const dest = resolution.onContinue();
		saveGame();
		goto(dest);
	}
</script>

<svelte:window
	onpointerdown={() => (tty.speed = 1)}
	onpointerup={() => (tty.speed = 25)}
	onpointerleave={() => (tty.speed = 25)}
/>

{#if resolution.status === 'display'}
	<div class="mx-auto flex min-h-dvh max-w-md flex-col bg-dark px-4 py-6 font-pixel text-primary">
		<div class="mb-6 flex items-center justify-end">
			<span class="text-[10px] font-bold uppercase tracking-wider text-success">Vidiprinter</span>
		</div>

		<div class="flex min-h-0 flex-1 flex-col justify-end overflow-hidden">
			<div class="flex flex-col gap-0.5 font-pixel text-[10px] leading-relaxed">
				{#each pastLines as line, i (i)}
					{@const sc = resolution.scoreLines.get(i)}
					{@const isResultLine = line.startsWith('  RESULT')}
					{@const isScoreLine = sc !== undefined}
					{@const isHeader = line === 'INCOMING RESULTS' || line.startsWith(' LEAGUE')}
					{@const isTableLine = line.includes('pts')}

					{#if line === ''}
						<div class="h-2"></div>
					{:else if isScoreLine}
						<VidiprinterLine
							home={sc.home}
							away={sc.away}
							homeScore={sc.homeScore}
							awayScore={sc.awayScore}
							playerTeam={player.club !== 'Free Agent' ? player.club : 'Exetur'}
							penalties={sc.penalties}
							penaltyHomeWon={sc.penaltyHomeWon}
						/>
					{:else}
						<div
							class="whitespace-pre {isResultLine
								? 'text-subtle'
								: isHeader
									? 'text-warning'
									: isTableLine
										? 'text-primary'
										: 'text-subtle'}"
						>
							{line}
						</div>
					{/if}
				{/each}

				{#if !tty.done}
					<div class="whitespace-pre text-primary">
						{currentText}
						{#if !tty.lineDone}
							<span class="inline-block h-2.5 w-1 animate-pulse bg-warning"></span>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<div class="mt-auto pt-4 {tty.done ? '' : 'invisible'}">
			<Button onclick={handleContinue}>Continue</Button>
		</div>
	</div>
{/if}
