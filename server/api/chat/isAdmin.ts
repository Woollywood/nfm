import { BASE_URL } from '@/constants/api';

export default defineEventHandler(async (event) => {
	const cookies = parseCookies(event);

	return await $fetch('api/v1/contacts/is-admin', {
		baseURL: BASE_URL,
		headers: {
			Cookie: Object.entries(cookies)
				.map((item) => item.join('='))
				.join(';'),
		},
	});
});
