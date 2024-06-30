import { BASE_URL } from '@/constants/api';
import { type BaseRoomType } from '@/components/chat/chat.interface';

export default defineEventHandler(async (event) => {
	const cookies = parseCookies(event);

	return await $fetch<BaseRoomType>('backend/chat/', {
		baseURL: BASE_URL,
		method: 'POST',
		headers: {
			Cookie: Object.entries(cookies)
				.map((item) => item.join('='))
				.join(','),
		},
	});
});
