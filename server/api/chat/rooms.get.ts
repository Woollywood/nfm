import { BASE_URL } from '@/constants/api';
import { type RoomListResponse } from '@/components/chat/chat.interface';

export default defineEventHandler(async (event) => {
	const cookies = parseCookies(event);

	return await $fetch<RoomListResponse>('backend/chat/', {
		baseURL: BASE_URL,
		headers: {
			Cookie: Object.entries(cookies)
				.map((item) => item.join('='))
				.join(','),
		},
		params: getQuery(event),
	});
});
