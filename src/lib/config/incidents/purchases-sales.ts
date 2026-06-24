import type { IncidentCard } from '$lib/types/game';

export const PURCHASES_CARDS: IncidentCard[] = [
	{
		id: 'luxury-watch',
		category: 'purchases-sales',
		title: 'Luxury Watch',
		description: 'You\'ve been eyeing a limited-edition luxury watch.',
		outcomes: [
			{ label: 'Appreciates in value. Shrewd investment!', effects: [{ type: 'morale', delta: 1 }, { type: 'bankBalance', delta: 3, scale: 'wage' }] },
			{ label: 'You treat yourself. Looks great.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'You buy a fake. Embarrassing.', effects: [{ type: 'morale', delta: -1 }, { type: 'bankBalance', delta: -1, scale: 'wage' }] },
			{ label: 'You decide saving is smarter.', effects: [] }
		]
	},
	{
		id: 'sports-car',
		category: 'purchases-sales',
		title: 'Sports Car',
		description: 'You\'ve been looking at a new sports car.',
		outcomes: [
			{ label: 'Turn heads everywhere. Feels incredible!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Fun car. Weekend drives are a joy.', effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }] },
			{ label: 'Insurance is astronomical. Money pit.', effects: [{ type: 'bankBalance', delta: -4, scale: 'wage' }] },
			{ label: 'You stick with your sensible hatchback.', effects: [] }
		]
	},
	{
		id: 'beach-house',
		category: 'purchases-sales',
		title: 'Beach House',
		description: 'A beach house has come on the market.',
		outcomes: [
			{ label: 'Perfect getaway. Value doubles!', effects: [{ type: 'morale', delta: 2 }, { type: 'bankBalance', delta: 4, scale: 'wage' }] },
			{ label: 'Lovely weekends by the sea.', effects: [{ type: 'bankBalance', delta: -4, scale: 'wage' }] },
			{ label: 'Storm damage. Costly repairs.', effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }] },
			{ label: 'Rent one when you need a break.', effects: [] }
		]
	},
	{
		id: 'racehorse',
		category: 'purchases-sales',
		title: 'Racehorse',
		description: 'You\'ve been offered a share in a racehorse.',
		outcomes: [
			{ label: 'Wins the Derby! Massive payout!', effects: [{ type: 'bankBalance', delta: 10, scale: 'wage' }, { type: 'morale', delta: 3 }] },
			{ label: 'Placed in several races. Decent returns.', effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }] },
			{ label: 'Pulls up lame. Expensive vet bills.', effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }] },
			{ label: 'A horse is a lot of work. You pass.', effects: [] }
		]
	},
	{
		id: 'speedboat',
		category: 'purchases-sales',
		title: 'Speedboat',
		description: 'You\'ve been looking at speedboats.',
		outcomes: [
			{ label: 'Weekends on the water. Absolute blast!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Fun toy. Expensive to maintain.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'Engine blows on first trip. Nightmare.', effects: [{ type: 'bankBalance', delta: -4, scale: 'wage' }] },
			{ label: 'Stick to the beach. Less hassle.', effects: [] }
		]
	},
	{
		id: 'home-cinema',
		category: 'purchases-sales',
		title: 'Home Cinema',
		description: 'You\'re building a home cinema room.',
		outcomes: [
			{ label: 'Incredible setup. Movie nights with the lads!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Great for match replays. Worth it.', effects: [{ type: 'bankBalance', delta: -1.5, scale: 'wage' }] },
			{ label: 'Projector breaks. Expensive repair.', effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }] },
			{ label: 'Watch on your laptop. Good enough.', effects: [] }
		]
	},
	{
		id: 'swimming-pool',
		category: 'purchases-sales',
		title: 'Swimming Pool',
		description: 'You\'re thinking of installing a swimming pool.',
		outcomes: [
			{ label: 'Amazing for recovery. Best decision ever!', effects: [{ type: 'xp', delta: 2 }, { type: 'morale', delta: 2 }] },
			{ label: 'Great for parties and fitness.', effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }] },
			{ label: 'Maintenance nightmare. Money pit.', effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }] },
			{ label: 'Use the club pool. Free.', effects: [] }
		]
	},
	{
		id: 'designer-wardrobe',
		category: 'purchases-sales',
		title: 'Designer Wardrobe',
		description: 'You\'ve been on a designer shopping spree.',
		outcomes: [
			{ label: 'Look like a million dollars. Feel unstoppable!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Sharp new look. Compliments all round.', effects: [{ type: 'bankBalance', delta: -1.5, scale: 'wage' }] },
			{ label: 'Mocked for wearing last season. Ouch.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Shop at the high street. No labels needed.', effects: [] }
		]
	},
	{
		id: 'art-collection',
		category: 'purchases-sales',
		title: 'Art Collection',
		description: 'You\'ve started buying contemporary art.',
		outcomes: [
			{ label: 'One piece is a lost masterpiece!', effects: [{ type: 'bankBalance', delta: 8, scale: 'wage' }] },
			{ label: 'Tasteful collection. Adds class.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'Bought a print. Paid for an original.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }, { type: 'morale', delta: -1 }] },
			{ label: 'Don\'t get art. Walls stay bare.', effects: [] }
		]
	},
	{
		id: 'exotic-pet',
		category: 'purchases-sales',
		title: 'Exotic Pet',
		description: 'You\'ve always wanted an exotic pet.',
		outcomes: [
			{ label: 'Pet becomes famous on social media!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Unique pet. Conversation starter.', effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }] },
			{ label: 'The pet escapes. Chaos ensues!', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Get a cat instead. Much simpler.', effects: [] }
		]
	},
	{
		id: 'helicopter-lessons',
		category: 'purchases-sales',
		title: 'Helicopter Lessons',
		description: 'You\'ve signed up for helicopter pilot lessons.',
		outcomes: [
			{ label: 'Get your licence! Fly to matches!', effects: [{ type: 'morale', delta: 3 }] },
			{ label: 'Great skill. Enjoying the lessons.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'Terrible at it. Wasted money.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'Fear of heights. Cancel the lessons.', effects: [] }
		]
	},
	{
		id: 'motorbike',
		category: 'purchases-sales',
		title: 'Motorbike',
		description: 'You\'ve been looking at a powerful motorbike.',
		outcomes: [
			{ label: 'Feel the wind. Incredible freedom!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Nice bike. Weekend thrills.', effects: [{ type: 'bankBalance', delta: -1.5, scale: 'wage' }] },
			{ label: 'You come off it. Minor injuries.', effects: [{ type: 'appearanceSkip', delta: 2 }] },
			{ label: 'Too dangerous. Stick to four wheels.', effects: [] }
		]
	},
	{
		id: 'tax-rebate',
		category: 'purchases-sales',
		title: 'Tax Rebate',
		description: 'Your accountant found a tax overpayment.',
		outcomes: [
			{ label: 'Massive rebate! The taxman owes you!', effects: [{ type: 'bankBalance', delta: 5, scale: 'wage' }] },
			{ label: 'Nice rebate. Unexpected windfall.', effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }] },
			{ label: 'You owe more tax. Expensive mistake.', effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }] },
			{ label: 'Up to date. Nothing owed.', effects: [] }
		]
	},
	{
		id: 'lost-wallet',
		category: 'purchases-sales',
		title: 'Lost Wallet',
		description: 'You\'ve lost your wallet somewhere.',
		outcomes: [
			{ label: 'A fan returns it intact! Faith restored!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Found down the back of the sofa.', effects: [] },
			{ label: 'Gone forever. Cards replaced.', effects: [{ type: 'bankBalance', delta: -0.5, scale: 'wage' }] },
			{ label: 'Cancel everything instantly. No damage.', effects: [] }
		]
	},
	{
		id: 'garage-sale',
		category: 'purchases-sales',
		title: 'Garage Sale',
		description: 'You\'re clearing out the garage with a sale.',
		outcomes: [
			{ label: 'Collector spots your old shirt. Pays a fortune!', effects: [{ type: 'bankBalance', delta: 3, scale: 'wage' }] },
			{ label: 'Cleared junk. Made some cash.', effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }] },
			{ label: 'Sold your lucky boots. Bad karma.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Nobody came. Waste of a Saturday.', effects: [] }
		]
	},
	{
		id: 'auction-win',
		category: 'purchases-sales',
		title: 'Auction Win',
		description: 'You won a lot at a memorabilia auction.',
		outcomes: [
			{ label: 'Rare programme. Value skyrockets!', effects: [{ type: 'bankBalance', delta: 5, scale: 'wage' }] },
			{ label: 'Nice addition to your collection.', effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }] },
			{ label: 'You overpaid. Nobody else bid.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'Outbid at the last second.', effects: [] }
		]
	},
	{
		id: 'holiday-cruise',
		category: 'purchases-sales',
		title: 'Holiday Cruise',
		description: 'You\'re booking a luxury cruise.',
		outcomes: [
			{ label: 'Incredible trip! Feel rejuvenated!', effects: [{ type: 'morale', delta: 3 }] },
			{ label: 'Relaxing break. Exactly what you needed.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'You get seasick. Miserable week.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Book a villa instead. More privacy.', effects: [{ type: 'bankBalance', delta: -1.5, scale: 'wage' }] }
		]
	},
	{
		id: 'jewellery-gift',
		category: 'purchases-sales',
		title: 'Jewellery Gift',
		description: 'You want to buy special jewellery as a gift.',
		outcomes: [
			{ label: 'Beloved gift. Best partner ever!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Lovely gift. Much appreciated.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'Wrong size. Awkward return.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Buy a card instead. Thoughtful.', effects: [] }
		]
	},
	{
		id: 'golf-clubs',
		category: 'purchases-sales',
		title: 'Golf Clubs',
		description: 'You invested in custom golf clubs.',
		outcomes: [
			{ label: 'Knock strokes off your handicap! Worth every penny!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Nice clubs. Enjoying the game more.', effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }] },
			{ label: 'Still can\'t hit straight. Clubs aren\'t the problem.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Borrow a mate\'s set. Good enough.', effects: [] }
		]
	},
	{
		id: 'trophy-cabinet',
		category: 'purchases-sales',
		title: 'Trophy Cabinet',
		description: 'You need a proper cabinet for your awards.',
		outcomes: [
			{ label: 'Beautiful cabinet. Collection looks elite!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Fits perfectly. Medals displayed proudly.', effects: [{ type: 'bankBalance', delta: -0.5, scale: 'wage' }] },
			{ label: 'Shelf collapses. Broken trophies everywhere.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Keep them in a box. Humble.', effects: [] }
		]
	},
	{
		id: 'insurance-payout',
		category: 'purchases-sales',
		title: 'Insurance Payout',
		description: 'You filed an insurance claim.',
		outcomes: [
			{ label: 'Approved in full! Generous payout!', effects: [{ type: 'bankBalance', delta: 5, scale: 'wage' }] },
			{ label: 'Approved. Deductible applied.', effects: [{ type: 'bankBalance', delta: 1.5, scale: 'wage' }] },
			{ label: 'Rejected. Policy doesn\'t cover it.', effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }] },
			{ label: 'Too much paperwork. You drop it.', effects: [] }
		]
	}
];
