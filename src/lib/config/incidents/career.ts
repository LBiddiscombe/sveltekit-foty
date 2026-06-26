import type { IncidentCard } from '$lib/types/game';

export const CAREER_CARDS: IncidentCard[] = [
	{
		id: 'contract-standoff',
		category: 'career',
		title: 'Contract Standoff',
		description: 'Your agent calls with news on the contract renewal talks.',
		outcomes: [
			{ label: 'New deal agreed! One of the highest earners at the club!', effects: [{ type: 'wageMultiplier', delta: 1.5 }] },
			{ label: 'Modest improvement to your terms.', effects: [{ type: 'wageMultiplier', delta: 1.15 }] },
			{ label: 'Talks break down. Fans turn on you.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Both sides agree to revisit next month.', effects: [] }
		]
	},
	{
		id: 'community-visit',
		category: 'career',
		title: 'Community Visit',
		description: 'The club sends you to a local school for a community event.',
		outcomes: [
			{ label: 'The kids love you! Hero of the neighbourhood!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Great afternoon. Club praises your professionalism.', effects: [{ type: 'xp', delta: 2 }] },
			{ label: 'You accidentally say something awkward.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Quiet visit. Sign autographs and leave.', effects: [] }
		]
	},
	{
		id: 'wage-dispute',
		category: 'career',
		title: 'Wage Dispute',
		description: 'You\'ve asked for a renegotiation of your wages.',
		outcomes: [
			{ label: 'Club agrees to improved terms!', effects: [{ type: 'wageMultiplier', delta: 1.3 }] },
			{ label: 'A compromise is reached.', effects: [{ type: 'wageMultiplier', delta: 1.1 }] },
			{ label: 'Club refuses. Relations strained.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'You drop it for now.', effects: [] }
		]
	},
	{
		id: 'bonus-payment',
		category: 'career',
		title: 'Bonus Payment',
		description: 'Your contract includes a performance bonus clause.',
		outcomes: [
			{ label: 'Hit every target! Maximum bonus!', effects: [{ type: 'bankBalance', delta: 3, scale: 'wage' }] },
			{ label: 'Met most targets. Solid bonus.', effects: [{ type: 'bankBalance', delta: 1, scale: 'wage' }] },
			{ label: 'Fell short. No bonus this time.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Bonus deferred to next season.', effects: [] }
		]
	},
	{
		id: 'loyalty-bonus',
		category: 'career',
		title: 'Loyalty Bonus',
		description: 'The club recognises your long service.',
		outcomes: [
			{ label: 'Hefty loyalty payment lands in your account!', effects: [{ type: 'bankBalance', delta: 4, scale: 'wage' }] },
			{ label: 'Modest loyalty bonus comes through.', effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }] },
			{ label: 'Smaller than expected due to tax.', effects: [{ type: 'bankBalance', delta: 0.5, scale: 'wage' }] },
			{ label: 'You declined to help the club\'s finances.', effects: [] }
		]
	},
	{
		id: 'player-of-month',
		category: 'career',
		title: 'Player of the Month',
		description: 'You\'ve been nominated for Player of the Month.',
		outcomes: [
			{ label: 'You win! Trophy on the mantelpiece!', effects: [{ type: 'morale', delta: 3 }, { type: 'bankBalance', delta: 2, scale: 'wage' }, { type: 'deckAdd', delta: 2 }] },
			{ label: 'Shortlisted. Recognition feels good.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Media snub affects your confidence.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You weren\'t even nominated.', effects: [] }
		]
	},
	{
		id: 'player-of-year',
		category: 'career',
		title: 'Player of the Year',
		description: 'The end-of-season awards are approaching.',
		outcomes: [
			{ label: 'You win! Career-defining moment!', effects: [{ type: 'xp', delta: 10 }, { type: 'morale', delta: 3 }] },
			{ label: 'Top three finish. Recognition at last.', effects: [{ type: 'xp', delta: 5 }] },
			{ label: 'Overlooked despite a good season.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Skip the ceremony. Focus on training.', effects: [] }
		]
	},
	{
		id: 'club-fine',
		category: 'career',
		title: 'Club Fine',
		description: 'The club has fined you for a disciplinary breach.',
		outcomes: [
			{ label: 'Appeal and the fine is overturned!', effects: [] },
			{ label: 'Accept the fine quietly.', effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }] },
			{ label: 'Substantial fine. Hurts the wallet.', effects: [{ type: 'bankBalance', delta: -3, scale: 'wage' }] },
			{ label: 'Let off with a warning.', effects: [] }
		]
	},
	{
		id: 'manager-praise',
		category: 'career',
		title: 'Manager Praise',
		description: 'The manager singles you out in the press.',
		outcomes: [
			{ label: '"Best player I\'ve ever worked with!" Stock rises!', effects: [{ type: 'morale', delta: 3 }] },
			{ label: 'Nice mention. Feels good.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Praise puts pressure on you.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Barely get a mention.', effects: [] }
		]
	},
	{
		id: 'manager-criticism',
		category: 'career',
		title: 'Manager Criticism',
		description: 'The manager criticises your form in the media.',
		outcomes: [
			{ label: 'Prove him wrong with a man-of-the-match display!', effects: [{ type: 'xp', delta: 3 }, { type: 'morale', delta: 1 }] },
			{ label: 'Take it on the chin. Work harder.', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'The criticism gets to you. Form dips.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Ignore it. Water off a duck\'s back.', effects: [] }
		]
	},
	{
		id: 'captaincy-offer',
		category: 'career',
		title: 'Captaincy Offer',
		description: 'The manager offers you the captain\'s armband.',
		outcomes: [
			{ label: 'Accept and lead the team to glory!', effects: [{ type: 'morale', delta: 3 }, { type: 'xp', delta: 5 }] },
			{ label: 'Proud moment. Accept the role.', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Responsibility weighs heavily.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Politely decline. Not ready yet.', effects: [] }
		]
	},
	{
		id: 'captaincy-removed',
		category: 'career',
		title: 'Captaincy Removed',
		description: 'The manager has stripped you of the captaincy.',
		outcomes: [
			{ label: 'Win it back through sheer performance!', effects: [{ type: 'xp', delta: 3 }] },
			{ label: 'Accept the decision gracefully.', effects: [] },
			{ label: 'Public humiliation. Form suffers.', effects: [{ type: 'morale', delta: -3 }] },
			{ label: 'Request a transfer.', effects: [{ type: 'morale', delta: -2 }] }
		]
	},
	{
		id: 'vice-captain',
		category: 'career',
		title: 'Vice-Captain Role',
		description: 'You\'ve been appointed vice-captain.',
		outcomes: [
			{ label: 'Thrive in the leadership role!', effects: [{ type: 'morale', delta: 2 }, { type: 'xp', delta: 2 }] },
			{ label: 'An honour. Accept humbly.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Extra responsibility distracts you.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Vice-captain in name only.', effects: [] }
		]
	},
	{
		id: 'tactical-disagreement',
		category: 'career',
		title: 'Tactical Row',
		description: 'You disagree with the manager\'s tactics in training.',
		outcomes: [
			{ label: 'You\'re right! Manager changes the system!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Voice your opinion professionally.', effects: [] },
			{ label: 'Manager drops you for the next match.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Bite your tongue and get on with it.', effects: [] }
		]
	},
	{
		id: 'extra-training',
		category: 'career',
		title: 'Extra Training',
		description: 'You stayed behind after training to work on your game.',
		outcomes: [
			{ label: 'Hard work pays off! Sharp as a tack!', effects: [{ type: 'xp', delta: 3 }] },
			{ label: 'Productive session. Feel improvement.', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Overdid it. Picked up a knock.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Gaffer notices your dedication.', effects: [{ type: 'deckAdd', delta: 1 }] }
		]
	},
	{
		id: 'rested-from-squad',
		category: 'career',
		title: 'Rested from Squad',
		description: 'The manager has rested you for the upcoming match.',
		outcomes: [
			{ label: 'Fresh legs pay off. Start the next game!', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Well-earned break. Watch from the stands.', effects: [] },
			{ label: 'Frustrated at being left out.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Use the time to work on fitness.', effects: [{ type: 'xp', delta: 1 }] }
		]
	},
	{
		id: 'reserve-team',
		category: 'career',
		title: 'Reserve Team',
		description: 'The manager wants you to play a reserve match.',
		outcomes: [
			{ label: 'Score a hat-trick! Statement made!', effects: [{ type: 'deckAdd', delta: 2 }, { type: 'xp', delta: 2 }] },
			{ label: 'Solid performance. Job done.', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Pick up a knock on a heavy pitch.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Refuse. Too good for reserve football.', effects: [{ type: 'morale', delta: -2 }] }
		]
	},
	{
		id: 'youth-mentoring',
		category: 'career',
		title: 'Youth Mentoring',
		description: 'The club asks you to mentor a young academy prospect.',
		outcomes: [
			{ label: 'The kid breaks into the first team! You\'re a legend!', effects: [{ type: 'morale', delta: 2 }, { type: 'xp', delta: 3 }] },
			{ label: 'Mentoring goes well. Good feeling.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'The kid doesn\'t listen. Wasted effort.', effects: [] },
			{ label: 'Too busy with your own career.', effects: [] }
		]
	},
	{
		id: 'coaching-badge',
		category: 'career',
		title: 'Coaching Badge',
		description: 'You\'ve signed up for a coaching course.',
		outcomes: [
			{ label: 'Pass with flying colours! Future coach!', effects: [{ type: 'xp', delta: 5 }] },
			{ label: 'Complete the course. Useful knowledge.', effects: [{ type: 'xp', delta: 2 }] },
			{ label: 'Course clashes with training.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Drop out. Too busy playing.', effects: [] }
		]
	},
	{
		id: 'loan-offer',
		category: 'career',
		title: 'Loan Offer',
		description: 'A lower-division club wants you on loan.',
		outcomes: [
			{ label: 'Tear it up! Come back a better player!', effects: [{ type: 'xp', delta: 5 }] },
			{ label: 'Decent spell. Regular football helps.', effects: [{ type: 'xp', delta: 2 }] },
			{ label: 'Struggle with the physicality.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Reject the loan. Fight for your place.', effects: [] }
		]
	},
	{
		id: 'transfer-request',
		category: 'career',
		title: 'Transfer Request',
		description: 'You\'re considering handing in a transfer request.',
		outcomes: [
			{ label: 'Club accepts. Bigger team comes calling!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Club rejects it. Tensions rise.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Fans turn on you.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Withdraw the request and refocus.', effects: [] }
		]
	},
	{
		id: 'bid-rejected',
		category: 'career',
		title: 'Bid Rejected',
		description: 'A rival club bid for you. The club rejected it.',
		outcomes: [
			{ label: 'Flattering. Prove why you\'re not for sale!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Happy to stay and fight for your place.', effects: [] },
			{ label: 'Furious at being blocked.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Don\'t let it distract you.', effects: [] }
		]
	},
	{
		id: 'rival-interest',
		category: 'career',
		title: 'Rival Interest',
		description: 'A rival club\'s manager has been spotted watching you.',
		outcomes: [
			{ label: 'Put on a show! Scout\'s report glowing!', effects: [{ type: 'xp', delta: 2 }] },
			{ label: 'Flattering attention. Keeps you motivated.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Pressure gets to you. Poor performance.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Ignore the rumours and focus.', effects: [] }
		]
	},
	{
		id: 'national-team-callup',
		category: 'career',
		title: 'National Team Call-Up',
		description: 'You\'ve been called up to the national team!',
		outcomes: [
			{ label: 'Score on your debut! International hero!', effects: [{ type: 'morale', delta: 3 }, { type: 'xp', delta: 5 }] },
			{ label: 'Earn your first cap. Proud moment.', effects: [{ type: 'morale', delta: 2 }, { type: 'xp', delta: 2 }] },
			{ label: 'Pick up an injury in international training.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Don\'t make the match squad.', effects: [{ type: 'morale', delta: -1 }] }
		]
	},
	{
		id: 'national-team-dropped',
		category: 'career',
		title: 'Dropped by Country',
		description: 'The national team manager left you out of the squad.',
		outcomes: [
			{ label: 'Respond with your best club form!', effects: [{ type: 'xp', delta: 3 }] },
			{ label: 'Disappointed but determined to return.', effects: [] },
			{ label: 'The snub hits your confidence hard.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Retire from international football.', effects: [{ type: 'morale', delta: -1 }] }
		]
	},
	{
		id: 'fans-chant-name',
		category: 'career',
		title: 'Fans Chant Your Name',
		description: 'The away end is singing your song.',
		outcomes: [
			{ label: 'Acknowledge them. Unforgettable moment!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Lovely feeling. Gives you goosebumps.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Pressure to perform feels immense.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Block it out and focus.', effects: [] }
		]
	},
	{
		id: 'fans-turn',
		category: 'career',
		title: 'Fans Turn Against You',
		description: 'A section of fans have turned on you.',
		outcomes: [
			{ label: 'Win them back with a match-winning display!', effects: [{ type: 'xp', delta: 3 }, { type: 'morale', delta: 1 }] },
			{ label: 'Ignore the boos. Get on with it.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'The abuse affects your game.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Fire back at the fans. Bad move.', effects: [{ type: 'morale', delta: -3 }] }
		]
	},
	{
		id: 'agent-meeting',
		category: 'career',
		title: 'Agent Meeting',
		description: 'Your agent wants to meet about your future.',
		outcomes: [
			{ label: 'Great news! Bigger clubs are circling!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Productive meeting about your career plan.', effects: [] },
			{ label: 'Your agent has been gossiping. Embarrassing.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Standard catch-up. Nothing new.', effects: [] }
		]
	},
	{
		id: 'press-conference',
		category: 'career',
		title: 'Press Conference',
		description: 'You\'ve been put up for pre-match press duties.',
		outcomes: [
			{ label: 'Handle the press beautifully! Fans love it!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Boring but professional interview.', effects: [] },
			{ label: 'Say something that gets twisted by media.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Send the assistant manager instead.', effects: [] }
		]
	},
	{
		id: 'kit-launch',
		category: 'career',
		title: 'Kit Launch',
		description: 'The new kit is unveiled with you as the model.',
		outcomes: [
			{ label: 'Kit flies off the shelves! Face of the club!', effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }] },
			{ label: 'Decent photos. Kit looks good.', effects: [] },
			{ label: 'Awkward photoshoot. Memes ensue.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Decline to participate.', effects: [] }
		]
	},
	{
		id: 'penalty-duty',
		category: 'career',
		title: 'Penalty Duty',
		description: 'The manager wants you on penalty duty.',
		outcomes: [
			{ label: 'Score a crucial penalty! Cool as ice!', effects: [{ type: 'morale', delta: 2 }, { type: 'xp', delta: 2 }] },
			{ label: 'Take responsibility. Missed but respected.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Miss a penalty. Fans furious.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Let the designated taker keep the role.', effects: [] }
		]
	},
	{
		id: 'set-piece-specialist',
		category: 'career',
		title: 'Set Piece Specialist',
		description: 'The coach wants you to take free kicks and corners.',
		outcomes: [
			{ label: 'Score a beauty from a free kick!', effects: [{ type: 'morale', delta: 2 }, { type: 'xp', delta: 2 }, { type: 'deckAdd', delta: 1 }] },
			{ label: 'Delivery improving. Assists piling up.', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Set pieces have been poor lately.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Stick to open play. Let others take them.', effects: [] }
		]
	},
	{
		id: 'fitness-test',
		category: 'career',
		title: 'Fitness Test',
		description: 'The medical staff want to run a fitness test.',
		outcomes: [
			{ label: 'Peak condition! Best results ever!', effects: [{ type: 'xp', delta: 2 }] },
			{ label: 'Good results. Keep it up.', effects: [] },
			{ label: 'Below-par results. Extra work needed.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Skip the test. Not in the mood.', effects: [{ type: 'morale', delta: -1 }] }
		]
	},
	{
		id: 'fan-forum',
		category: 'career',
		title: 'Fan Forum',
		description: 'You\'re representing the squad at a fan forum.',
		outcomes: [
			{ label: 'Charm the room. Fans adore you!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Honest answers. Respect earned.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Get grilled by angry fans.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Send a video message instead.', effects: [] }
		]
	},
	{
		id: 'charity-match',
		category: 'career',
		title: 'Charity Match',
		description: 'You\'ve been invited to play in a charity match.',
		outcomes: [
			{ label: 'Score a screamer! Crowd goes wild!', effects: [{ type: 'deckAdd', delta: 1 }] },
			{ label: 'Fun day out for a good cause.', effects: [] },
			{ label: 'Pick up a silly injury in a charity game.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Donate but skip the game.', effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }] }
		]
	},
	{
		id: 'training-camp',
		category: 'career',
		title: 'Training Camp',
		description: 'The club heads to a warm-weather training camp.',
		outcomes: [
			{ label: 'Intense camp. Come back flying!', effects: [{ type: 'xp', delta: 3 }] },
			{ label: 'Good bonding with the squad.', effects: [{ type: 'deckAdd', delta: 1 }] },
			{ label: 'Pick up a bug from the hotel food.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Enjoy the sun more than the training.', effects: [] }
		]
	},
	{
		id: 'club-legend-visit',
		category: 'career',
		title: 'Club Legend Visit',
		description: 'A club legend visits the training ground.',
		outcomes: [
			{ label: 'Impress the legend! Words of wisdom!', effects: [{ type: 'morale', delta: 2 }, { type: 'xp', delta: 2 }] },
			{ label: 'Great stories from the old days.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Legend criticises modern players. Awkward.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Too focused on training to chat.', effects: [] }
		]
	},
	{
		id: 'academy-tour',
		category: 'career',
		title: 'Academy Tour',
		description: 'You\'re giving a tour to academy kids.',
		outcomes: [
			{ label: 'The kids are inspired. You\'re their hero!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Nice afternoon. Good questions.', effects: [] },
			{ label: 'Kid asks why you missed that sitter.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Rush through it. Training awaits.', effects: [] }
		]
	},
	{
		id: 'pre-season-tour',
		category: 'career',
		title: 'Pre-Season Tour',
		description: 'The club is going on a pre-season tour abroad.',
		outcomes: [
			{ label: 'Star of the tour! Goals in every game!', effects: [{ type: 'xp', delta: 3 }, { type: 'morale', delta: 2 }] },
			{ label: 'Good minutes. Building fitness.', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Jet lag hits you hard.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Pick up a knock on a heavy pitch.', effects: [{ type: 'appearanceSkip', delta: 1 }] }
		]
	},
	{
		id: 'media-training',
		category: 'career',
		title: 'Media Training',
		description: 'The club arranged media training for the squad.',
		outcomes: [
			{ label: 'A natural! The press love you!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Useful skills for dealing with journalists.', effects: [] },
			{ label: 'Stumble through the mock interview.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Skip it. You know the drill.', effects: [] }
		]
	},
	{
		id: 'end-of-season-awards',
		category: 'career',
		title: 'End of Season Awards',
		description: 'The club\'s end of season awards dinner.',
		outcomes: [
			{ label: 'Clean up! Players\' Player and Fans\' Player!', effects: [{ type: 'morale', delta: 3 }, { type: 'bankBalance', delta: 3, scale: 'wage' }] },
			{ label: 'Win a minor award. Nice recognition.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Don\'t win anything. Feels like a snub.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Skip the dinner. Awards aren\'t your thing.', effects: [] }
		]
	},
	{
		id: 'sponsor-event',
		category: 'career',
		title: 'Sponsor Event',
		description: 'A club sponsor wants you at their corporate event.',
		outcomes: [
			{ label: 'Charm the sponsors! New deal for the club!', effects: [{ type: 'bankBalance', delta: 3, scale: 'wage' }] },
			{ label: 'Professional appearance. Everyone happy.', effects: [] },
			{ label: 'Arrive late. Sponsors unimpressed.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Send your regrets.', effects: [] }
		]
	},
	{
		id: 'player-meeting',
		category: 'career',
		title: 'Player Meeting',
		description: 'The senior players called a squad meeting.',
		outcomes: [
			{ label: 'Your voice is heard. Changes made!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Good to clear the air.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Turns into a blame game.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Stay quiet and observe.', effects: [] }
		]
	},
	{
		id: 'injury-comeback',
		category: 'career',
		title: 'Injury Comeback',
		description: 'You\'re nearing a return from injury.',
		outcomes: [
			{ label: 'Ahead of schedule! Like a new signing!', effects: [{ type: 'morale', delta: 2 }, { type: 'xp', delta: 3 }] },
			{ label: 'Fit and ready for selection.', effects: [] },
			{ label: 'Setback in training. Few more weeks.', effects: [{ type: 'appearanceSkip', delta: 2 }] },
			{ label: 'Take it slow. No rush.', effects: [{ type: 'appearanceSkip', delta: 1 }] }
		]
	},
	{
		id: 'goal-celebration',
		category: 'career',
		title: 'Goal Celebration',
		description: 'You\'ve been planning a new goal celebration.',
		outcomes: [
			{ label: 'Goes viral! Iconic moment!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Nice celebration. Teammates join in.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Pull a hamstring doing the celebration.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Bottle it. Just point to the sky.', effects: [] }
		]
	},
	{
		id: 'squad-rotation',
		category: 'career',
		title: 'Squad Rotation',
		description: 'The manager is rotating the squad.',
		outcomes: [
			{ label: 'Grab your chance with both hands!', effects: [{ type: 'xp', delta: 2 }, { type: 'morale', delta: 1 }] },
			{ label: 'Solid performance. Kept the shirt.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Left on the bench. Frustrating.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Understand the decision.', effects: [] }
		]
	},
	{
		id: 'contract-extension',
		category: 'career',
		title: 'Contract Extension',
		description: 'The club wants to extend your contract.',
		outcomes: [
			{ label: 'Long-term deal with a significant pay rise!', effects: [{ type: 'wageMultiplier', delta: 1.5 }] },
			{ label: 'One-year extension. Stability.', effects: [{ type: 'wageMultiplier', delta: 1.1 }] },
			{ label: 'Negotiations stall. Wage demands too high.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Run down your contract.', effects: [{ type: 'morale', delta: -1 }] }
		]
	},
	{
		id: 'sponsorship-deal',
		category: 'career',
		title: 'Sponsorship Deal',
		description: 'A sportswear brand wants to sponsor you personally.',
		outcomes: [
			{ label: 'Lucrative multi-year deal! Big money!', effects: [{ type: 'bankBalance', delta: 8, scale: 'wage' }, { type: 'deckAdd', delta: 2 }] },
			{ label: 'Modest sponsorship agreed.', effects: [{ type: 'bankBalance', delta: 3, scale: 'wage' }, { type: 'deckAdd', delta: 1 }] },
			{ label: 'Deal falls through at the last minute.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Decline. Loyal to your current brand.', effects: [] }
		]
	},
	{
		id: 'training-ground-visit',
		category: 'career',
		title: 'VIP Visit',
		description: 'A VIP guest is visiting the training ground.',
		outcomes: [
			{ label: 'Impress the VIP! Could be a useful connection!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Pleasant visit. Photos and autographs.', effects: [] },
			{ label: 'Distracted by the visit. Poor training.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Didn\'t even notice they were there.', effects: [] }
		]
	},
	{
		id: 'cup-final-tickets',
		category: 'career',
		title: 'Cup Final Tickets',
		description: 'You\'ve been allocated cup final tickets for family.',
		outcomes: [
			{ label: 'Your family watches you lift the trophy!', effects: [{ type: 'morale', delta: 3 }] },
			{ label: 'They\'re in the stands cheering you on.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'You lose the tickets. Massive stress.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Sell them. Extra cash in hand.', effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }] }
		]
	},
	{
		id: 'team-photo',
		category: 'career',
		title: 'Team Photo',
		description: 'It\'s squad photo day at the club.',
		outcomes: [
			{ label: 'You look great! The photo is a classic!', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Standard photo. Smile and move on.', effects: [] },
			{ label: 'You blink. Worst photo of your life.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'You\'re late. Photographer annoyed.', effects: [] }
		]
	},
	{
		id: 'training-drill',
		category: 'career',
		title: 'Training Drill',
		description: 'The coach introduces a new training drill.',
		outcomes: [
			{ label: 'Excel at it! Coach uses you as the example!', effects: [{ type: 'xp', delta: 2 }, { type: 'deckAdd', delta: 1 }] },
			{ label: 'Pick it up quickly.', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Struggle with the new system.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Same old drills. Nothing new.', effects: [] }
		]
	},
	{
		id: 'injury-scare',
		category: 'career',
		title: 'Injury Scare',
		description: 'You felt a pop during a match and feared the worst.',
		outcomes: [
			{ label: 'Nothing serious. You can continue!', effects: [{ type: 'morale', delta: 2 }] },
			{ label: 'Slight strain. Few days rest.', effects: [{ type: 'appearanceSkip', delta: 1 }] },
			{ label: 'Torn muscle. Long layoff ahead.', effects: [{ type: 'appearanceSkip', delta: 4 }] },
			{ label: 'Just cramp. You\'re fine.', effects: [] }
		]
	},
	{
		id: 'form-dip',
		category: 'career',
		title: 'Form Dip',
		description: 'You\'ve been going through a rough patch of form.',
		outcomes: [
			{ label: 'Come roaring back! Best performance yet!', effects: [{ type: 'xp', delta: 3 }, { type: 'morale', delta: 2 }] },
			{ label: 'Steady improvement. Back on track.', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'The slump continues. Confidence low.', effects: [{ type: 'morale', delta: -2 }] },
			{ label: 'Work harder in training. Trust the process.', effects: [] }
		]
	},
	{
		id: 'injury-proneness',
		category: 'career',
		title: 'Injury Concerns',
		description: 'The medical staff are worried about your injury history.',
		outcomes: [
			{ label: 'Prove them wrong! Stay fit all season!', effects: [{ type: 'xp', delta: 3 }, { type: 'morale', delta: 2 }] },
			{ label: 'New training regimen. Feeling better.', effects: [{ type: 'xp', delta: 1 }] },
			{ label: 'Break down again. More time out.', effects: [{ type: 'appearanceSkip', delta: 3 }] },
			{ label: 'Ignore the medical team. You know your body.', effects: [] }
		]
	},
	{
		id: 'fans-favourite',
		category: 'career',
		title: 'Fans\' Favourite',
		description: 'The fans have voted you their favourite player.',
		outcomes: [
			{ label: 'Humbled and honoured. You love them back!', effects: [{ type: 'morale', delta: 3 }] },
			{ label: 'Touching tribute. You sign extra autographs.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Pressure to always perform for them.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Focus on the team. Not individual awards.', effects: [] }
		]
	},
	{
		id: 'boot-sponsor',
		category: 'career',
		title: 'Boot Sponsor',
		description: 'A boot manufacturer wants you to wear their brand.',
		outcomes: [
			{ label: 'Lifetime deal! Never buy boots again!', effects: [{ type: 'bankBalance', delta: 5, scale: 'wage' }] },
			{ label: 'Season-long deal. Free boots and cash.', effects: [{ type: 'bankBalance', delta: 2, scale: 'wage' }] },
			{ label: 'The boots are uncomfortable. Poor timing.', effects: [{ type: 'morale', delta: -1 }] },
			{ label: 'Stay with your current brand. Loyalty.', effects: [] }
		]
	},
	{
		id: 'charity-foundation',
		category: 'career',
		title: 'Charity Foundation',
		description: 'You\'re setting up your own charity foundation.',
		outcomes: [
			{ label: 'The foundation makes a huge impact! You\'re a hero!', effects: [{ type: 'morale', delta: 3 }, { type: 'xp', delta: 3 }] },
			{ label: 'Launched successfully. Making a difference.', effects: [{ type: 'morale', delta: 1 }] },
			{ label: 'Admin costs are high. Charity struggles.', effects: [{ type: 'bankBalance', delta: -2, scale: 'wage' }] },
			{ label: 'Donate to existing charities instead.', effects: [{ type: 'bankBalance', delta: -1, scale: 'wage' }] }
		]
	}
];
