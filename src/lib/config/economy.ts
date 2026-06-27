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
