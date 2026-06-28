import type { IncidentCard } from '$lib/types/game';

export const TRAINING_CARDS: IncidentCard[] = [
	{
		id: 'pulled-hamstring',
		category: 'training',
		title: 'Pulled Hamstring',
		description: 'You feel a sharp pull during sprint drills.',
		outcomes: [
			{ label: 'Physio works magic. Come back stronger!', effects: [{ type: 'xp', delta: 2 }] },
			{ label: "Few days rest. You'll be right.", effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{
				label: 'Grade two strain. Weeks on the sidelines.',
				effects: [{ type: 'appearanceSkip', delta: 2 }]
			},
			{ label: 'Just a cramp. Shake it off.', effects: [] }
		]
	},
	{
		id: 'sprained-ankle',
		category: 'training',
		title: 'Sprained Ankle',
		description: 'You rolled your ankle during a tackle in training.',
		outcomes: [
			{ label: 'Minor sprain. Strapped up and ready.', effects: [] },
			{ label: "Week of physio. You'll be back.", effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{
				label: 'Ligament damage. Out for a while.',
				effects: [{ type: 'appearanceSkip', delta: 3 }]
			},
			{ label: 'Walk it off. Tough as nails.', effects: [] }
		]
	},
	{
		id: 'broken-toe',
		category: 'training',
		title: 'Broken Toe',
		description: 'You stubbed your toe badly against a door frame.',
		outcomes: [
			{
				label: 'Hairline fracture. Play through the pain.',
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			},
			{ label: 'Clean break. Month in a boot.', effects: [{ type: 'appearanceSkip', delta: 4 }] },
			{ label: "Just bruising. You're fine.", effects: [] },
			{
				label: 'Needs surgery. Season could be over.',
				effects: [{ type: 'appearanceSkip', delta: 6 }]
			}
		]
	},
	{
		id: 'concussion',
		category: 'training',
		title: 'Concussion',
		description: 'You took a knock to the head during a heading drill.',
		outcomes: [
			{ label: 'Cleared after assessment. Good to go.', effects: [] },
			{ label: 'Protocol says a week off. Safe.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{
				label: 'Symptoms persist. Extended rest.',
				effects: [{ type: 'appearanceSkip', delta: 2 }]
			},
			{ label: 'Just dizzy. Fine after a minute.', effects: [] }
		]
	},
	{
		id: 'food-poisoning',
		category: 'training',
		title: 'Food Poisoning',
		description: "You've come down with food poisoning.",
		outcomes: [
			{ label: 'Recover quickly. Back in training.', effects: [] },
			{
				label: 'Few days in bed. Weak as a kitten.',
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			},
			{ label: 'Hospital visit. Dehydrated.', effects: [{ type: 'appearanceSkip', delta: 2 }] },
			{ label: 'Blame the team buffet.', effects: [{ type: 'morale', delta: -1 }] }
		]
	},
	{
		id: 'the-flu',
		category: 'training',
		title: 'The Flu',
		description: 'Struck down by the winter flu.',
		outcomes: [
			{ label: 'Fight through it. Back in days.', effects: [] },
			{ label: 'Bed rest for a week.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Complications. Two weeks out.', effects: [{ type: 'appearanceSkip', delta: 2 }] },
			{ label: 'Get the jab. No time for flu.', effects: [] }
		]
	},
	{
		id: 'muscle-strain',
		category: 'training',
		title: 'Muscle Strain',
		description: 'A twinge in your calf during a sprint.',
		outcomes: [
			{ label: 'Ice and rest. Good as new.', effects: [] },
			{ label: 'Calf strain. Week of physio.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Tear in the muscle. Weeks out.', effects: [{ type: 'appearanceSkip', delta: 3 }] },
			{ label: 'Play through it. Risking damage.', effects: [{ type: 'appearanceSkip', delta: 1 }] }
		]
	},
	{
		id: 'fitness-test-results',
		category: 'training',
		title: 'Fitness Test Results',
		description: 'Your regular fitness test results are back.',
		outcomes: [
			{ label: 'Personal best! Shape of your life!', effects: [{ type: 'xp', delta: 3 }] },
			{ label: 'Good numbers. Consistent performer.', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Below average. Need to step up.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Skip the test. Not your day.', effects: [] }
		]
	},
	{
		id: 'personal-trainer',
		category: 'training',
		title: 'Personal Trainer',
		description: "You've hired a personal trainer.",
		outcomes: [
			{
				label: 'Transformational! Never been fitter!',
				effects: [
					{ type: 'xp', delta: 4 },
					{ type: 'deckAdd', delta: 2 }
				]
			},
			{ label: 'Good sessions. Improvement noted.', effects: [{ type: 'xp', delta: 2 }] },
			{
				label: 'Pushes too hard. Pick up a knock.',
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			},
			{
				label: 'Cancel after one session. Expensive.',
				effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }]
			}
		]
	},
	{
		id: 'yoga-classes',
		category: 'training',
		title: 'Yoga Classes',
		description: "You've started yoga to improve flexibility.",
		outcomes: [
			{
				label: 'Flexibility improves. Fewer injuries!',
				effects: [
					{ type: 'xp', delta: 2 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Feeling looser. Good addition.', effects: [{ type: 'xp', delta: 1 }] },
			{
				label: 'Pull something in first class. Ironic.',
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			},
			{ label: 'Not for you. Stick to the gym.', effects: [] }
		]
	},
	{
		id: 'swimming-recovery',
		category: 'training',
		title: 'Swimming Recovery',
		description: 'The physio recommends swimming for recovery.',
		outcomes: [
			{ label: 'Works wonders. Feel rejuvenated!', effects: [{ type: 'xp', delta: 2 }] },
			{ label: 'Good low-impact session.', effects: [] },
			{ label: 'Swallow half the pool. Gross.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Skip the pool session.', effects: [] }
		]
	},
	{
		id: 'ice-bath',
		category: 'training',
		title: 'Ice Bath',
		description: 'The recovery room ice bath is calling.',
		outcomes: [
			{ label: 'Incredible recovery! Feel brand new!', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Painful but effective.', effects: [] },
			{ label: "Can't handle the cold. Bailed early.", effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Skip it. Warm shower instead.', effects: [] }
		]
	},
	{
		id: 'gym-accident',
		category: 'training',
		title: 'Gym Accident',
		description: 'A mishap in the gym.',
		outcomes: [
			{ label: 'No serious damage. Walk it off.', effects: [] },
			{
				label: 'Drop a weight on your foot. Bruised.',
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			},
			{ label: 'Pull your back. Weeks of rehab.', effects: [{ type: 'appearanceSkip', delta: 3 }] },
			{ label: 'Spotter saves you. Close call.', effects: [] }
		]
	},
	{
		id: 'weight-gain',
		category: 'training',
		title: 'Weight Gain',
		description: 'The scales are not looking kind.',
		outcomes: [
			{ label: "It's muscle. Looking jacked!", effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Winter weight. Nothing major.', effects: [] },
			{ label: 'Manager notices. Extra running.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Blame the club catering.', effects: [] }
		]
	},
	{
		id: 'nutrition-plan',
		category: 'training',
		title: 'Nutrition Plan',
		description: 'The club nutritionist designed a meal plan.',
		outcomes: [
			{
				label: 'Clean eating pays off! Energy through the roof!',
				effects: [{ type: 'xp', delta: 2 }]
			},
			{ label: 'Healthier diet. Feeling good.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Miss your favourite foods. Grumpy.', effects: [{ type: 'morale', delta: -1 }] },
			{
				label: 'Ignore the plan. Pizza is life.',
				effects: [{ type: 'bankBalance', delta: -0.2, scale: 'wage' }]
			}
		]
	},
	{
		id: 'sleep-study',
		category: 'training',
		title: 'Sleep Study',
		description: 'The sports science team wants to study your sleep.',
		outcomes: [
			{ label: 'Optimal sleep routine! Recovery improves!', effects: [{ type: 'xp', delta: 2 }] },
			{ label: 'Good insights into sleep patterns.', effects: [] },
			{ label: "Monitor uncomfortable. Can't sleep.", effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Decline. You sleep fine.', effects: [] }
		]
	},
	{
		id: 'sports-psychologist',
		category: 'training',
		title: 'Sports Psychologist',
		description: 'The club recommends a sports psychologist.',
		outcomes: [
			{
				label: 'Mental game transforms! Confidence soaring!',
				effects: [
					{ type: 'xp', delta: 3 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Helpful techniques for matchday.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: "Don't buy into it. Waste of time.", effects: [] },
			{ label: 'Refuse. Nothing wrong with your head.', effects: [{ type: 'morale', delta: -1 }] }
		]
	},
	{
		id: 'new-boots',
		category: 'training',
		title: 'New Boots',
		description: 'Your new boots are giving you blisters.',
		outcomes: [
			{ label: 'Break them in perfectly. Feel great!', effects: [{ type: 'deckAdd', delta: 1 }] },
			{ label: 'Blisters but manageable. Plasters on.', effects: [{ type: 'morale', delta: -1 }] },
			{
				label: "Bloody blisters. Can't train properly.",
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			},
			{ label: 'Switch back to old boots.', effects: [] }
		]
	},
	{
		id: 'medical-breakthrough',
		category: 'training',
		title: 'Medical Breakthrough',
		description: 'New recovery treatment available at the club.',
		outcomes: [
			{
				label: 'Cutting-edge treatment works miracles!',
				effects: [
					{ type: 'xp', delta: 3 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Promising results. Feel better.', effects: [] },
			{
				label: 'Side effects from experimental treatment.',
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			},
			{ label: 'Stick with traditional methods.', effects: [] }
		]
	},
	{
		id: 'massage-therapy',
		category: 'training',
		title: 'Massage Therapy',
		description: "You've booked a sports massage.",
		outcomes: [
			{ label: 'Deep tissue works wonders! Loose and ready!', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Tense muscles released. Feel great.', effects: [] },
			{
				label: 'Too intense. Bruised for days.',
				effects: [
					{ type: 'appearanceSkip', delta: 1 },
					{ type: 'bankBalance', delta: -0.3, scale: 'wage' }
				]
			},
			{ label: 'Cancel. Not in the mood.', effects: [] }
		]
	},
	{
		id: 'hydration-test',
		category: 'training',
		title: 'Hydration Test',
		description: 'The team checks your hydration levels.',
		outcomes: [
			{ label: 'Perfect hydration! Elite conditioning!', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Adequate. Drink more water.', effects: [] },
			{ label: 'Dehydrated. Forced to rest.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Chug water before the test. Cheat.', effects: [] }
		]
	},
	{
		id: 'speed-work',
		category: 'training',
		title: 'Speed Work',
		description: 'The sprint coach wants to work on your pace.',
		outcomes: [
			{
				label: 'New PB over 40 metres! Rapid!',
				effects: [
					{ type: 'xp', delta: 2 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Improvement noted. Getting quicker.', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Push too hard. Pull up sore.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Fast enough already. Skip the session.', effects: [] }
		]
	},
	{
		id: 'strength-training',
		category: 'training',
		title: 'Strength Training',
		description: 'New strength and conditioning program.',
		outcomes: [
			{
				label: 'New PB on every lift! Absolute unit!',
				effects: [
					{ type: 'xp', delta: 2 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Steady gains. Getting stronger.', effects: [{ type: 'xp', delta: 1 }] },
			{
				label: 'Ego-lift and hurt your shoulder.',
				effects: [{ type: 'appearanceSkip', delta: 2 }]
			},
			{ label: 'Stick to existing routine.', effects: [] }
		]
	},
	{
		id: 'cardio-session',
		category: 'training',
		title: 'Cardio Session',
		description: 'Brutal cardio day at training.',
		outcomes: [
			{ label: 'Smash the beep test! Unbeatable!', effects: [{ type: 'xp', delta: 2 }] },
			{ label: 'Solid effort. Mid-table finish.', effects: [] },
			{ label: 'Finish last. Gassed.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Skip the running. Tactically rested.', effects: [] }
		]
	},
	{
		id: 'cold-weather-training',
		category: 'training',
		title: 'Cold Weather Training',
		description: 'Freezing temperatures at training.',
		outcomes: [
			{ label: 'Thrive in the cold. Toughen up!', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Uncomfortable but get through it.', effects: [] },
			{ label: 'Catch a chill. Fever develops.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Training moves indoors. Lucky!', effects: [] }
		]
	},
	{
		id: 'stretching-routine',
		category: 'training',
		title: 'Stretching Routine',
		description: 'The physio wants you to improve flexibility.',
		outcomes: [
			{ label: 'Dramatically improved range of motion!', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Consistent stretching helps recovery.', effects: [] },
			{ label: 'Overstretch. Pulled groin.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Skip the stretches. No time.', effects: [] }
		]
	},
	{
		id: 'blood-test',
		category: 'training',
		title: 'Blood Test',
		description: 'Routine blood tests for the squad.',
		outcomes: [
			{ label: 'Perfect results!!! Peak condition!', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'All normal. Standard results.', effects: [] },
			{
				label: 'Low iron. Supplements prescribed.',
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			},
			{ label: 'Hate needles. Avoid it.', effects: [] }
		]
	},
	{
		id: 'recovery-session',
		category: 'training',
		title: 'Recovery Session',
		description: 'Light recovery session after a heavy week.',
		outcomes: [
			{
				label: 'Perfect recovery! Fresh for the match!',
				effects: [
					{ type: 'xp', delta: 1 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Gentle session. Loosened up nicely.', effects: [] },
			{ label: 'Still feel heavy. Need more rest.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Skip recovery. Extra rest instead.', effects: [] }
		]
	},
	{
		id: 'diet-cheat',
		category: 'training',
		title: 'Diet Cheat Day',
		description: "You couldn't resist a cheat meal.",
		outcomes: [
			{ label: 'Needed that! Back on track tomorrow!', effects: [{ type: 'morale', delta: 1 }] },
			{ label: "Worth it. One meal won't hurt.", effects: [] },
			{ label: 'Spiral into junk food. Weight up.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Stick to the diet. Discipline.', effects: [] }
		]
	},
	{
		id: 'stadium-run',
		category: 'training',
		title: 'Stadium Run',
		description: 'Training involves running the stadium steps.',
		outcomes: [
			{
				label: 'Conquer the steps! Legendary stamina!',
				effects: [
					{ type: 'xp', delta: 2 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Tough session. Get through it.', effects: [] },
			{
				label: 'Tripped on the steps. Twisted knee.',
				effects: [{ type: 'appearanceSkip', delta: 1 }]
			},
			{ label: 'Feign illness. Avoid the stairs.', effects: [{ type: 'morale', delta: -1 }] }
		]
	},
	{
		id: 'rehabilitation',
		category: 'training',
		title: 'Rehabilitation',
		description: "You've been making progress in rehab.",
		outcomes: [
			{
				label: 'Ahead of schedule! Almost back!',
				effects: [
					{ type: 'xp', delta: 3 },
					{ type: 'deckAdd', delta: 1 }
				]
			},
			{ label: 'Steady progress. On track.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Setback. Pain has returned.', effects: [{ type: 'appearanceSkip', delta: 2 }] },
			{ label: 'Follow the plan. No shortcuts.', effects: [] }
		]
	}
];
