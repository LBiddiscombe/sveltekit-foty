import type { IncidentCard } from '$lib/types/game';

export const DRESSING_ROOM_CARDS: IncidentCard[] = [
	{
		id: 'initiation-song',
		category: 'dressing-room',
		title: 'Initiation Song',
		description: 'As a new signing, you have to sing in front of the squad.',
		outcomes: [
			{ label: 'You nail it! The lads go wild!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Solid effort. You pass the initiation.', effects: [] },
			{ label: 'You freeze. The hazing gets worse.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'The senior pro bails you out. You owe him one.', effects: [{ type: 'deckRemove', delta: 1 }] }
		]
	},
	{
		id: 'practical-joke',
		category: 'dressing-room',
		title: 'Practical Joke',
		description: 'The lads have a practical joke planned for someone.',
		outcomes: [
			{ label: 'Perfect prank. Legendary status in the squad.', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Good laugh. Everyone enjoys it.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'The joke backfires. You\'re the target now.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You stay out of it. Not your style.', effects: [] }
		]
	},
	{
		id: 'birthday-fine',
		category: 'dressing-room',
		title: 'Birthday Fine',
		description: 'It\'s your birthday — time for the traditional club fine.',
		outcomes: [
			{ label: 'You pay up with a smile. Everyone celebrates.', effects: [{ type: 'morale', delta: 2 }, { type: 'bankBalance', delta: -0.5, scale: 'wage' }] },
			{ label: 'You bring cakes. Good lad.', effects: [{ type: 'bankBalance', delta: -0.2, scale: 'wage' }] },
			{ label: 'You refuse to pay. Bad form.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You forget your own birthday. They let you off.', effects: [] }
		]
	},
	{
		id: 'kit-man-favour',
		category: 'dressing-room',
		title: 'Kit Man Favour',
		description: 'The kit man needs a favour from you.',
		outcomes: [
			{ label: 'You help out. Best kit all season.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Small favour. No big deal.', effects: [] },
			{ label: 'You forget. Kit man is upset.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You\'re too busy. He understands.', effects: [] }
		]
	},
	{
		id: 'training-ground-argument',
		category: 'dressing-room',
		title: 'Training Ground Argument',
		description: 'You had a heated exchange with a teammate in training.',
		outcomes: [
			{ label: 'Cleared the air. Stronger bond now.', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Sorted it out like professionals.', effects: [] },
			{ label: 'It escalates. Manager has to step in.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You walk away. Not worth it.', effects: [{ type: 'morale', delta: -1 }] }
		]
	},
	{
		id: 'team-meal',
		category: 'dressing-room',
		title: 'Team Meal',
		description: 'The squad is going for a team meal.',
		outcomes: [
			{ label: 'Brilliant night. Bonding at its best.', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Good food, good company.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'You end up paying for everyone. Expensive.', effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }] },
			{ label: 'You skip it. Rest for the match.', effects: [] }
		]
	},
	{
		id: 'pool-tournament',
		category: 'dressing-room',
		title: 'Pool Tournament',
		description: 'The team room has a pool table. Tournament time.',
		outcomes: [
			{ label: 'You\'re the champion! Bragging rights forever!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Semi-final exit. Respectable.', effects: [] },
			{ label: 'You lose in the first round. Ribbed mercilessly.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You don\'t play. Let the others have fun.', effects: [] }
		]
	},
	{
		id: 'table-tennis-rivalry',
		category: 'dressing-room',
		title: 'Table Tennis Rivalry',
		description: 'A fierce table tennis rivalry has developed with a teammate.',
		outcomes: [
			{ label: 'You dominate. Table tennis legend!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Close matches. Keeps the squad entertained.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'You break the table in frustration. Fined.', effects: [{ type: 'bankBalance', delta: -0.5, scale: 'wage' }] },
			{ label: 'You retire undefeated. In your own mind.', effects: [] }
		]
	},
	{
		id: 'card-school',
		category: 'dressing-room',
		title: 'Card School',
		description: 'The senior players are running a card school.',
		outcomes: [
			{ label: 'You win big. Lucky streak continues.', effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }] },
			{ label: 'Small wins. Fun way to pass the time.', effects: [{ type: 'bankBalance', delta: 0.3, scale: 'wage' }] },
			{ label: 'You lose your shirt. Rookie mistake.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'You watch. Safer that way.', effects: [] }
		]
	},
	{
		id: 'dressing-room-dj',
		category: 'dressing-room',
		title: 'Dressing Room DJ',
		description: 'You\'re in charge of the dressing room music today.',
		outcomes: [
			{ label: 'Bangers only! Everyone buzzing!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Decent playlist. Nobody complains.', effects: [] },
			{ label: 'Terrible choices. Aux cord revoked.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You let someone else have the aux.', effects: [] }
		]
	},
	{
		id: 'secret-santa',
		category: 'dressing-room',
		title: 'Secret Santa',
		description: 'The squad is doing Secret Santa for Christmas.',
		outcomes: [
			{ label: 'You give the best gift. Club legend!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Nice gift. Everyone happy.', effects: [{ type: 'bankBalance', delta: -0.2, scale: 'wage' }] },
			{ label: 'You forgot. Last-minute panic gift is terrible.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You don\'t participate.', effects: [] }
		]
	},
	{
		id: 'team-bonding',
		category: 'dressing-room',
		title: 'Team Bonding Weekend',
		description: 'The club has organised a team bonding weekend.',
		outcomes: [
			{ label: 'Best bonding ever! Squad feels like family!', effects: [{ type: 'morale', delta: 3 }] },
			{ label: 'Solid weekend. Good team spirit.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Someone goes too far. Drama ensues.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You stay home. Bonding isn\'t mandatory.', effects: [] }
		]
	},
	{
		id: 'shared-taxi',
		category: 'dressing-room',
		title: 'Shared Taxi',
		description: 'You\'re sharing a taxi with teammates after a night out.',
		outcomes: [
			{ label: 'Hilarious journey. Bonding moment.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Cheap fare split. Everyone happy.', effects: [] },
			{ label: 'You get stuck with the bill. Every time.', effects: [{ type: 'bankBalance', delta: -0.3, scale: 'wage' }] },
			{ label: 'You get your own taxi. Peace and quiet.', effects: [] }
		]
	}
];
