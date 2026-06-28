import type { IncidentCard } from '$lib/types/game';

export const TRAVEL_CARDS: IncidentCard[] = [
	{
		id: 'missed-flight',
		category: 'travel',
		title: 'Missed Flight',
		description: "You're stuck in traffic on the way to the airport.",
		outcomes: [
			{ label: 'You make it with minutes to spare. Lucky!', effects: [] },
			{ label: 'The airline puts you on the next flight.', effects: [] },
			{
				label: 'You miss the flight. Expensive new ticket.',
				effects: [{ type: 'bankBalance', delta: -1.5, scale: 'wage' }]
			},
			{
				label: 'The delay means you miss training.',
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			}
		]
	},
	{
		id: 'flight-upgrade',
		category: 'travel',
		title: 'Flight Upgrade',
		description: "There's an upgrade available on your flight.",
		outcomes: [
			{
				label: 'First class! Champagne and legroom!',
				effects: [
					{ type: 'morale', delta: 2 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Business class. Comfortable journey.', effects: [{ type: 'morale', delta: 1 }] },
			{
				label: 'You pay for the upgrade. Worth it.',
				effects: [{ type: 'bankBalance', delta: -0.3, scale: 'wage' }]
			},
			{ label: 'You stay in economy. Same destination.', effects: [] }
		]
	},
	{
		id: 'lost-passport',
		category: 'travel',
		title: 'Lost Passport',
		description: "You can't find your passport before a trip abroad.",
		outcomes: [
			{ label: 'Found it! Crisis averted!', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Emergency passport issued. Stressful.', effects: [{ type: 'morale', delta: -1 }] },
			{
				label: 'You miss the trip. Club is furious.',
				effects: [
					{ type: 'appearanceSkip', delta: 1 },
					{ type: 'morale', delta: -2 }
				]
			},
			{ label: 'It was in your other jacket all along.', effects: [] }
		]
	},
	{
		id: 'lost-luggage',
		category: 'travel',
		title: 'Lost Luggage',
		description: "Your bags didn't make it onto the flight.",
		outcomes: [
			{ label: 'Delivered to your hotel. All sorted.', effects: [] },
			{
				label: 'You buy emergency kit. Annoying but fine.',
				effects: [{ type: 'bankBalance', delta: -0.3, scale: 'wage' }]
			},
			{
				label: 'Your boots are gone. Replacement cost.',
				effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }]
			},
			{
				label: 'Compensation from the airline. Profit!',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			}
		]
	},
	{
		id: 'traffic-jam',
		category: 'travel',
		title: 'Traffic Jam',
		description: "You're stuck in a terrible traffic jam on matchday.",
		outcomes: [
			{ label: 'You arrive just in time. Rush to get changed!', effects: [] },
			{
				label: 'Stuck for hours. Miss the pre-match meal.',
				effects: [{ type: 'morale', delta: -1 }]
			},
			{
				label: 'You arrive late. Manager drops you.',
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			},
			{ label: 'You took the back roads. Smooth sailing.', effects: [] }
		]
	},
	{
		id: 'hotel-overbooking',
		category: 'travel',
		title: 'Hotel Overbooking',
		description: 'The hotel has overbooked and your room is gone.',
		outcomes: [
			{
				label: 'Upgraded to the penthouse suite! Lucky!',
				effects: [
					{ type: 'morale', delta: 2 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Moved to another hotel. Annoying but fine.', effects: [] },
			{ label: 'No room available. Stressful night.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You crash with a teammate. Good bonding.', effects: [{ type: 'morale', delta: 1 }] }
		]
	},
	{
		id: 'snowed-in',
		category: 'travel',
		title: 'Snowed In',
		description: 'Heavy snow has shut down training and travel.',
		outcomes: [
			{ label: 'Snow day! Training cancelled. Rest up.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'You train in the snow. Character building.', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Match postponed. Disrupts your rhythm.', effects: [{ type: 'morale', delta: -1 }] },
			{
				label: 'You build a snowman with the squad.',
				effects: [
					{ type: 'morale', delta: 2 },
					{ type: 'deckAdd', delta: 1 }
				]
			}
		]
	},
	{
		id: 'heatwave',
		category: 'travel',
		title: 'Heatwave',
		description: 'A heatwave has hit and training is sweltering.',
		outcomes: [
			{ label: 'You thrive in the heat. Toughen up!', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Uncomfortable but manageable.', effects: [] },
			{
				label: 'You overheat. Medical room visit.',
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			},
			{ label: 'Training moves indoors. Air conditioning!', effects: [] }
		]
	}
];
