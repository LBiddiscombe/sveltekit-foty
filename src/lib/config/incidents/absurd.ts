import type { IncidentCard } from '$lib/types/game';

export const ABSURD_CARDS: IncidentCard[] = [
	{
		id: 'dog-eats-boots',
		category: 'absurd',
		title: 'Chewed Up',
		description: 'Your new puppy has chewed through your match-day boots.',
		outcomes: [
			{ label: 'You find old lucky boots in your locker. Play out of your skin!', effects: [{ type: 'xp', delta: 3 }] },
			{ label: 'The kit man lends you a spare pair. No harm done.', effects: [] },
			{ label: 'The new boots give you blisters. Subbed off early.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'You buy a new pair at the club shop.', effects: [{ type: 'bankBalance', delta: -0.5, scale: 'wage' }] }
		]
	},
	{
		id: 'goose-attack',
		category: 'absurd',
		title: 'Goose Attack',
		description: 'A territorial goose has taken over the training pitch.',
		outcomes: [
			{ label: 'You befriend the goose. Mascot material!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'You avoid the goose. Training moves elsewhere.', effects: [] },
			{ label: 'The goose chases you. Pulled a muscle fleeing.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'You watch from afar. Hilarious chaos.', effects: [{ type: 'morale', delta: 1 }] }
		]
	},
	{
		id: 'cursed-shirt',
		category: 'absurd',
		title: 'Cursed Shirt',
		description: 'A fan claims your shirt is cursed after a bad run.',
		outcomes: [
			{ label: 'You score a hat-trick. Curse broken!', effects: [{ type: 'xp', delta: 3 }, { type: 'morale', delta: 2 }] },
			{ label: 'You laugh it off. Just a shirt.', effects: [] },
			{ label: 'You change shirt numbers. Bad form continues.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You burn the shirt. Ritual complete.', effects: [{ type: 'bankBalance', delta: -0.2, scale: 'wage' }] }
		]
	},
	{
		id: 'lucky-haircut',
		category: 'absurd',
		title: 'Lucky Haircut',
		description: 'You got a new haircut and played well. Now you\'re superstitious.',
		outcomes: [
			{ label: 'The lucky haircut keeps working! Form of your life!', effects: [{ type: 'xp', delta: 3 }, { type: 'morale', delta: 2 }] },
			{ label: 'Decent form. Maybe the haircut helps.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'The haircut looks terrible. Confidence shot.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You get the same haircut every week. Routine.', effects: [] }
		]
	},
	{
		id: 'phone-hacked',
		category: 'absurd',
		title: 'Phone Hacked',
		description: 'Your phone has been hacked. Private messages leaked.',
		outcomes: [
			{ label: 'The messages are wholesome. Reputation boosted!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Embarrassing but harmless content.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Private team tactics leaked. Club furious.', effects: [{ type: 'morale', delta: -3 }] },
			{ label: 'You secure your phone. No damage done.', effects: [] }
		]
	},
	{
		id: 'drone-crash',
		category: 'absurd',
		title: 'Drone Crash',
		description: 'A drone filming training has crashed into the pitch.',
		outcomes: [
			{ label: 'You catch it one-handed. Incredible reflexes!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Training paused. Slight delay.', effects: [] },
			{ label: 'You trip over the drone. Twisted ankle.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'The drone owner is your biggest fan. Autograph time.', effects: [{ type: 'morale', delta: 1 }] }
		]
	},
	{
		id: 'parrot-swear',
		category: 'absurd',
		title: 'Parrot Trouble',
		description: 'Your parrot has learned to swear. It happened at a press conference.',
		outcomes: [
			{ label: 'The clip goes viral. You become a meme legend!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Everyone laughs. Good-natured ribbing.', effects: [] },
			{ label: 'The club is not amused. Formal warning.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You rehome the parrot. Problem solved.', effects: [] }
		]
	},
	{
		id: 'lookalike',
		category: 'absurd',
		title: 'Lookalike',
		description: 'A fan photo of your lookalike is doing the rounds.',
		outcomes: [
			{ label: 'The lookalike is handsome! You\'re flattered.', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Amusing resemblance. Good for a laugh.', effects: [] },
			{ label: 'The lookalike is a criminal. Mistaken identity.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You meet the lookalike. Become friends!', effects: [{ type: 'morale', delta: 1 }] }
		]
	},
	{
		id: 'escaped-sheep',
		category: 'absurd',
		title: 'Escaped Sheep',
		description: 'A flock of sheep has escaped onto the training ground.',
		outcomes: [
			{ label: 'You herd them like a pro. Farmer impressed!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Training delayed. Amusing distraction.', effects: [] },
			{ label: 'You trip over a sheep. Injured.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'The sheep become unofficial mascots.', effects: [{ type: 'morale', delta: 1 }] }
		]
	},
	{
		id: 'horse-kick',
		category: 'absurd',
		title: 'Horse Kick',
		description: 'You visited a stable and a horse kicked you.',
		outcomes: [
			{ label: 'Bruised but fine. Tough as nails!', effects: [] },
			{ label: 'Broken rib. Painful recovery.', effects: [{ type: 'appearanceSkip', delta: 2 }] },
			{ label: 'Just a scare. Horse missed you.', effects: [] },
			{ label: 'You buy the horse. Can\'t stay mad at it.', effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }] }
		]
	},
	{
		id: 'exotic-snake',
		category: 'absurd',
		title: 'Snake in the House',
		description: 'Your exotic pet snake has escaped in your home.',
		outcomes: [
			{ label: 'You find it. Drama over. Snake secured.', effects: [] },
			{ label: 'The neighbours call the police. Chaos.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'It turns up in your boot. Traumatic.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'You sell the snake. Too much hassle.', effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }] }
		]
	}
];
