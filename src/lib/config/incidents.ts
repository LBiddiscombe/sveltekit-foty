import type { IncidentCard } from '$lib/types/game';

export const INCIDENT_CARDS: IncidentCard[] = [
	{
		id: 'positive-windfall',
		theme: 'positive',
		title: 'Windfall',
		description: 'You received an unexpected payment.',
		outcomes: [
			{ label: 'You won a lottery prize!', effects: [{ type: 'bankBalance', delta: 500 }] },
			{ label: 'A lucky bet paid off.', effects: [{ type: 'bankBalance', delta: 200 }] },
			{ label: 'Found some loose change.', effects: [{ type: 'bankBalance', delta: 50 }] },
			{ label: 'You lost the ticket!', effects: [] }
		]
	},
	{
		id: 'negative-bet-gone-wrong',
		theme: 'negative',
		title: 'Bet Gone Wrong',
		description: 'A gamble you took has backfired.',
		outcomes: [
			{ label: 'You lost big on the horses.', effects: [{ type: 'bankBalance', delta: -500 }] },
			{ label: 'A poker night went badly.', effects: [{ type: 'bankBalance', delta: -200 }] },
			{ label: 'A small wager lost.', effects: [{ type: 'bankBalance', delta: -50 }] },
			{ label: 'They let you off this time.', effects: [] }
		]
	}
];

export function pickRandomIncident(): IncidentCard {
	return INCIDENT_CARDS[Math.floor(Math.random() * INCIDENT_CARDS.length)];
}

export function incidentCardById(id: string): IncidentCard | undefined {
	return INCIDENT_CARDS.find((c) => c.id === id);
}
