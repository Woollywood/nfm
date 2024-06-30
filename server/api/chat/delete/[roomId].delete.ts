import { BASE_URL } from '@/constants/api';

export default defineEventHandler(async (event) => {
	const roomId = getRouterParam(event, 'roomId');
	const cookies = parseCookies(event);

	return await $fetch(`backend/chat/${roomId}/`, {
		baseURL: BASE_URL,
		method: 'DELETE',
		headers: {
			Cookie: Object.entries(cookies)
				.map((item) => item.join('='))
				.join(','),
		},
	});
});
