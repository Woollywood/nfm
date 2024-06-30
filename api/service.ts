import { BASE_URL } from '@/constants/api';

export class Service {
	private _baseUrl = BASE_URL;

	async getDataFromUrl(url: string) {
		const { data } = await useFetch(`api/v1/${url}`, {
			baseURL: this._baseUrl,
		});
		// @ts-ignore
		return data.value.results;
	}
}
