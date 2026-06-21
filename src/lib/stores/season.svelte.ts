import type { Fixture, Phase } from '$lib/types/game';
import { MORALE_CONFIG } from '$lib/config/morale';

function createSeason() {
	let weekNumber = $state(1);
	let seasonNumber = $state(1);
	let fixtures = $state<Fixture[]>([]);
	let gamesPlayed = $state(0);
	let phase = $state<Phase>('hub');
	let morale = $state(MORALE_CONFIG.scale.start);

	return {
		get weekNumber() {
			return weekNumber;
		},
		set weekNumber(v: number) {
			weekNumber = Math.max(1, v);
		},
		get seasonNumber() {
			return seasonNumber;
		},
		set seasonNumber(v: number) {
			seasonNumber = v;
		},
		get fixtures() {
			return fixtures;
		},
		set fixtures(v: Fixture[]) {
			fixtures = v;
		},
		get gamesPlayed() {
			return gamesPlayed;
		},
		set gamesPlayed(v: number) {
			gamesPlayed = v;
		},
		get phase() {
			return phase;
		},
		set phase(v: Phase) {
			phase = v;
		},
		get morale() {
			return morale;
		},
		set morale(v: number) {
			morale = v;
		}
	};
}

export const season = createSeason();
