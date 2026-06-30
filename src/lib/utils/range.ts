export function range(length: number): number[];
export function range(start: number, end: number): number[];
export function range(startOrLength: number, end?: number): number[] {
	if (end === undefined) {
		return Array.from({ length: startOrLength }, (_, i) => i);
	}
	const length = end - startOrLength;
	return Array.from({ length }, (_, i) => startOrLength + i);
}
