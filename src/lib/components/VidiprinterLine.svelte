<script lang="ts">
	interface Props {
		home: string;
		away: string;
		homeScore: number;
		awayScore: number;
		playerTeam: string;
	}

	let { home, away, homeScore, awayScore, playerTeam }: Props = $props();
</script>

<div class="flex items-center justify-between gap-2 font-pixel text-xs">
	<span class="truncate {home === playerTeam ? 'text-primary' : 'text-subtle'}">{home}</span>
	<span class="shrink-0 text-primary">{homeScore} - {awayScore}</span>
	<span class="truncate {away === playerTeam ? 'text-primary' : 'text-subtle'}">{away}</span>
</div>
