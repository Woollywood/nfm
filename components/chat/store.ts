import { type RoomListResponse } from './chat.interface';
import { defineStore } from 'pinia';

export const useChatStore = defineStore('chat', () => {
	const isAdmin = ref<boolean | null>(null);
	const roomList = ref<RoomListResponse | null>(null);

	return { isAdmin, roomList };
});
