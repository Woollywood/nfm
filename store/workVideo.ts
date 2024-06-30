import { defineStore } from 'pinia';

export const useVideoModalWorkStore = defineStore('videoModalWork', () => {
	const isOpened = ref(false);

	return { isOpened };
});
