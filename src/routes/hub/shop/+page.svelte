<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolveRoute } from '$app/paths';
	import { player } from '$lib/stores/player.svelte';
	import { season } from '$lib/stores/season.svelte';
	import { standings } from '$lib/stores/standings.svelte';
	import { inbox } from '$lib/stores/inbox.svelte';
	import { pickRandomIncident } from '$lib/config/incidents';
	import { goalCardPrice, incidentCardPrice, transferCardPrice, getTransferWindow } from '$lib/config/economy';
	import {
		evaluateScout,
		processSameDivisionTransfer,
		processDivisionUpTransfer,
		hasMovedThisWindow,
		isPassiveScoutingBlocked
	} from '$lib/transfer/evaluate';
	import { setScoutReport } from '$lib/stores/scout-report.svelte';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	const cardPrice = $derived(goalCardPrice(player.division));
	const incPrice = $derived(incidentCardPrice(player.division));
	const tCardPrice = $derived(transferCardPrice(player.division));

	const transferWindow = $derived(getTransferWindow(season.weekNumber));

	const transferCardBlocked = $derived.by((): string | null => {
		if (player.queuedTransferCard) return 'Scout already arranged';
		if (transferWindow !== null) {
			if (hasMovedThisWindow(player.lastTransferWindow, season.seasonNumber, transferWindow)) {
				return 'Recently moved clubs — transfer cards unavailable';
			}
			if (isPassiveScoutingBlocked(season.seasonNumber, transferWindow)) {
				return 'Not yet available';
			}
		}
		return null;
	});

	let flash = $state<string | null>(null);
	let flashTimer: ReturnType<typeof setTimeout> | undefined;
	let showInboxHint = $state(false);

	function showFlash(msg: string) {
		clearTimeout(flashTimer);
		flash = msg;
		flashTimer = setTimeout(() => {
			flash = null;
		}, 1500);
	}

	function buyGoalCard() {
		if (player.bankBalance < cardPrice) return;
		player.adjustBalance(-cardPrice);
		player.addToDeck(Math.floor(Math.random() * 3) + 1);
		showFlash('Card added!');
	}

	function buyIncidentCard() {
		if (player.bankBalance < incPrice) return;
		player.adjustBalance(-incPrice);
		const card = pickRandomIncident();
		inbox.addIncident({
			subject: card.title,
			body: card.description,
			incidentCardId: card.id
		});
		showFlash('Card added to inbox!');
		showInboxHint = true;
	}

	async function buyTransferCard() {
		if (player.bankBalance < tCardPrice) return;

		// Out of window — queue for next window
		if (!transferWindow) {
			player.adjustBalance(-tCardPrice);
			player.queuedTransferCard = true;
			showFlash('Scout arranged for next transfer window!');
			return;
		}

		// In window — evaluate immediately
		player.adjustBalance(-tCardPrice);

		const report = evaluateScout(player.club, player.division, player.careerXp, season.divisionRosters);

		if (report && report.success && report.signingFee) {
			setScoutReport(report);

			if (report.scoutDivision === player.division) {
				processSameDivisionTransfer(player, season, report.scoutClub, report.signingFee);
			} else {
				processDivisionUpTransfer(player, season, standings, report.scoutClub, report.scoutDivision, report.signingFee);
			}

			player.lastTransferWindow = { season: season.seasonNumber, window: transferWindow };
			player.queuedTransferCard = false;

			const nextId = Math.max(0, ...inbox.items.map((i) => i.id)) + 1;
			inbox.items = [
				...inbox.items,
				{
					id: nextId,
					type: 'news',
					subject: 'New Club!',
					body: `You've signed for ${report.scoutClub} in Division ${report.scoutDivision}. A fresh start — make it count!`,
					actionRequired: true,
					actioned: false
				}
			];

			await goto(resolveRoute('/scout-report'));
		} else {
			// Failed
			const msg = report
				? `Scout not interested — you are ${report.playerLevelName} (need ${report.targetBandName})`
				: 'Scout not interested this time';
			showFlash(msg);
		}
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
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Shop</span>
	</div>

	<div class="mb-5 grid grid-cols-2 gap-3">
		<div class="rounded bg-card p-3 text-center">
			<p class="text-sm text-success">£{player.bankBalance.toLocaleString()}</p>
			<p class="mt-0.5 text-[9px] text-subtle">BALANCE</p>
		</div>
		<div class="rounded bg-card p-3 text-center">
			<p class="text-sm text-primary">{player.deck.length}</p>
			<p class="mt-0.5 text-[9px] text-subtle">DECK</p>
		</div>
	</div>

	<div class="flex flex-col gap-3">
		<Card>
			<h4 class="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">Goal Cards</h4>
			<p class="text-[10px] text-subtle">
				£{cardPrice} each — adds a random 1-3 chance card to your deck
			</p>
			<div class="mt-3">
				<Button onclick={buyGoalCard} disabled={player.bankBalance < cardPrice}>
					Buy Goal Card
				</Button>
			</div>
		</Card>

		<Card>
			<h4 class="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">
				Incident Cards
			</h4>
			<p class="text-[10px] text-subtle">
				£{incPrice} — a gamble that could pay off or backfire
			</p>
			<div class="mt-3">
				<Button
					onclick={buyIncidentCard}
					disabled={player.bankBalance < incPrice}
					variant="secondary"
				>
					Buy Incident Card
				</Button>
				{#if showInboxHint}
					<a href={resolveRoute('/hub/inbox')} class="mt-3 inline-block text-[10px] text-warning underline">
						Open your inbox to play it
					</a>
				{/if}
			</div>
		</Card>

		<Card>
			<h4 class="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">
				Transfer Cards
			</h4>
			<p class="text-[10px] text-subtle">
				£{tCardPrice} — Triggers a scout evaluation. If you qualify, you'll be transferred
				immediately.
			</p>
			<div class="mt-3">
				<Button
					onclick={buyTransferCard}
					disabled={transferCardBlocked !== null || player.bankBalance < tCardPrice}
				>
					{transferWindow ? 'Buy Transfer Card' : 'Buy Transfer Card (Queued)'}
				</Button>
				{#if transferCardBlocked}
					<p class="mt-1 text-[9px] text-danger">{transferCardBlocked}</p>
				{/if}
			</div>
		</Card>
	</div>

	{#if flash}
		<div class="mt-3 rounded bg-card p-2 text-center text-[10px] text-success">{flash}</div>
	{/if}
</div>
