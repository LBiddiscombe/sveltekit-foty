export function nextId(items: { id: number }[]): number {
	return Math.max(0, ...items.map((i) => i.id)) + 1;
}
