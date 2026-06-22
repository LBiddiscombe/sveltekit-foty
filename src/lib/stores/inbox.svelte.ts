import type { InboxItem } from '$lib/types/game';

function createInbox() {
	let items = $state<InboxItem[]>([]);

	function markRead(id: number) {
		items = items.map((i) => (i.id === id ? { ...i, actioned: true } : i));
	}

	function clearActioned() {
		items = items.filter((i) => !i.actioned);
	}

	const unreadCount = $derived(items.filter((i) => !i.actioned).length);

	function addIncident(card: { subject: string; body: string; incidentCardId: string }) {
		const nextId = Math.max(0, ...items.map((i) => i.id)) + 1;
		items = [
			...items,
			{
				id: nextId,
				type: 'incident' as const,
				subject: card.subject,
				body: card.body,
				actionRequired: true,
				actioned: false,
				incidentCardId: card.incidentCardId
			}
		];
	}

	function init(club: string) {
		items = [
			{
				id: 1,
				type: 'news',
				subject: 'Welcome to the club!',
				body: `You have signed for ${club}. Report for training.`,
				actionRequired: true,
				actioned: false
			},
			{
				id: 2,
				type: 'news',
				subject: 'Season preview',
				body: 'The new season kicks off this week. Best of luck!',
				actionRequired: false,
				actioned: false
			}
		];
	}

	return {
		get items() {
			return items;
		},
		set items(v: InboxItem[]) {
			items = v;
		},
		get unreadCount() {
			return unreadCount;
		},
		markRead,
		clearActioned,
		addIncident,
		init
	};
}

export const inbox = createInbox();
