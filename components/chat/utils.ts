import { isAdminCheck } from './api';
import { type RoomListItemType } from './chat.interface';
import { useChatStore } from './store';
import { storeToRefs } from 'pinia';

export function sortRoomList(rooms: RoomListItemType[]) {
	return rooms
		.slice()
		.sort((a, b) => new Date(a.last_message_time).getTime() - new Date(b.last_message_time).getTime());
}

export function getType(isAdmin: boolean, sender: 'admin' | string) {
	if (isAdmin) {
		return sender === 'admin' ? 'sender' : 'receiver';
	} else {
		return sender !== 'admin' ? 'sender' : 'receiver';
	}
}

export function scrollBottom(element: HTMLElement) {
	element.scrollTo(0, element.scrollHeight);
}

export function observe(root: HTMLElement, target: HTMLElement, callback: () => void) {
	const options = {
		root,
		rootMargin: '0px',
		threshold: 1.0,
	};

	let observer = new IntersectionObserver(async (e) => {
		const [firstEntry] = e;

		if (firstEntry.isIntersecting) {
			callback();
		}
	}, options);

	observer.observe(target);
}

export async function isAdmin() {
	const chatStore = useChatStore();
	const { isAdmin } = storeToRefs(chatStore);

	try {
		const { data: isAdminResponse, error: isAdminError } = await isAdminCheck();
		isAdmin.value = isAdminResponse.value![0].is_superuser;
	} catch (error) {
		isAdmin.value = false;
	}
}
