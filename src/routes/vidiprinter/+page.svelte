<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { saveGame } from '$lib/save';
	import { resolveWeek } from '$lib/week-resolve/resolveWeek';
	import { createTeletype } from './teletype.svelte';
	import Button from '$lib/components/Button.svelte';
	import VidiprinterLine from '$lib/components/VidiprinterLine.svelte';

	const LINE_HEIGHT = 18;

	$effect(() => {
		season.phase = 'vidiprinter';
	});

	const resolution = resolveWeek();

	let autoContinued = $state(false);
	let scrollContainer: HTMLDivElement | undefined = $state();
	let userScrolledUp = $state(false);

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

	$effect(() => {
		pastLines;
		if (!scrollContainer || userScrolledUp) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
		if (distanceFromBottom <= LINE_HEIGHT * 2) {
			scrollContainer.scrollTop = scrollContainer.scrollTop + LINE_HEIGHT;
		}
	});

	function onScroll() {
		if (!scrollContainer) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
		userScrolledUp = distanceFromBottom > LINE_HEIGHT * 3;
	}

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
	<div class="mx-auto flex h-dvh max-w-md flex-col bg-dark px-4 py-6 font-pixel text-primary">
		<div class="shrink-0">
			<div class="mb-6 flex items-center justify-end">
				<span class="text-[10px] font-bold uppercase tracking-wider text-success">Vidiprinter</span>
			</div>
		</div>

		<div
			class="flex min-h-0 flex-1 flex-col justify-end overflow-y-auto"
			bind:this={scrollContainer}
			onscroll={onScroll}
		>
			<div class="flex flex-col gap-0.5 font-pixel text-[10px] leading-relaxed">
				{#each pastLines as line, i (i)}
					{@const sc = resolution.scoreLines.get(i)}
					{@const isResultLine = line.startsWith('  RESULT')}
					{@const isScoreLine = sc !== undefined}
					{@const isHeader = line === 'INCOMING RESULTS' || line.startsWith(' LEAGUE')}
					{@const isTableLine = line.includes('pts')}
					{@const isElimination = resolution.eliminationLines.includes(i)}
					{@const isPlayerWin = resolution.playerWinLines.includes(i)}
					{@const isDrawFixture = resolution.playerDrawLines.includes(i)}
					{@const isWinnerAnnounce = resolution.winnerAnnounceLines.includes(i)}
					{@const specialClass = isElimination
						? 'text-error'
						: isPlayerWin
							? 'text-success'
							: ''}

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
							class="whitespace-pre {specialClass || (isResultLine
								? 'text-subtle'
								: isHeader
									? 'text-warning'
									: isTableLine || isDrawFixture
										? 'text-primary'
										: isWinnerAnnounce
											? 'text-primary'
											: 'text-subtle')}"
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

		<div class="shrink-0 pt-4 {tty.done ? '' : 'invisible'}">
			<Button onclick={handleContinue}>Continue</Button>
		</div>
	</div>
{/if}
