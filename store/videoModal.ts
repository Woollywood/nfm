import { defineStore } from 'pinia';

export const useVideoModalStore = defineStore('videoModal', () => {
	const isOpened = ref(false);

	return { isOpened };
});
