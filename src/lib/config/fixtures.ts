import type { DivisionSchedule, Fixture } from '$lib/types/game';

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export function generatePlayerFixtures(playerClub: string, divisionClubs: string[]): Fixture[] {
	const opponents = divisionClubs.filter((c) => c !== playerClub);
	const shuffled = shuffle(opponents);

	const firstHalf = shuffled.map((opponent, i) => ({
		opponent,
		isHome: i % 2 === 0
	}));

	const secondHalf = [...firstHalf].reverse().map((f) => ({
		opponent: f.opponent,
		isHome: !f.isHome
	}));

	const allGames = [...firstHalf, ...secondHalf];

	const n = divisionClubs.length;
	const isDiv1 = n <= 20;
	const doubleCount = isDiv1 ? 8 : 16;

	const doubleGameWeeks = shuffle(Array.from({ length: 30 }, (_, i) => i)).slice(0, doubleCount);

	const gameCounts = Array.from({ length: 30 }, (_, i) => (doubleGameWeeks.includes(i) ? 2 : 1));

	const fixtures: Fixture[] = [];
	let gameIndex = 0;
	for (let week = 0; week < 30; week++) {
		for (let g = 0; g < gameCounts[week]; g++) {
			if (gameIndex >= allGames.length) break;
			const game = allGames[gameIndex];
			fixtures.push({
				opponent: game.opponent,
				isHome: game.isHome,
				weekNumber: week + 1
			});
			gameIndex++;
		}
	}

	return fixtures;
}

export function deriveFixturesFromSchedule(
	playerClub: string,
	schedule: DivisionSchedule
): Fixture[] {
	const fixtures: Fixture[] = [];
	for (const week of schedule.weeks) {
		const matches = week.matches.filter((m) => m.home === playerClub || m.away === playerClub);
		for (const match of matches) {
			fixtures.push({
				opponent: match.home === playerClub ? match.away : match.home,
				isHome: match.home === playerClub,
				weekNumber: week.weekNumber
			});
		}
	}
	return fixtures;
}
