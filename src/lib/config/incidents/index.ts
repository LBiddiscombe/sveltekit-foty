import type { IncidentCard, IncidentCategory } from '$lib/types/game';
import { CAREER_CARDS } from './career';
import { TRAINING_CARDS } from './training';
import { GAMBLING_CARDS } from './gambling';
import { INVESTMENTS_CARDS } from './investments';
import { PURCHASES_CARDS } from './purchases-sales';
import { FAMILY_CARDS } from './family';
import { MEDIA_CARDS } from './media';
import { DRESSING_ROOM_CARDS } from './dressing-room';
import { TRAVEL_CARDS } from './travel';
import { ABSURD_CARDS } from './absurd';

export const CATEGORY_WEIGHTS: Record<IncidentCategory, number> = {
	career: 25,
	training: 15,
	'purchases-sales': 10,
	investments: 10,
	family: 10,
	media: 10,
	gambling: 8,
	'dressing-room': 5,
	travel: 3,
	absurd: 4
};

export const INCIDENT_CARDS: IncidentCard[] = [
	...CAREER_CARDS,
	...TRAINING_CARDS,
	...GAMBLING_CARDS,
	...INVESTMENTS_CARDS,
	...PURCHASES_CARDS,
	...FAMILY_CARDS,
	...MEDIA_CARDS,
	...DRESSING_ROOM_CARDS,
	...TRAVEL_CARDS,
	...ABSURD_CARDS
];

function weightedRandomPick<T>(items: T[], weightFn: (item: T) => number): T | null {
	const totalWeight = items.reduce((sum, item) => sum + weightFn(item), 0);
	if (totalWeight <= 0) return null;
	let r = Math.random() * totalWeight;
	for (const item of items) {
		r -= weightFn(item);
		if (r <= 0) return item;
	}
	return items[items.length - 1];
}

export function pickRandomIncident(): IncidentCard {
	const categories = Object.keys(CATEGORY_WEIGHTS) as IncidentCategory[];
	const selectedCategory = weightedRandomPick(categories, (c) => CATEGORY_WEIGHTS[c]);
	const pool = INCIDENT_CARDS.filter((c) => c.category === selectedCategory);
	if (pool.length === 0) {
		return INCIDENT_CARDS[Math.floor(Math.random() * INCIDENT_CARDS.length)];
	}
	return pool[Math.floor(Math.random() * pool.length)];
}

export function incidentCardById(id: string): IncidentCard | undefined {
	return INCIDENT_CARDS.find((c) => c.id === id);
}
