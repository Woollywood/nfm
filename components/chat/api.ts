import { BASE_URL } from '@/constants/api';
import type { RoomListResponse, BaseRoomType, MessageListResponse, IsAdmin } from './chat.interface';

export async function isAdminCheck() {
	return await useFetch<IsAdmin[]>('api/v1/contacts/is-admin', {
		baseURL: BASE_URL,
		credentials: 'include',
	});
}

export async function getRoomList(pageRef: Ref<number>) {
	return await useAsyncData<RoomListResponse>('roomList', () =>
		$fetch('backend/chat', {
			baseURL: BASE_URL,
			credentials: 'include',
			immediate: false,
			params: {
				page: pageRef.value,
				size: 20,
			},
		})
	);
}

export async function deleteRoom(roomId: number | string) {
	return await useFetch(`backend/chat/${roomId}`, {
		baseURL: BASE_URL,
		method: 'DELETE',
		credentials: 'include',
	});
}

export async function createOrGetRoom() {
	return await useFetch<BaseRoomType>('backend/chat/', {
		immediate: false,
		baseURL: BASE_URL,
		method: 'POST',
		credentials: 'include',
	});
}

export async function getMessageList(roomId: number, page = 1) {
	return await useFetch<MessageListResponse>(`backend/chat/${roomId}`, {
		baseURL: BASE_URL,
		credentials: 'include',
		params: {
			size: 20,
			page,
		},
	});
}
