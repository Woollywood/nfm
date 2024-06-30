import { defineStore } from 'pinia';

const defaultValue = null;

export const useAnimationStore = defineStore('animation', () => {
	const layoutAnimationStart = ref(false);
	const detailAnimationStart = ref(false);
	const layoutAnimationEnd = ref(false);
	const detailAnimationEnd = ref(false);

	const homeLink = ref(defaultValue);
	const homeLayout = ref(defaultValue);
	const pageLayout = ref(defaultValue);
	const pageCard = ref(defaultValue);
	const detailPageLayout = ref(defaultValue);

	const isLayoutAnimationStart = computed(() => layoutAnimationStart.value);
	const isDetailAnimationStart = computed(() => detailAnimationStart.value);
	const isLayoutAnimationEnd = computed(() => layoutAnimationEnd.value);
	const isDetailAnimationEnd = computed(() => detailAnimationEnd.value);

	const getHomeLink = computed(() => homeLink.value);
	const getHomeLayout = computed(() => homeLayout.value);
	const getPageLayout = computed(() => pageLayout.value);
	const getPageCard = computed(() => pageCard.value);
	const getDetailPageLayout = computed(() => detailPageLayout.value);

	function setLayoutAnimationStart(isStart) {
		layoutAnimationStart.value = isStart;
	}

	function setDetailAnimationStart(isStart) {
		detailAnimationStart.value = isStart;
	}

	function setLayoutAnimationEnd(isEnd) {
		layoutAnimationEnd.value = isEnd;
	}

	function setDetailAnimationEnd(isEnd) {
		detailAnimationEnd.value = isEnd;
	}

	function setHomeLink(newHomeLink) {
		homeLink.value = newHomeLink;
	}

	function setHomeLayout(newHomeLayout) {
		homeLayout.value = newHomeLayout;
	}

	function setPageLayout(newPageLayout) {
		pageLayout.value = newPageLayout;
	}

	function setPageCard(newPageCard) {
		pageCard.value = newPageCard;
	}

	function setDetailPageLayout(newDetailPageLayout) {
		detailPageLayout.value = newDetailPageLayout;
	}

	return {
		isLayoutAnimationStart,
		isDetailAnimationStart,
		isLayoutAnimationEnd,
		isDetailAnimationEnd,
		getHomeLink,
		getHomeLayout,
		getPageLayout,
		getPageCard,
		getDetailPageLayout,
		setLayoutAnimationStart,
		setDetailAnimationStart,
		setLayoutAnimationEnd,
		setDetailAnimationEnd,
		setHomeLink,
		setHomeLayout,
		setPageLayout,
		setPageCard,
		setDetailPageLayout,
	};
});
