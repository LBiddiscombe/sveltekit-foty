export const ECONOMY = {
	goalCardPrices: {
		4: 400,
		3: 800,
		2: 1500,
		1: 2000
	},
	incidentCardPrices: {
		4: 100,
		3: 200,
		2: 375,
		1: 500
	},
	weeklyWages: {
		4: 75,
		3: 200,
		2: 500,
		1: 1200
	}
} as const;

type Division = keyof typeof ECONOMY.goalCardPrices;

export function goalCardPrice(division: number): number {
	return ECONOMY.goalCardPrices[division as Division] ?? ECONOMY.goalCardPrices[4];
}

export function incidentCardPrice(division: number): number {
	return ECONOMY.incidentCardPrices[division as Division] ?? ECONOMY.incidentCardPrices[4];
}

export function weeklyWage(division: number): number {
	return ECONOMY.weeklyWages[division as Division] ?? ECONOMY.weeklyWages[4];
}

export const LEVEL_WAGES: Record<number, number> = {
	0: 75,
	1: 100,
	2: 150,
	3: 200,
	4: 275,
	5: 375,
	6: 450,
	7: 600,
	8: 800,
	9: 900,
	10: 1050,
	11: 1200
};

export function wageForLevel(levelIndex: number): number {
	return LEVEL_WAGES[levelIndex] ?? 75;
}

export const TRANSFER_CARD_PRICES: Record<number, number> = {
	4: 2500,
	3: 4000,
	2: 7500,
	1: 10000
} as const;

export function transferCardPrice(division: number): number {
	return TRANSFER_CARD_PRICES[division as Division] ?? TRANSFER_CARD_PRICES[4];
}

export const TRANSFER_SIGNING_MULTIPLIERS = {
	sameDivision: 5,
	oneUp: 10
} as const;

export function transferSigningFee(
	currentWage: number,
	targetDivision: number,
	currentDivision: number
): number {
	const multiplier =
		targetDivision < currentDivision
			? TRANSFER_SIGNING_MULTIPLIERS.oneUp
			: TRANSFER_SIGNING_MULTIPLIERS.sameDivision;
	return currentWage * multiplier;
}

export function getTransferWindow(weekNumber: number): 1 | 2 | null {
	if (weekNumber >= 1 && weekNumber <= 4) return 1;
	if (weekNumber >= 16 && weekNumber <= 19) return 2;
	return null;
}
