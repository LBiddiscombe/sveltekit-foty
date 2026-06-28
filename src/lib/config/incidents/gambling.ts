import type { IncidentCard } from '$lib/types/game';

export const GAMBLING_CARDS: IncidentCard[] = [
	{
		id: 'casino-weekend',
		category: 'gambling',
		title: 'Casino Weekend',
		description: 'Your teammates invite you to a casino weekend in London.',
		outcomes: [
			{
				label: 'Clean up at blackjack! Huge win!',
				effects: [{ type: 'bankBalance', delta: 5, scale: 'wage' }]
			},
			{
				label: 'Modest win on slots. Pays for the weekend.',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			},
			{
				label: 'Lose more than planned.',
				effects: [{ type: 'bankBalance', delta: -5, scale: 'wage' }]
			},
			{ label: 'Stick to fruit machines. Break even.', effects: [] }
		]
	},
	{
		id: 'horse-racing-tip',
		category: 'gambling',
		title: 'Horse Racing Tip',
		description: 'A mate at the stables gives you a hot tip.',
		outcomes: [
			{
				label: 'The horse comes in at 20-1! Massive payday!',
				effects: [{ type: 'bankBalance', delta: 8, scale: 'wage' }]
			},
			{
				label: 'Each-way place. Small profit.',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			},
			{
				label: 'Horse finishes last. Lost stake.',
				effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }]
			},
			{ label: "You don't bet. Not your thing.", effects: [] }
		]
	},
	{
		id: 'poker-night',
		category: 'gambling',
		title: 'Poker Night',
		description: 'Regular poker night with the lads.',
		outcomes: [
			{
				label: 'Clean up! Everyone fears your bluff!',
				effects: [{ type: 'bankBalance', delta: 3, scale: 'wage' }]
			},
			{
				label: 'Small win. Paid for the pizzas.',
				effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }]
			},
			{
				label: 'Bad beats all night. Down significant.',
				effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }]
			},
			{ label: 'Fold early. Watch the others lose.', effects: [] }
		]
	},
	{
		id: 'betting-scandal',
		category: 'gambling',
		title: 'Betting Scandal',
		description: 'The FA is investigating betting in football.',
		outcomes: [
			{ label: 'Cleared. No involvement.', effects: [] },
			{ label: 'Warning issued. Close call.', effects: [{ type: 'morale', delta: -1 }] },
			{
				label: 'Fined and suspended by the club.',
				effects: [
					{ type: 'bankBalance', delta: -8, scale: 'wage' },
					{ type: 'appearanceSkip', delta: 2 }
				]
			},
			{ label: 'Cooperate fully. No action taken.', effects: [] }
		]
	},
	{
		id: 'lucky-accumulator',
		category: 'gambling',
		title: 'Lucky Accumulator',
		description: 'You put together a weekend football accumulator.',
		outcomes: [
			{
				label: 'Every bet comes in! Massive win!',
				effects: [{ type: 'bankBalance', delta: 10, scale: 'wage' }]
			},
			{
				label: 'Most come in. Decent return.',
				effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }]
			},
			{
				label: 'One team lets you down. All lost.',
				effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }]
			},
			{ label: 'Forget to place it. Bullet dodged.', effects: [] }
		]
	},
	{
		id: 'lottery-ticket',
		category: 'gambling',
		title: 'Lottery Ticket',
		description: 'You bought a lottery ticket on a whim.',
		outcomes: [
			{
				label: 'Win big! Five numbers! Life-changing!',
				effects: [{ type: 'bankBalance', delta: 20, scale: 'wage' }]
			},
			{
				label: 'Three numbers. Small win.',
				effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }]
			},
			{ label: 'No numbers. Nothing.', effects: [] },
			{ label: 'Forgot to check. Ticket lost.', effects: [] }
		]
	},
	{
		id: 'premium-bonds',
		category: 'gambling',
		title: 'Premium Bonds',
		description: 'You have money in premium bonds.',
		outcomes: [
			{
				label: 'Win the million! Unbelievable!',
				effects: [{ type: 'bankBalance', delta: 50, scale: 'wage' }]
			},
			{
				label: 'Small prize. Free money.',
				effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }]
			},
			{ label: 'No win this month.', effects: [] },
			{ label: 'Cash them out. Safe but boring.', effects: [] }
		]
	},
	{
		id: 'fantasy-football',
		category: 'gambling',
		title: 'Fantasy Football',
		description: 'Your fantasy football team is doing well.',
		outcomes: [
			{
				label: 'Win the league! Bragging rights forever!',
				effects: [
					{ type: 'morale', delta: 2 },
					{ type: 'bankBalance', delta: 1, scale: 'wage' }
				]
			},
			{ label: 'Solid mid-table. Respectable.', effects: [] },
			{ label: 'Your team is terrible. Last place.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Set and forget. No time.', effects: [] }
		]
	},
	{
		id: 'charity-raffle',
		category: 'gambling',
		title: 'Charity Raffle',
		description: 'The club is holding a charity raffle.',
		outcomes: [
			{ label: 'Win the top prize! Luxury holiday!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Win a hamper. Nice.', effects: [] },
			{
				label: 'Buy loads of tickets. Win nothing.',
				effects: [{ type: 'bankBalance', delta: -0.2, scale: 'wage' }]
			},
			{
				label: 'Donate without entering.',
				effects: [{ type: 'bankBalance', delta: -0.5, scale: 'wage' }]
			}
		]
	},
	{
		id: 'high-stakes-poker',
		category: 'gambling',
		title: 'High Stakes Poker',
		description: 'Invited to a high-stakes poker game.',
		outcomes: [
			{
				label: 'Take down a massive pot! Huge win!',
				effects: [{ type: 'bankBalance', delta: 10, scale: 'wage' }]
			},
			{
				label: 'Hold your own. Small profit.',
				effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }]
			},
			{
				label: 'Lose big. Expensive lesson.',
				effects: [{ type: 'bankBalance', delta: -8, scale: 'wage' }]
			},
			{ label: 'Decline. Stakes too high.', effects: [] }
		]
	},
	{
		id: 'golf-wager',
		category: 'gambling',
		title: 'Golf Wager',
		description: 'A friendly golf match has a bet on it.',
		outcomes: [
			{
				label: 'Round of your life. Victory!',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			},
			{
				label: 'Close match. Lose on the last hole.',
				effects: [{ type: 'bankBalance', delta: -0.5, scale: 'wage' }]
			},
			{
				label: 'Terrible golf. Lose badly.',
				effects: [
					{ type: 'morale', delta: -1 },
					{ type: 'bankBalance', delta: -1, scale: 'wage' }
				]
			},
			{ label: 'Play for bragging rights only.', effects: [] }
		]
	},
	{
		id: 'greyhound-syndicate',
		category: 'gambling',
		title: 'Greyhound Syndicate',
		description: 'A teammate wants you in his greyhound syndicate.',
		outcomes: [
			{
				label: 'Your dog wins race after race! Profit!',
				effects: [{ type: 'bankBalance', delta: 4, scale: 'wage' }]
			},
			{
				label: 'Modest returns. Fun hobby.',
				effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }]
			},
			{
				label: 'Dog keeps losing. Down the drain.',
				effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }]
			},
			{ label: 'Pass on the offer.', effects: [] }
		]
	},
	{
		id: 'fruit-machine',
		category: 'gambling',
		title: 'Fruit Machine',
		description: 'A fruit machine in the club lounge calls to you.',
		outcomes: [
			{
				label: 'Jackpot! Bells and lights everywhere!',
				effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }]
			},
			{
				label: 'Small win. Extra coins.',
				effects: [{ type: 'bankBalance', delta: 0.2, scale: 'wage' }]
			},
			{
				label: 'Feed it all your change. Nothing.',
				effects: [{ type: 'bankBalance', delta: -0.1, scale: 'wage' }]
			},
			{ label: 'Walk past. Not today.', effects: [] }
		]
	},
	{
		id: 'roulette-streak',
		category: 'gambling',
		title: 'Roulette Streak',
		description: 'The roulette wheel is calling on a night out.',
		outcomes: [
			{
				label: 'Hit red seven times! Ridiculous luck!',
				effects: [{ type: 'bankBalance', delta: 6, scale: 'wage' }]
			},
			{
				label: 'Up and down. Ahead overall.',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			},
			{
				label: 'The zero kills you. Big loss.',
				effects: [{ type: 'bankBalance', delta: -4, scale: 'wage' }]
			},
			{ label: 'You watch. Safer.', effects: [] }
		]
	},
	{
		id: 'betting-account',
		category: 'gambling',
		title: 'Betting Account',
		description: 'You check your online betting balance.',
		outcomes: [
			{
				label: 'Up significantly! Good run continues!',
				effects: [{ type: 'bankBalance', delta: 3, scale: 'wage' }]
			},
			{
				label: 'Small profit from clever bets.',
				effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }]
			},
			{
				label: "Time to cut losses. Withdraw what's left.",
				effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }]
			},
			{ label: 'Close the account. Responsible choice.', effects: [] }
		]
	},
	{
		id: 'betting-app',
		category: 'gambling',
		title: 'Betting App',
		description: 'A new betting app offers you a free bet.',
		outcomes: [
			{
				label: 'Free bet wins big! Pure profit!',
				effects: [{ type: 'bankBalance', delta: 3, scale: 'wage' }]
			},
			{
				label: 'Free bet wins modestly. Nice.',
				effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }]
			},
			{
				label: 'The terms are a trap. Lost money.',
				effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }]
			},
			{ label: 'You ignore the offer.', effects: [] }
		]
	}
];
