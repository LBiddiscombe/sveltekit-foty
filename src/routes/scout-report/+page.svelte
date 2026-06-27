<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolveRoute } from '$app/paths';
	import { getScoutReport } from '$lib/stores/scout-report.svelte';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';

	const report = $derived(getScoutReport());

	function onContinue() {
		goto(resolveRoute('/hub'));
	}
</script>

<div class="mx-auto min-h-dvh max-w-md bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex items-center justify-between">
		<button
			onclick={async () => await goto(resolveRoute('/hub'))}
			class="flex items-center gap-1 text-[10px] text-subtle hover:text-primary"
		>
			<span class="text-xs leading-none">&lt;</span> Hub
		</button>
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Scout Report</span>
	</div>

	{#if report === null}
		<Card>
			<h3 class="mb-3 text-center font-pixel text-xs uppercase tracking-wider text-primary">
				SCOUT REPORT
			</h3>
			<p class="text-center font-pixel text-[10px] text-subtle">
				No scout report available. The scout must still be reviewing your profile.
			</p>
			<div class="mt-4">
				<Button onclick={onContinue}>Dismiss</Button>
			</div>
		</Card>
	{:else if report.success}
		<Card>
			<h3 class="mb-3 text-center font-pixel text-xs uppercase tracking-wider text-primary">
				SCOUT REPORT
			</h3>
			<div class="flex flex-col gap-2 font-pixel text-[10px] text-subtle">
				<p>
					<span class="text-primary">{report.scoutClub}</span> have triggered your release
					clause.
				</p>
				<p>
					Signing fee: <span class="text-success">£{report.signingFee?.toLocaleString() ?? 0}</span>
				</p>
				<p>
					You have been transferred to <span class="text-primary">{report.scoutClub}</span> in
					Division <span class="text-primary">{report.scoutDivision}</span>.
				</p>
			</div>
			<div class="mt-4">
				<Button onclick={onContinue}>Continue to Hub</Button>
			</div>
		</Card>
	{:else}
		<Card>
			<h3 class="mb-3 text-center font-pixel text-xs uppercase tracking-wider text-primary">
				SCOUT REPORT
			</h3>
			<div class="flex flex-col gap-2 font-pixel text-[10px] text-subtle">
				<p>
					<span class="text-primary">{report.scoutClub}</span> scout was watching you this week.
				</p>
				<p>
					We were looking for a <span class="text-warning">{report.targetBandName}</span>. You're
					at <span class="text-primary">{report.playerLevelName}</span>.
				</p>
				<p>Not quite what we're looking for at this time. Keep working hard.</p>
			</div>
			<div class="mt-4">
				<Button onclick={onContinue}>Dismiss</Button>
			</div>
		</Card>
	{/if}
</div>
