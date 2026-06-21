import type { InboxItem } from '$lib/types/game';

function createInbox() {
	let items = $state<InboxItem[]>([]);

	function markRead(id: number) {
		const item = items.find((i) => i.id === id);
		if (item) item.actioned = true;
	}

	const unreadCount = $derived(items.filter((i) => !i.actioned).length);

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
		init
	};
}

export const inbox = createInbox();
