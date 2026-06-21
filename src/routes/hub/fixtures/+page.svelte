<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';

	function resultClass(fixture: typeof season.fixtures[number]): string {
		if (!fixture.result) return 'text-subtle';
		const { goalsFor, goalsAgainst } = fixture.result;
		if (goalsFor > goalsAgainst) return 'text-success';
		if (goalsFor === goalsAgainst) return 'text-warning';
		return 'text-danger';
	}

	function resultText(fixture: typeof season.fixtures[number]): string {
		if (!fixture.result) return '';
		const { goalsFor, goalsAgainst } = fixture.result;
		const wdl = goalsFor > goalsAgainst ? 'won' : goalsFor === goalsAgainst ? 'drew' : 'lost';
		return `${goalsFor}-${goalsAgainst} ${wdl}`;
	}

	const weeks = $derived.by(() => {
		const map = new Map<number, typeof season.fixtures>();
		for (const f of season.fixtures) {
			const list = map.get(f.weekNumber) ?? [];
			list.push(f);
			map.set(f.weekNumber, list);
		}
		return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
	});
</script>

<div class="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-8">
	<div class="flex items-center gap-4">
		<button
			onclick={async () => await goto('/hub')}
			class="font-pixel text-xs text-subtle hover:text-primary"
		>
			← Hub
		</button>
		<h2 class="font-pixel text-sm text-primary">Fixtures</h2>
	</div>

	{#each weeks as [weekNum, fixtures] (weekNum)}
		<div class="flex flex-col gap-1">
			<h3 class="font-pixel text-xs text-warning">Week {weekNum}</h3>
			{#each fixtures as fixture, i (fixture.opponent + i)}
				<div class="flex items-center gap-2 font-pixel text-[10px]">
					<span class="w-6 text-subtle">{fixture.isHome ? 'H' : 'A'}</span>
					<span class="text-primary">{fixture.opponent}</span>
					{#if fixture.result}
						<span class="ml-auto {resultClass(fixture)}">{resultText(fixture)}</span>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>
