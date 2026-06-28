import type { IncidentCard } from '$lib/types/game';

export const MEDIA_CARDS: IncidentCard[] = [
	{
		id: 'late-night-tv',
		category: 'media',
		title: 'Late-Night TV Appearance',
		description: "You've been booked on a late-night chat show.",
		outcomes: [
			{
				label: 'Great interview — fans love you!',
				effects: [
					{ type: 'morale', delta: 2 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{
				label: 'Sponsor offers a new contract.',
				effects: [{ type: 'wageMultiplier', delta: 1.25 }]
			},
			{
				label: 'You injure your ankle during a charity challenge.',
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			},
			{ label: 'The interview is forgettable.', effects: [] }
		]
	},
	{
		id: 'magazine-interview',
		category: 'media',
		title: 'Magazine Interview',
		description: 'A national magazine wants to interview you for a feature.',
		outcomes: [
			{
				label: 'Cover story! You look fantastic.',
				effects: [
					{ type: 'morale', delta: 2 },
					{ type: 'bankBalance', delta: 2, scale: 'wage' },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Good article. Positive coverage.', effects: [{ type: 'morale', delta: 1 }] },
			{
				label: 'Quotes taken out of context. Controversy.',
				effects: [{ type: 'morale', delta: -2 }]
			},
			{ label: 'You decline the interview.', effects: [] }
		]
	},
	{
		id: 'social-media-blunder',
		category: 'media',
		title: 'Social Media Blunder',
		description: 'You posted something without thinking.',
		outcomes: [
			{
				label: 'It goes viral for all the right reasons!',
				effects: [
					{ type: 'morale', delta: 2 },
					{ type: 'bankBalance', delta: 1, scale: 'wage' }
				]
			},
			{ label: 'A few raised eyebrows but no damage.', effects: [] },
			{
				label: 'Massive backlash. Club issues a statement.',
				effects: [{ type: 'morale', delta: -3 }]
			},
			{ label: 'You delete it before anyone notices.', effects: [] }
		]
	},
	{
		id: 'viral-clip',
		category: 'media',
		title: 'Viral Clip',
		description: 'A clip of you in training has gone viral online.',
		outcomes: [
			{
				label: "Millions of views! You're trending!",
				effects: [
					{ type: 'morale', delta: 2 },
					{ type: 'bankBalance', delta: 1, scale: 'wage' }
				]
			},
			{
				label: 'Popular clip. Lots of positive comments.',
				effects: [{ type: 'morale', delta: 1 }]
			},
			{ label: 'The clip makes you look foolish.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: "You haven't seen it. Don't care.", effects: [] }
		]
	},
	{
		id: 'sponsor-photoshoot',
		category: 'media',
		title: 'Sponsor Photoshoot',
		description: 'A sponsor wants you for a new campaign.',
		outcomes: [
			{
				label: "The campaign is a smash hit! You're the face of the brand!",
				effects: [
					{ type: 'bankBalance', delta: 4, scale: 'wage' },
					{ type: 'morale', delta: 2 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{
				label: 'Professional shoot. Happy sponsor.',
				effects: [{ type: 'bankBalance', delta: 1.5, scale: 'wage' }]
			},
			{ label: 'The photos are terrible. Never used.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You decline. Not your brand.', effects: [] }
		]
	},
	{
		id: 'charity-appearance',
		category: 'media',
		title: 'Charity Appearance',
		description: "You've been asked to appear at a charity event.",
		outcomes: [
			{
				label: 'You raise a fortune! Hero of the charity!',
				effects: [{ type: 'morale', delta: 3 }]
			},
			{ label: 'Good event. Helped a worthy cause.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Low turnout. Disappointing.', effects: [{ type: 'morale', delta: -1 }] },
			{
				label: "You donate but can't attend.",
				effects: [{ type: 'bankBalance', delta: -0.5, scale: 'wage' }]
			}
		]
	},
	{
		id: 'autograph-session',
		category: 'media',
		title: 'Autograph Session',
		description: 'The club has scheduled an autograph session with fans.',
		outcomes: [
			{ label: 'Huge queue! Fans adore you!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Steady turnout. Happy fans.', effects: [] },
			{ label: 'Hardly anyone shows up. Awkward.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Your hand cramps up. Worth it.', effects: [] }
		]
	},
	{
		id: 'press-criticism',
		category: 'media',
		title: 'Press Criticism',
		description: 'A pundit has criticised your recent form.',
		outcomes: [
			{
				label: 'You prove them wrong with a masterclass.',
				effects: [
					{ type: 'xp', delta: 3 },
					{ type: 'morale', delta: 1 }
				]
			},
			{ label: 'You shrug it off. Part of the game.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'The criticism gets in your head.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You fire back in the press. Bad move.', effects: [{ type: 'morale', delta: -1 }] }
		]
	},
	{
		id: 'press-praise',
		category: 'media',
		title: 'Press Praise',
		description: 'The media has been full of praise for you.',
		outcomes: [
			{
				label: 'Comparisons to club legends! Humbling!',
				effects: [
					{ type: 'morale', delta: 3 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Nice words. Motivates you further.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'The praise puts unwanted pressure on.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: "You don't read the papers.", effects: [] }
		]
	},
	{
		id: 'tabloid-rumour',
		category: 'media',
		title: 'Tabloid Rumour',
		description: 'The tabloids are running a story about you.',
		outcomes: [
			{
				label: 'The story is completely false. Fans support you.',
				effects: [{ type: 'morale', delta: 1 }]
			},
			{ label: 'Embarrassing but harmless story.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Damaging allegations. Club backs you.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: "You ignore it. Don't feed the trolls.", effects: [] }
		]
	},
	{
		id: 'documentary',
		category: 'media',
		title: 'Documentary',
		description: 'A film crew wants to follow you for a documentary.',
		outcomes: [
			{
				label: "Critically acclaimed! You're a star!",
				effects: [
					{ type: 'morale', delta: 3 },
					{ type: 'bankBalance', delta: 5, scale: 'wage' },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Interesting project. Makes you reflect.', effects: [{ type: 'morale', delta: 1 }] },
			{
				label: 'The documentary is controversial. Bad edit.',
				effects: [{ type: 'morale', delta: -2 }]
			},
			{ label: 'You decline. Keep your private life private.', effects: [] }
		]
	},
	{
		id: 'fan-event',
		category: 'media',
		title: 'Fan Event',
		description: "The club is hosting a fan event and you're the guest.",
		outcomes: [
			{ label: 'Electric atmosphere! Fans love the Q&A!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Good turnout. Positive vibes.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Tough questions from angry fans.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You send a video message instead.', effects: [] }
		]
	},
	{
		id: 'school-visit',
		category: 'media',
		title: 'School Visit',
		description: "You're visiting a local school to inspire kids.",
		outcomes: [
			{
				label: 'The kids are inspired. Future footballer in the making!',
				effects: [{ type: 'morale', delta: 2 }]
			},
			{ label: 'Fun visit. The kids loved the stories.', effects: [{ type: 'morale', delta: 1 }] },
			{
				label: "A kid asks why you're overpaid. Tough crowd.",
				effects: [{ type: 'morale', delta: -1 }]
			},
			{ label: 'You cancel. Training comes first.', effects: [] }
		]
	},
	{
		id: 'stadium-mural',
		category: 'media',
		title: 'Stadium Mural',
		description: 'Fans have painted a mural of you near the stadium.',
		outcomes: [
			{
				label: "Incredible artwork! You're immortalised!",
				effects: [
					{ type: 'morale', delta: 3 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Touching tribute. You sign it.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'The mural is vandalised. Sad.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: "You haven't seen it yet.", effects: [] }
		]
	},
	{
		id: 'podcast-interview',
		category: 'media',
		title: 'Podcast Interview',
		description: 'A popular football podcast wants you on the show.',
		outcomes: [
			{ label: 'Brilliant interview. Clip goes viral!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Good chat. Honest and fun.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'You reveal too much. Media frenzy.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: "You decline. Podcasts aren't your thing.", effects: [] }
		]
	},
	{
		id: 'public-apology',
		category: 'media',
		title: 'Public Apology',
		description: 'You need to issue a public apology for recent events.',
		outcomes: [
			{
				label: 'Sincere apology accepted. Reputation restored.',
				effects: [{ type: 'morale', delta: 1 }]
			},
			{ label: 'Apology accepted. Move on.', effects: [] },
			{ label: 'The apology makes things worse.', effects: [{ type: 'morale', delta: -2 }] },
			{
				label: 'You refuse to apologise. Stand your ground.',
				effects: [{ type: 'morale', delta: -1 }]
			}
		]
	},
	{
		id: 'fashion-award',
		category: 'media',
		title: 'Fashion Award',
		description: "You've been nominated for a fashion award.",
		outcomes: [
			{
				label: 'You win! Best dressed athlete!',
				effects: [
					{ type: 'morale', delta: 2 },
					{ type: 'bankBalance', delta: 1, scale: 'wage' },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Honoured to be nominated.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: "You're ridiculed for your outfit.", effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You skip the ceremony.', effects: [] }
		]
	},
	{
		id: 'community-hero',
		category: 'media',
		title: 'Community Hero',
		description: 'Your community work has been recognised.',
		outcomes: [
			{
				label: 'Awarded a community honour! Incredible recognition!',
				effects: [
					{ type: 'morale', delta: 3 },
					{ type: 'xp', delta: 2 }
				]
			},
			{
				label: 'Certificate of appreciation. Meaningful.',
				effects: [{ type: 'morale', delta: 1 }]
			},
			{ label: "Some say it's just for PR. Unfair.", effects: [{ type: 'morale', delta: -1 }] },
			{
				label: 'You donate quietly. No need for recognition.',
				effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }]
			}
		]
	},
	{
		id: 'tv-quiz-show',
		category: 'media',
		title: 'TV Quiz Show',
		description: "You've been invited to appear on a TV quiz show.",
		outcomes: [
			{
				label: 'You win the jackpot! Footballer with brains!',
				effects: [
					{ type: 'bankBalance', delta: 5, scale: 'wage' },
					{ type: 'morale', delta: 2 }
				]
			},
			{
				label: 'Decent performance. Raised money for charity.',
				effects: [{ type: 'morale', delta: 1 }]
			},
			{
				label: 'You get eliminated early. Embarrassing.',
				effects: [{ type: 'morale', delta: -1 }]
			},
			{ label: 'You decline. Not a quiz person.', effects: [] }
		]
	},
	{
		id: 'mascot-challenge',
		category: 'media',
		title: 'Mascot Challenge',
		description: 'The club mascot challenges you to a charity contest.',
		outcomes: [
			{
				label: 'You destroy the mascot. Hilarious!',
				effects: [
					{ type: 'morale', delta: 2 },
					{ type: 'bankBalance', delta: 0.5, scale: 'wage' }
				]
			},
			{ label: 'Fun contest. Crowd loves it.', effects: [{ type: 'morale', delta: 1 }] },
			{
				label: 'The mascot beats you. Never live it down.',
				effects: [{ type: 'morale', delta: -2 }]
			},
			{ label: 'You skip it. Too silly.', effects: [] }
		]
	}
];
