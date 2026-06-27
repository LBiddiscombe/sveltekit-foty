<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolveRoute } from '$app/paths';
	import { getScoutReport } from '$lib/stores/scout-report.svelte';
	import { player } from '$lib/stores/player.svelte';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';

	const report = $derived(getScoutReport());

	function onContinue() {
		goto(resolveRoute('/hub'));
	}
</script>

	<div class="mx-auto flex min-h-dvh max-w-md flex-col bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex items-center justify-between">
		<button
			onclick={async () => await goto(resolveRoute('/hub'))}
			class="flex items-center gap-1 text-[10px] text-subtle hover:text-primary"
		>
			<span class="text-xs leading-none">&lt;</span> Hub
		</button>
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Scout Report</span>
	</div>

	<div class="flex flex-1 flex-col justify-center overflow-y-auto">
		{#if report === null}
			<Card>
				<h3 class="mb-3 text-center font-pixel text-xs uppercase tracking-wider text-primary">
					SCOUT REPORT
				</h3>
				<p class="text-center font-pixel text-[10px] text-subtle">
					No scout report available. The scout must still be reviewing your profile.
				</p>
			</Card>
	{:else if report.success}
		<div class="mb-4 rounded border border-success bg-card p-3 text-center">
			<p class="font-pixel text-sm uppercase tracking-wider text-success">
				You've been transferred!!
			</p>
		</div>
		<Card>
			<h3 class="mb-3 text-center font-pixel text-xs uppercase tracking-wider text-primary">
				SCOUT REPORT
			</h3>
			<div class="flex flex-col gap-4 font-pixel text-[10px] leading-relaxed text-subtle">
				<p>
					Hi <span class="text-primary">{player.name}</span>, I'm a scout from
					<span class="text-primary">{report.scoutClub}</span> and I've been watching your
					performances this week.
				</p>
				<p>
					We've seen enough — we've triggered your release clause. You're joining
					<span class="text-primary">{report.scoutClub}</span> in Division
					<span class="text-primary">{report.scoutDivision}</span>.
				</p>
				<p>
					Signing fee: <span class="text-success">£{report.signingFee?.toLocaleString() ?? 0}</span>
				</p>
				<p>Welcome to the club.</p>
			</div>
		</Card>
		{:else}
			<Card>
				<h3 class="mb-3 text-center font-pixel text-xs uppercase tracking-wider text-primary">
					SCOUT REPORT
				</h3>
			<div class="flex flex-col gap-4 font-pixel text-[10px] leading-relaxed text-subtle">
				<p>
					Hi <span class="text-primary">{player.name}</span>, I'm a scout from
					<span class="text-primary">{report.scoutClub}</span> and I've been watching your
					performances this week.
				</p>
				<p>
					We're currently looking for a <span class="text-warning">{report.targetBandName}</span>
					— you're at <span class="text-primary">{report.playerLevelName}</span> level right now,
					which isn't quite what we need.
				</p>
				<p>Keep your head up and keep working hard — we'll be watching.</p>
			</div>
			</Card>
		{/if}
	</div>
	<div class="mt-auto">
		<Button onclick={onContinue}>{report?.success ? 'Continue to Hub' : 'Dismiss'}</Button>
	</div>
</div>
