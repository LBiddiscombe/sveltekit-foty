export interface Club {
	name: string;
	division: number;
}

export interface Player {
	name: string;
	age: number;
	wage: number;
	bankBalance: number;
	goals: number;
	appearances: number;
	club: string;
	division: number;
	deck: number[];
	careerXp: number;
	matchXpHistory: number[];
}

export interface FixtureResult {
	goalsFor: number;
	goalsAgainst: number;
	playerGoals: number;
	outcomes: Outcome[];
}

export interface Fixture {
	opponent: string;
	isHome: boolean;
	weekNumber: number;
	result?: FixtureResult;
}

export type Phase = 'hub' | 'pre-match' | 'match' | 'vidiprinter' | 'season-review';

export interface Season {
	weekNumber: number;
	seasonNumber: number;
	fixtures: Fixture[];
	gamesPlayed: number;
	phase: Phase;
	morale: number;
}

export type Outcome = 'goal' | 'saved' | 'miss';

export type MinigameSketch = (p: import('p5').default, width: number, height: number) => void;

export type MinigameSketchFactory = (options: {
	onComplete: (outcome: Outcome) => void;
}) => MinigameSketch;

export interface MatchResult {
	played: boolean;
	chances: number;
	outcomes: Outcome[];
	score: [number, number];
	rating: number;
}

export type InboxType = 'incident' | 'transfer' | 'news' | 'contract';

export interface InboxItem {
	id: number;
	type: InboxType;
	subject: string;
	body: string;
	actionRequired: boolean;
	actioned: boolean;
	incidentCardId?: string;
}

export type IncidentCategory =
	| 'career'
	| 'training'
	| 'purchases-sales'
	| 'investments'
	| 'family'
	| 'media'
	| 'gambling'
	| 'dressing-room'
	| 'travel'
	| 'absurd';

export type IncidentEffectType =
	| 'bankBalance'
	| 'morale'
	| 'xp'
	| 'deckAdd'
	| 'deckRemove'
	| 'appearanceSkip'
	| 'wageMultiplier';

export interface IncidentEffectDescriptor {
	type: IncidentEffectType;
	/** Flat value, or multiplier when `scale` is set */
	delta: number;
	/** When set to 'wage', delta is multiplied by the player's weekly wage */
	scale?: 'wage';
}

export interface IncidentOutcome {
	label: string;
	effects: IncidentEffectDescriptor[];
}

export interface IncidentCard {
	id: string;
	category: IncidentCategory;
	title: string;
	description: string;
	outcomes: [IncidentOutcome, IncidentOutcome, IncidentOutcome, IncidentOutcome];
}

export interface Standing {
	club: string;
	played: number;
	won: number;
	drawn: number;
	lost: number;
	goalsFor: number;
	goalsAgainst: number;
	goalDifference: number;
	points: number;
	lastFive: string[];
}

export interface Level {
	title: string;
	minXp: number;
	division: number;
}

export interface DivisionSchedule {
	weeks: WeekFixtures[];
}

export interface WeekFixtures {
	weekNumber: number;
	matches: DivisionMatch[];
}

export interface DivisionMatch {
	home: string;
	away: string;
	result?: {
		homeGoals: number;
		awayGoals: number;
	};
}

export interface AiMatchResult {
	homeGoals: number;
	awayGoals: number;
}
