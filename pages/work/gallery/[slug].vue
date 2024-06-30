<script setup>
	import { ref } from 'vue';
	import { toDetailPage } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { BASE_URL } from '@/constants/api';

	const { isMobile } = useDevice();
	const animationStore = useAnimationStore();
	const headerConfig = ref(defineHeaderConfig());
	const layoutConfig = ref(defineLayoutConfig());
	const route = useRoute();

	const canvas = ref(null);

	layoutConfig.value.footer = false;
	layoutConfig.value.header = false;
	headerConfig.value.absolute = true;
	headerConfig.value.filter = false;

	const slug = route.params.slug;
	const { data } = await useFetch(`api/v1/works/${slug}`, {
		baseURL: BASE_URL,
	});

	function findAllSorted(slides) {
		if (slides.length === 1 && slides[0].video) {
			return [
				{
					type: 'video',
					title: slides[0].name,
					slides: [slides[0]],
				},
			];
		}

		const sortSet = new Set(slides.map((slide) => slide.sorting));
		const resultSlides = [];

		for (const sortIndex of sortSet) {
			const arrFiltered = slides.filter((slide) => slide.sorting === sortIndex);
			const title = arrFiltered[0].name;
			const type = arrFiltered[0].image ? 'image' : 'video';

			resultSlides.push({
				type,
				title,
				slides: arrFiltered,
			});
		}

		return resultSlides;
	}

	const desktop = computed(() => ({
		...data.value,
		sortedSlides: findAllSorted(data.value.photo_slides),
	}));

	console.log(desktop.value);

	const mobile = computed(() => ({
		...data.value,
		slides: data.value.photo_slides.map((slide) => ({
			...slide,
			type: slide.image ? 'image' : 'video',
			kind: 'big',
			title: slide.name,
		})),
	}));

	function loaded() {
		setTimeout(() => {
			animationStore.setDetailPageLayout(canvas.value.$el);
			toDetailPage(animationStore);
		}, 0);
	}
</script>

<template>
	<Offcanvas
		class="nested-canvas !overflow-hidden"
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		ref="canvas"
		@loaded="loaded">
		<WorkSlider v-if="!isMobile" :slider="desktop" />
		<WorkSliderMobile v-else :slides="mobile" />
	</Offcanvas>
</template>

<style lang="scss" scoped>
	.nested-canvas {
		z-index: 4;
		top: var(--scroll-top);
	}
</style>
