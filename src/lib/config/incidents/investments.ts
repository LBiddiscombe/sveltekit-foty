import type { IncidentCard } from '$lib/types/game';

export const INVESTMENTS_CARDS: IncidentCard[] = [
	{
		id: 'crypto-boom',
		category: 'investments',
		title: 'Hot Tip',
		description: 'A friend tells you about a hot new cryptocurrency.',
		outcomes: [
			{
				label: 'Invest early and ride the wave! Massive returns!',
				effects: [{ type: 'bankBalance', delta: 10, scale: 'wage' }]
			},
			{
				label: 'Modest profit. Cash out in time.',
				effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }]
			},
			{
				label: 'Coin crashes. Lost your stake.',
				effects: [{ type: 'bankBalance', delta: -4, scale: 'wage' }]
			},
			{ label: 'Do your research and pass.', effects: [] }
		]
	},
	{
		id: 'stock-market',
		category: 'investments',
		title: 'Stock Market',
		description: "You've been dabbling in the stock market.",
		outcomes: [
			{
				label: "Portfolio surges! You're a natural!",
				effects: [{ type: 'bankBalance', delta: 6, scale: 'wage' }]
			},
			{
				label: 'Steady gains. Better than savings.',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			},
			{
				label: 'Market crash. Portfolio takes a hit.',
				effects: [{ type: 'bankBalance', delta: -5, scale: 'wage' }]
			},
			{ label: 'Sell everything. Too volatile.', effects: [] }
		]
	},
	{
		id: 'tech-startup',
		category: 'investments',
		title: 'Tech Startup',
		description: 'An old school friend is launching a startup.',
		outcomes: [
			{
				label: "Exits for millions! You're rich!",
				effects: [{ type: 'bankBalance', delta: 20, scale: 'wage' }]
			},
			{
				label: 'Steady growth. Small dividends.',
				effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }]
			},
			{
				label: 'Startup folds. Investment lost.',
				effects: [{ type: 'bankBalance', delta: -4, scale: 'wage' }]
			},
			{ label: 'Pass on the opportunity.', effects: [] }
		]
	},
	{
		id: 'restaurant-investment',
		category: 'investments',
		title: 'Restaurant Investment',
		description: 'A chef friend wants you to invest in a restaurant.',
		outcomes: [
			{
				label: 'Michelin star! A sensation!',
				effects: [
					{ type: 'bankBalance', delta: 5, scale: 'wage' },
					{ type: 'morale', delta: 2 }
				]
			},
			{
				label: 'Steady trade. Decent returns.',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			},
			{
				label: 'Closes within a year. Loss made.',
				effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }]
			},
			{ label: 'Lend your name only. No cash.', effects: [] }
		]
	},
	{
		id: 'pub-investment',
		category: 'investments',
		title: 'Pub Investment',
		description: 'A former teammate wants you in on a pub.',
		outcomes: [
			{
				label: 'Becomes a local landmark! Profit!',
				effects: [{ type: 'bankBalance', delta: 4, scale: 'wage' }]
			},
			{
				label: 'Steady trade. Pints and profits flowing.',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			},
			{
				label: 'Pub fails. Investment behind the bar.',
				effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }]
			},
			{ label: 'Stick to being a customer.', effects: [] }
		]
	},
	{
		id: 'nightclub-investment',
		category: 'investments',
		title: 'Nightclub Investment',
		description: 'An opportunity to invest in a new nightclub.',
		outcomes: [
			{
				label: 'Hottest club in town! Huge profits!',
				effects: [{ type: 'bankBalance', delta: 6, scale: 'wage' }]
			},
			{
				label: 'Doing well. Regular dividends.',
				effects: [{ type: 'bankBalance', delta: 1.5, scale: 'wage' }]
			},
			{
				label: 'Noise complaints shut it down. Loss.',
				effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }]
			},
			{ label: 'Pass. Too risky.', effects: [] }
		]
	},
	{
		id: 'gym-ownership',
		category: 'investments',
		title: 'Gym Ownership',
		description: "You're considering buying a gym.",
		outcomes: [
			{
				label: 'Gym is a hit! Great passive income!',
				effects: [{ type: 'bankBalance', delta: 3, scale: 'wage' }]
			},
			{ label: 'Steady membership. Breaking even.', effects: [] },
			{
				label: 'Gym struggles. Expensive mistake.',
				effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }]
			},
			{ label: 'Keep training, not owning.', effects: [] }
		]
	},
	{
		id: 'property-investment',
		category: 'investments',
		title: 'Property Investment',
		description: "You're looking at buying a rental property.",
		outcomes: [
			{
				label: 'Property values soar! Fantastic investment!',
				effects: [{ type: 'bankBalance', delta: 8, scale: 'wage' }]
			},
			{
				label: 'Steady rental income. Solid.',
				effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }]
			},
			{
				label: 'Tenant trashes the place. Costly repairs.',
				effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }]
			},
			{ label: 'Stick with renting. No commitment.', effects: [] }
		]
	},
	{
		id: 'farmland',
		category: 'investments',
		title: 'Farmland',
		description: 'Offered a plot of farmland for investment.',
		outcomes: [
			{
				label: 'Land value triples! Agricultural gold!',
				effects: [{ type: 'bankBalance', delta: 6, scale: 'wage' }]
			},
			{
				label: 'Good harvest. Decent annual return.',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			},
			{
				label: 'Bad weather ruins crops. Loss.',
				effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }]
			},
			{ label: "Don't know farming. Pass.", effects: [] }
		]
	},
	{
		id: 'vintage-wine',
		category: 'investments',
		title: 'Vintage Wine',
		description: 'A wine merchant offers vintage Bordeaux.',
		outcomes: [
			{
				label: 'Legendary vintage! Value skyrockets!',
				effects: [{ type: 'bankBalance', delta: 5, scale: 'wage' }]
			},
			{
				label: 'Good investment. Slowly appreciates.',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			},
			{
				label: 'Wine is corked. Worthless.',
				effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }]
			},
			{ label: 'Drink it with friends. Memories instead.', effects: [{ type: 'morale', delta: 1 }] }
		]
	},
	{
		id: 'gold-investment',
		category: 'investments',
		title: 'Gold Investment',
		description: 'Gold prices are looking attractive.',
		outcomes: [
			{
				label: 'Gold rallies! Worth a fortune!',
				effects: [{ type: 'bankBalance', delta: 5, scale: 'wage' }]
			},
			{
				label: 'Prices hold steady. Safe haven.',
				effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }]
			},
			{
				label: 'Gold plummets. Bad timing.',
				effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }]
			},
			{ label: 'Keep cash under the mattress.', effects: [] }
		]
	},
	{
		id: 'classic-cars',
		category: 'investments',
		title: 'Classic Cars',
		description: "A collectors' car auction is coming up.",
		outcomes: [
			{
				label: 'Barn find! Worth a fortune restored!',
				effects: [{ type: 'bankBalance', delta: 8, scale: 'wage' }]
			},
			{
				label: 'Flip a classic for tidy profit.',
				effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }]
			},
			{
				label: 'Turns out to be a replica. Loss.',
				effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }]
			},
			{ label: 'Admire from afar. Not buying.', effects: [] }
		]
	},
	{
		id: 'rare-whisky',
		category: 'investments',
		title: 'Rare Whisky',
		description: 'A rare whisky collection is for sale.',
		outcomes: [
			{
				label: 'Includes a lost distillery! Priceless!',
				effects: [{ type: 'bankBalance', delta: 6, scale: 'wage' }]
			},
			{
				label: 'Appreciates nicely over time.',
				effects: [{ type: 'bankBalance', delta: 1.5, scale: 'wage' }]
			},
			{
				label: 'Open a bottle to celebrate. Then another...',
				effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }]
			},
			{ label: "Don't drink. Pass.", effects: [] }
		]
	},
	{
		id: 'business-partner',
		category: 'investments',
		title: 'Business Partner',
		description: 'Your business partner has gone missing.',
		outcomes: [
			{ label: 'They were on holiday. Everything fine.', effects: [] },
			{
				label: 'Handled the books poorly.',
				effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }]
			},
			{
				label: 'Absconded with the funds! Disaster!',
				effects: [{ type: 'bankBalance', delta: -8, scale: 'wage' }]
			},
			{ label: 'Insurance covers the loss. Close call.', effects: [] }
		]
	},
	{
		id: 'pension-advice',
		category: 'investments',
		title: 'Pension Advice',
		description: 'Your financial adviser wants to discuss your pension.',
		outcomes: [
			{ label: 'Excellent advice. Future secure!', effects: [{ type: 'xp', delta: 1 }] },
			{
				label: 'Sensible investments. Steady growth.',
				effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }]
			},
			{
				label: 'Adviser was a fraud. Lost everything.',
				effects: [{ type: 'bankBalance', delta: -5, scale: 'wage' }]
			},
			{ label: 'Too young to think about pensions.', effects: [] }
		]
	},
	{
		id: 'angel-investment',
		category: 'investments',
		title: 'Angel Investment',
		description: 'A young entrepreneur pitches their business.',
		outcomes: [
			{
				label: 'Company becomes a unicorn! Genius!',
				effects: [{ type: 'bankBalance', delta: 15, scale: 'wage' }]
			},
			{
				label: 'Steady growth. Regular dividends.',
				effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }]
			},
			{
				label: 'Business fails. Investment lost.',
				effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }]
			},
			{ label: 'Pass. Too early to tell.', effects: [] }
		]
	},
	{
		id: 'investment-scam',
		category: 'investments',
		title: 'Investment Scam',
		description: 'A guaranteed return investment comes your way.',
		outcomes: [
			{ label: 'Spot the scam. Report it!', effects: [{ type: 'morale', delta: 1 }] },
			{
				label: 'Invest a small amount. Get out in time.',
				effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }]
			},
			{
				label: 'Fall for it. Lose everything.',
				effects: [{ type: 'bankBalance', delta: -5, scale: 'wage' }]
			},
			{ label: 'Too good to be true. Ignore it.', effects: [] }
		]
	},
	{
		id: 'memorabilia-business',
		category: 'investments',
		title: 'Memorabilia Business',
		description: "You're selling signed memorabilia online.",
		outcomes: [
			{
				label: 'Signed shirt goes viral! Huge profits!',
				effects: [{ type: 'bankBalance', delta: 4, scale: 'wage' }]
			},
			{
				label: 'Steady sales on eBay. Nice side income.',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			},
			{ label: 'Buyer claims fake signature. Scandal.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Sign for charity. Good karma.', effects: [{ type: 'morale', delta: 1 }] }
		]
	},
	{
		id: 'clothing-brand',
		category: 'investments',
		title: 'Clothing Brand',
		description: "You're launching your own clothing line.",
		outcomes: [
			{
				label: 'Brand is a hit! Celebrities wear it!',
				effects: [
					{ type: 'bankBalance', delta: 6, scale: 'wage' },
					{ type: 'morale', delta: 2 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{
				label: 'Solid launch. Online sales steady.',
				effects: [{ type: 'bankBalance', delta: 1.5, scale: 'wage' }]
			},
			{
				label: 'Unsold stock fills your garage. Loss.',
				effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }]
			},
			{ label: 'Stick to wearing brands.', effects: [] }
		]
	},
	{
		id: 'youtube-channel',
		category: 'investments',
		title: 'YouTube Channel',
		description: "You've started a football vlog.",
		outcomes: [
			{
				label: 'Millions of subscribers! Channel explodes!',
				effects: [
					{ type: 'bankBalance', delta: 4, scale: 'wage' },
					{ type: 'morale', delta: 2 }
				]
			},
			{
				label: 'Growing steadily. Decent ad revenue.',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			},
			{ label: 'Negative comments get to you.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Too time-consuming. Stop posting.', effects: [] }
		]
	},
	{
		id: 'podcast-launch',
		category: 'investments',
		title: 'Podcast Launch',
		description: 'You and a teammate start a podcast.',
		outcomes: [
			{
				label: 'Top of the charts! Sponsors lining up!',
				effects: [{ type: 'bankBalance', delta: 3, scale: 'wage' }]
			},
			{ label: 'Decent listenership. Growing.', effects: [{ type: 'morale', delta: 1 }] },
			{
				label: 'Say something controversial. Cancelled.',
				effects: [{ type: 'morale', delta: -3 }]
			},
			{ label: 'Record one episode. Forget about it.', effects: [] }
		]
	},
	{
		id: 'football-academy',
		category: 'investments',
		title: 'Football Academy',
		description: "You're setting up a football academy for kids.",
		outcomes: [
			{
				label: 'Future star comes through! Legend!',
				effects: [
					{ type: 'bankBalance', delta: 5, scale: 'wage' },
					{ type: 'morale', delta: 3 },
					{ type: 'deckAdd', delta: 2 }
				]
			},
			{
				label: 'Growing well. Good local reputation.',
				effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }]
			},
			{
				label: 'Academy struggles financially.',
				effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }]
			},
			{ label: 'Coach a few sessions. Inspiring kids.', effects: [{ type: 'morale', delta: 1 }] }
		]
	},
	{
		id: 'esports-team',
		category: 'investments',
		title: 'Esports Team',
		description: 'Investing in an esports organisation.',
		outcomes: [
			{
				label: 'Team wins the world championship! Big returns!',
				effects: [{ type: 'bankBalance', delta: 6, scale: 'wage' }]
			},
			{
				label: 'Team performs well. Sponsorships in.',
				effects: [{ type: 'bankBalance', delta: 1.5, scale: 'wage' }]
			},
			{
				label: 'Esports bubble bursts. Investment lost.',
				effects: [{ type: 'bankBalance', delta: -4, scale: 'wage' }]
			},
			{ label: "Don't understand esports. Pass.", effects: [] }
		]
	},
	{
		id: 'coffee-shop',
		category: 'investments',
		title: 'Coffee Shop',
		description: "You're opening a coffee shop franchise.",
		outcomes: [
			{
				label: 'Best coffee in town! Queues out the door!',
				effects: [{ type: 'bankBalance', delta: 3, scale: 'wage' }]
			},
			{
				label: 'Steady trade. Regulars keep coming.',
				effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }]
			},
			{
				label: 'Another coffee shop opens next door. Bad.',
				effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }]
			},
			{ label: 'Stick to being a customer.', effects: [] }
		]
	}
];
