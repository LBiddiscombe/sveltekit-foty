<script lang="ts">
	import { goto } from '$app/navigation';
	import { season } from '$lib/stores/season.svelte';
	import { player } from '$lib/stores/player.svelte';
	import { CUP_SCHEDULE } from '$lib/config/cups';
	import type { Fixture } from '$lib/types/game';

	type DisplayEntry = {
		weekNumber: number;
		isHome: boolean;
		label: string;
		isCup: boolean;
		result?: Fixture['result'];
	};

	function findDivision(club: string): number {
		for (const [div, clubs] of Object.entries(season.divisionRosters)) {
			if (clubs.includes(club)) return Number(div);
		}
		return 0;
	}

	function divLabel(club: string): string {
		const d = findDivision(club);
		return d ? `D${d}` : 'N/L';
	}

	const CUP_ABBREV: Record<string, string> = {
		'league-cup': 'LC',
		'fa-cup': 'FAC'
	};

	const ROUND_ABBREV: Record<number, string> = {
		1: 'R1',
		2: 'R2',
		3: 'R3',
		4: 'R4',
		5: 'QF',
		6: 'SF',
		7: 'F'
	};

	type CupResult = {
		homeGoals: number;
		awayGoals: number;
		homeGoals2?: number;
		awayGoals2?: number;
		playerLeg1Goals?: number;
		playerLeg1Outcomes?: import('$lib/types/game').Outcome[];
		playerLeg2Goals?: number;
		playerLeg2Outcomes?: import('$lib/types/game').Outcome[];
	};

	function legResult(
		r: CupResult,
		leg: 1 | 2,
		isPlayerTieHome: boolean
	): Fixture['result'] | undefined {
		if (leg === 2 && r.homeGoals2 === undefined) return undefined;
		const goalsFor =
			leg === 1
				? isPlayerTieHome
					? r.homeGoals
					: r.awayGoals
				: isPlayerTieHome
					? r.homeGoals2!
					: r.awayGoals2!;
		const goalsAgainst =
			leg === 1
				? isPlayerTieHome
					? r.awayGoals
					: r.homeGoals
				: isPlayerTieHome
					? r.awayGoals2!
					: r.homeGoals2!;
		const playerGoals = leg === 1 ? (r.playerLeg1Goals ?? 0) : (r.playerLeg2Goals ?? 0);
		const outcomes = leg === 1 ? (r.playerLeg1Outcomes ?? []) : (r.playerLeg2Outcomes ?? []);
		return { goalsFor, goalsAgainst, playerGoals, outcomes };
	}

	const sortedFixtures = $derived.by<DisplayEntry[]>(() => {
		const league: DisplayEntry[] = season.fixtures.map((f) => ({
			weekNumber: f.weekNumber,
			isHome: f.isHome,
			label: f.opponent,
			isCup: false,
			result: f.result
		}));

		const cup: DisplayEntry[] = [];

		for (const cupType of ['league-cup', 'fa-cup'] as const) {
			const bracket = cupType === 'league-cup' ? season.leagueCupBracket : season.faCupBracket;
			if (!bracket || bracket.winner) continue;

			const schedule = CUP_SCHEDULE[cupType];

			for (let ri = 0; ri < bracket.rounds.length; ri++) {
				const round = bracket.rounds[ri];
				const roundSchedule = schedule[ri];
				if (!roundSchedule) continue;

				const tie = round.ties.find((t) => t.home === player.club || t.away === player.club);
				if (!tie || !tie.home || !tie.away) continue;

				const opponent = (tie.home === player.club ? tie.away : tie.home).replace(/ \(N\/L\)$/, '');
				const roundLabel = `${CUP_ABBREV[cupType]} ${ROUND_ABBREV[round.roundNumber] ?? 'R' + round.roundNumber}`;
				const week = roundSchedule.week;

				if (roundSchedule.isTwoLeg) {
					const leg1Home = tie.home === player.club;
					const leg2Home = tie.away === player.club;
					const r = tie.result;
					cup.push({
						weekNumber: week,
						isHome: leg1Home,
						label: `${roundLabel} ${opponent} ${divLabel(opponent)}`,
						isCup: true,
						result: r ? legResult(r as CupResult, 1, leg1Home) : undefined
					});
					cup.push({
						weekNumber: week,
						isHome: leg2Home,
						label: `${roundLabel} ${opponent} ${divLabel(opponent)}`,
						isCup: true,
						result: r ? legResult(r as CupResult, 2, tie.home === player.club) : undefined
					});
				} else {
					const isHome = tie.home === player.club;
					const r = tie.result;
					cup.push({
						weekNumber: week,
						isHome,
						label: `${roundLabel} ${opponent} ${divLabel(opponent)}`,
						isCup: true,
						result: r ? legResult(r as CupResult, 1, isHome) : undefined
					});
				}
			}
		}

		return [...league, ...cup].sort((a, b) => {
			if (a.weekNumber !== b.weekNumber) return a.weekNumber - b.weekNumber;
			if (a.isCup !== b.isCup) return a.isCup ? -1 : 1;
			return 0;
		});
	});

	function resultAbbr(fixture: DisplayEntry): string {
		if (!fixture.result) return '';
		const { goalsFor, goalsAgainst } = fixture.result;
		if (goalsFor > goalsAgainst) return `W ${goalsFor}-${goalsAgainst}`;
		if (goalsFor === goalsAgainst) return `D ${goalsFor}-${goalsAgainst}`;
		return `L ${goalsFor}-${goalsAgainst}`;
	}

	function resultClass(fixture: DisplayEntry): string {
		if (!fixture.result) return '';
		const { goalsFor, goalsAgainst } = fixture.result;
		if (goalsFor > goalsAgainst) return 'text-success';
		if (goalsFor === goalsAgainst) return 'text-warning';
		return 'text-danger';
	}
