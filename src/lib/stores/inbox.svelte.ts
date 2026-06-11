import type { InboxItem } from '$lib/types/game';

const MOCK_INBOX: InboxItem[] = [
	{
		id: 1,
		type: 'news',
		subject: 'Welcome to the club!',
		body: 'You have signed for FC Midtable United. Report for training.',
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

function createInbox() {
	let items = $state<InboxItem[]>(MOCK_INBOX);

	function markRead(id: number) {
		const item = items.find((i) => i.id === id);
		if (item) item.actioned = true;
	}

	const unreadCount = $derived(items.filter((i) => !i.actioned).length);

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
		markRead
	};
}

export const inbox = createInbox();
