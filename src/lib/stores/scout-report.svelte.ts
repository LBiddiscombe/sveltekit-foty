import type { ScoutReport } from '$lib/types/game';

let currentReport: ScoutReport | null = null;

export function setScoutReport(report: ScoutReport | null) {
	currentReport = report;
}

export function getScoutReport(): ScoutReport | null {
	return currentReport;
}
