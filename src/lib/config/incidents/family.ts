import type { IncidentCard } from '$lib/types/game';

export const FAMILY_CARDS: IncidentCard[] = [
	{
		id: 'new-baby',
		category: 'family',
		title: 'New Arrival',
		description: 'Your partner gives birth to a healthy baby.',
		outcomes: [
			{ label: 'Beautiful baby. Crowd sings your name!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Mother and baby well. Feel invincible.', effects: [{ type: 'xp', delta: 3 }] },
			{ label: 'Lack of sleep killing training.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Healthy baby. Life is good.', effects: [] }
		]
	},
	{
		id: 'marriage',
		category: 'family',
		title: 'Wedding Bells',
		description: 'You\'re getting married!',
		outcomes: [
			{ label: 'Perfect day! Best day of your life!', effects: [{ type: 'morale', delta: 3 }] },
			{ label: 'Lovely ceremony. Honeymoon awaits.', effects: [{ type: 'morale', delta: 2 }, { type: 'bankBalance', delta: -3, scale: 'wage' }] },
			{ label: 'The wedding is a disaster. Expensive and stressful.', effects: [{ type: 'morale', delta: -2 }, { type: 'bankBalance', delta: -3, scale: 'wage' }] },
			{ label: 'Small ceremony. Intimate and perfect.', effects: [{ type: 'morale', delta: 1 }] }
		]
	},
	{
		id: 'divorce',
		category: 'family',
		title: 'Divorce',
		description: 'Your marriage is ending in divorce.',
		outcomes: [
			{ label: 'Clean break. Amicable settlement.', effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }] },
			{ label: 'Messy divorce. Took everything.', effects: [{ type: 'bankBalance', delta: -8, scale: 'wage' }, { type: 'morale', delta: -3 }] },
			{ label: 'You reconcile. Working things out.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Focus on football. Distraction helps.', effects: [{ type: 'xp', delta: 2 }] }
		]
	},
	{
		id: 'twins',
		category: 'family',
		title: 'Double Trouble',
		description: 'You\'re having twins!',
		outcomes: [
			{ label: 'Double the joy! Feeling blessed!', effects: [{ type: 'morale', delta: 3 }] },
			{ label: 'Exciting news. Double the nappies.', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'No sleep at all. Exhausting.', effects: [{ type: 'appearanceSkip', delta: 2 }] },
			{ label: 'You hire help. Manageable.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] }
		]
	},
	{
		id: 'adopt-child',
		category: 'family',
		title: 'Adoption',
		description: 'You\'re adopting a child.',
		outcomes: [
			{ label: 'The child settles in. Family complete!', effects: [{ type: 'morale', delta: 3 }] },
			{ label: 'Long process but worth it.', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Legal complications. Stressful.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You decide to wait.', effects: [] }
		]
	},
	{
		id: 'parents-visit',
		category: 'family',
		title: 'Parents Visit',
		description: 'Your parents are coming to stay for the weekend.',
		outcomes: [
			{ label: 'Lovely weekend. Mum\'s cooking is the best!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Good to see them. They\'re proud.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Dad critiques your last match. Annoying.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You\'re away. Postpone the visit.', effects: [] }
		]
	},
	{
		id: 'sibling-loan',
		category: 'family',
		title: 'Sibling Loan',
		description: 'Your sibling has asked for a loan.',
		outcomes: [
			{ label: 'They pay it back with interest!', effects: [{ type: 'bankBalance', delta: 1.5, scale: 'wage' }] },
			{ label: 'You help them out. Family first.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'They never pay you back. Lesson learned.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }, { type: 'morale', delta: -1 }] },
			{ label: 'You can\'t afford it. Say no.', effects: [] }
		]
	},
	{
		id: 'family-holiday',
		category: 'family',
		title: 'Family Holiday',
		description: 'You\'re taking the family on holiday.',
		outcomes: [
			{ label: 'Best holiday ever! Family memories!', effects: [{ type: 'morale', delta: 3 }] },
			{ label: 'Lovely break. Everyone had fun.', effects: [{ type: 'morale', delta: 1 }, { type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'Rain every day. Disastrous trip.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You book a staycation. Less hassle.', effects: [{ type: 'bankBalance', delta: -0.5, scale: 'wage' }] }
		]
	},
	{
		id: 'birthday',
		category: 'family',
		title: 'Birthday',
		description: 'It\'s your birthday!',
		outcomes: [
			{ label: 'Teammates throw a surprise party! Amazing!', effects: [{ type: 'morale', delta: 3 }] },
			{ label: 'Nice birthday. Presents and cake.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Nobody remembered. Bit sad.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You keep it low-key.', effects: [] }
		]
	},
	{
		id: 'anniversary',
		category: 'family',
		title: 'Anniversary',
		description: 'It\'s your wedding anniversary.',
		outcomes: [
			{ label: 'Romantic surprise! Partner over the moon!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Lovely dinner together. Happy anniversary.', effects: [{ type: 'morale', delta: 1 }, { type: 'bankBalance', delta: -1, scale: 'wage' }] },
			{ label: 'You completely forgot. In trouble.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Celebrate next week. Busy season.', effects: [] }
		]
	},
	{
		id: 'family-illness',
		category: 'family',
		title: 'Family Illness',
		description: 'A family member has fallen ill.',
		outcomes: [
			{ label: 'They recover quickly. Relief.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Hospital visit. They\'re stable.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Serious condition. You take time off.', effects: [{ type: 'appearanceSkip', delta: 2 }] },
			{ label: 'False alarm. Just a cold.', effects: [] }
		]
	},
	{
		id: 'house-move',
		category: 'family',
		title: 'House Move',
		description: 'You\'re moving to a new house.',
		outcomes: [
			{ label: 'Dream home! Everything is perfect!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Good move. Settling in nicely.', effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }] },
			{ label: 'Moving is chaos. Stressful week.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You hire movers. Smooth.', effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }] }
		]
	},
	{
		id: 'neighbour-dispute',
		category: 'family',
		title: 'Neighbour Dispute',
		description: 'Your neighbour has a noise complaint.',
		outcomes: [
			{ label: 'Resolve it amicably. New friends!', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'You apologise. Keep it down.', effects: [] },
			{ label: 'Police called. Formal complaint.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'They\'re moving out. Problem solved.', effects: [] }
		]
	},
	{
		id: 'inheritance',
		category: 'family',
		title: 'Inheritance',
		description: 'A relative left you something in their will.',
		outcomes: [
			{ label: 'Substantial inheritance! Life-changing!', effects: [{ type: 'bankBalance', delta: 10, scale: 'wage' }] },
			{ label: 'Modest sum. A thoughtful gift.', effects: [{ type: 'bankBalance', delta: 3, scale: 'wage' }] },
			{ label: 'Tax eats most of it.', effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }] },
			{ label: 'Left out of the will. No hard feelings.', effects: [] }
		]
	},
	{
		id: 'cousin-help',
		category: 'family',
		title: 'Cousin in Need',
		description: 'Your cousin needs help with a business idea.',
		outcomes: [
			{ label: 'The business takes off! Genius!', effects: [{ type: 'bankBalance', delta: 4, scale: 'wage' }] },
			{ label: 'You help out. Nice to support family.', effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }] },
			{ label: 'The business fails. Lost contribution.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'You offer advice instead of cash.', effects: [] }
		]
	},
	{
		id: 'new-pet',
		category: 'family',
		title: 'New Pet',
		description: 'You\'re getting a new family pet.',
		outcomes: [
			{ label: 'Adorable! Instant family favourite!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Cute addition to the family.', effects: [] },
			{ label: 'Destroys your boots. Again.', effects: [{ type: 'bankBalance', delta: -0.5, scale: 'wage' }] },
			{ label: 'You\'re allergic. Pet goes back.', effects: [{ type: 'morale', delta: -1 }] }
		]
	},
	{
		id: 'retirement-party',
		category: 'family',
		title: 'Retirement Party',
		description: 'Organising a retirement party for a family member.',
		outcomes: [
			{ label: 'Beautiful event. Everyone emotional.', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Nice gathering. Good food, goodbyes.', effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }] },
			{ label: 'The party is a disaster. Catering fails.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You send a gift. Can\'t make it.', effects: [{ type: 'bankBalance', delta: -0.3, scale: 'wage' }] }
		]
	},
	{
		id: 'family-reunion',
		category: 'family',
		title: 'Family Reunion',
		description: 'A big family reunion is coming up.',
		outcomes: [
			{ label: 'Wonderful to see everyone! Best reunion!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Good catch-up. Auntie\'s pie is amazing.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Family drama. Arguments all day.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You send your regrets. Too busy.', effects: [] }
		]
	},
	{
		id: 'relative-agent',
		category: 'family',
		title: 'Relative as Agent',
		description: 'Your relative wants to become your agent.',
		outcomes: [
			{ label: 'They negotiate brilliantly! Better than your old agent!', effects: [{ type: 'wageMultiplier', delta: 1.4 }] },
			{ label: 'They try hard. Decent job.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'They have no idea what they\'re doing.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You politely decline. Keep it professional.', effects: [] }
		]
	},
	{
		id: 'wedding-anniversary',
		category: 'family',
		title: 'Wedding Anniversary',
		description: 'It\'s your anniversary. Have you remembered?',
		outcomes: [
			{ label: 'You planned a romantic surprise. Big points!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'You remembered just in time. Phew.', effects: [{ type: 'bankBalance', delta: -0.5, scale: 'wage' }] },
			{ label: 'You forgot. Sleeping on the sofa.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You celebrate next weekend. All good.', effects: [] }
		]
	},
	{
		id: 'rich-uncle',
		category: 'family',
		title: 'Rich Uncle',
		description: 'Your wealthy uncle wants to give you a gift.',
		outcomes: [
			{ label: 'A generous cash gift! He\'s the best!', effects: [{ type: 'bankBalance', delta: 5, scale: 'wage' }] },
			{ label: 'A thoughtful present. Appreciated.', effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }] },
			{ label: 'The gift comes with strings attached.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You decline. Let him keep his money.', effects: [] }
		]
	}
];
