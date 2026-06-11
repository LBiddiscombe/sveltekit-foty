<script lang="ts">
	interface Props {
		home: string;
		away: string;
		homeScore: number;
		awayScore: number;
	}

	let { home, away, homeScore, awayScore }: Props = $props();
</script>

<div class="flex items-center justify-between gap-2 font-pixel text-xs text-primary">
	<span class="truncate">{home}</span>
	<span class="shrink-0">{homeScore} - {awayScore}</span>
	<span class="truncate">{away}</span>
</div>