</script>

<div class="mx-auto min-h-dvh max-w-md bg-dark px-4 py-6 font-pixel text-primary">
	<div class="mb-6 flex items-center justify-between">
		<button
			onclick={async () => await goto('/hub')}
			class="flex items-center gap-1 text-[10px] text-subtle hover:text-primary"
		>
			<span class="text-xs leading-none">&lt;</span> Hub
		</button>
		<span class="text-[10px] font-bold uppercase tracking-wider text-success">Fixtures</span>
	</div>

	<div class="rounded bg-card p-4">
		<div class="flex flex-col gap-0.5">
			<h3 class="mb-3 text-[10px] font-bold uppercase tracking-wider text-subtle">
				Division {player.division} · Season {season.seasonNumber}
			</h3>
			<div class="flex items-center gap-2 text-[9px] text-subtle uppercase tracking-wider">
				<span class="w-4 text-right">WK</span>
				<span class="flex-1">Opponent</span>
				<span class="shrink-0 text-right">Result</span>
			</div>
			{#each sortedFixtures as fixture, i (fixture.weekNumber + fixture.label + i)}
				<div class="flex items-center gap-2 text-[10px]">
					<span class="w-4 text-right tabular-nums text-subtle">{fixture.weekNumber}</span>
					<span class="flex flex-1 items-center gap-2">
						<span class="w-4 shrink-0 text-center text-subtle">{fixture.isHome ? 'H' : 'A'}</span>
						<span class="truncate text-primary">{fixture.label}</span>
					</span>
					{#if fixture.result}
						<span class="flex shrink-0 items-center gap-1">
							<span class="flex items-center gap-0.5">
								{#each fixture.result.outcomes as outcome, j (j)}
									{#if outcome === 'goal'}
										<svg viewBox="0 0 8 8" width="8" height="8" class="text-success">
											<circle cx="4" cy="4" r="3.5" fill="currentColor" />
										</svg>
									{:else if outcome === 'saved'}
										<svg viewBox="0 0 8 8" width="8" height="8" class="text-warning">
											<circle
												cx="4"
												cy="4"
												r="3"
												fill="none"
												stroke="currentColor"
												stroke-width="1.2"
											/>
										</svg>
									{:else}
										<svg viewBox="0 0 8 8" width="8" height="8" class="text-danger">
											<path
												d="M1 1l6 6M7 1l-6 6"
												stroke="currentColor"
												stroke-width="1.2"
												stroke-linecap="round"
											/>
										</svg>
									{/if}
								{/each}
							</span>
							<span class="w-14 text-right tabular-nums {resultClass(fixture)}"
								>{resultAbbr(fixture)}</span
							>
						</span>
					{:else}
						<span class="shrink-0"></span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
