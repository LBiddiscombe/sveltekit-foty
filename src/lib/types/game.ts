export interface PlayerStats {
	power: number;
	accuracy: number;
	technique: number;
	athleticism: number;
}

export interface Player {
	name: string;
	stats: PlayerStats;
	trainingFocus: keyof PlayerStats;
	wage: number;
	bankBalance: number;
	goals: number;
	appearances: number;
	club: string;
	division: number;
	deck: number[];
}

export interface Fixture {
	opponent: string;
}

export type Phase = 'hub' | 'pre-match' | 'match' | 'vidiprinter';

export interface Season {
	weekNumber: number;
	seasonNumber: number;
	fixtures: Fixture[];
	gamesPlayed: number;
	phase: Phase;
}

export type Outcome = 'goal' | 'saved' | 'miss' | 'off-target';

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
}
