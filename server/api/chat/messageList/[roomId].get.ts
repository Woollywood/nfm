import { BASE_URL } from '@/constants/api';
import { type MessageListResponse } from '@/components/chat/chat.interface';

export default defineEventHandler(async (event) => {
	const roomId = getRouterParam(event, 'roomId');
	const cookies = parseCookies(event);

	return await $fetch<MessageListResponse>(`backend/chat/${roomId}/`, {
		baseURL: BASE_URL,
		headers: {
			Cookie: Object.entries(cookies)
				.map((item) => item.join('='))
				.join(','),
		},
		params: getQuery(event),
	});
});
