<script setup>
	import { ref } from 'vue';
	import { BLUE_BACKGROUND_INDEX } from '@/utils/config';

	import { RouterBack, fromHomeAnimation } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { Service } from '@/api/service';
	const service = new Service();

	const animationStore = useAnimationStore();

	const { isMobile } = useDevice();

	let headerConfig = null;
	let layoutConfig = null;

	if (isMobile) {
		headerConfig = ref(defineHeaderConfig(BLUE_BACKGROUND_INDEX));
		layoutConfig = ref(defineLayoutConfig(BLUE_BACKGROUND_INDEX));
	} else {
		headerConfig = ref(defineHeaderConfig(BLUE_BACKGROUND_INDEX));
		headerConfig.value.absolute = true;

		layoutConfig = ref(defineLayoutConfig(BLUE_BACKGROUND_INDEX));
		layoutConfig.value.footer = false;
	}

	const slider = ref(null);
	const canvasRef = ref(null);

	const data = await service.getDataFromUrl('cases');

	function loaded() {
		setTimeout(() => {
			const canvas = canvasRef.value.$el;
			animationStore.setPageLayout(canvas);
			fromHomeAnimation(animationStore);
		}, 0);
	}

	const isModalOpened = ref(false);
	const currentModalSrc = ref('');

	function modalOpen(src) {
		isModalOpened.value = true;
		currentModalSrc.value = src;
	}

	const sliderCount = computed(() => data.length);
	const sliderInited = ref(0);

	function sliderInit() {
		sliderInited.value++;
		if (sliderInited.value === sliderCount.value) {
			const imageHeight = Math.max(
				...Array.from(canvasRef.value.$el.querySelectorAll('[data-slide-root-height]'))
					.filter((slide) => slide.dataset.slideType === 'short')
					.map((slide) => slide.querySelector('[data-slide-image-height]').dataset.slideImageHeight)
			);

			const containerHeight = Math.max(
				...Array.from(canvasRef.value.$el.querySelectorAll('[data-slide-root-height]'))
					.filter((slide) => slide.dataset.slideType === 'short')
					.map((slide) => slide.dataset.slideRootHeight)
			);

			canvasRef.value.$el.style.cssText += `
						--image-height: ${imageHeight}px;
						--container-height: ${containerHeight}px;
					`;
		}
	}

	function sliderResize() {
		setTimeout(() => {
			const imageHeight = Math.max(
				...Array.from(canvasRef.value.$el.querySelectorAll('[data-slide-root-height]'))
					.filter((slide) => slide.dataset.slideType === 'short')
					.map((slide) => slide.querySelector('[data-slide-image-height]').dataset.slideImageHeight)
			);

			const containerHeight = Math.max(
				...Array.from(canvasRef.value.$el.querySelectorAll('[data-slide-root-height]'))
					.filter((slide) => slide.dataset.slideType === 'short')
					.map((slide) => slide.dataset.slideRootHeight)
			);

			canvasRef.value.$el.style.cssText += `
						--image-height: ${imageHeight}px;
						--container-height: ${containerHeight}px;
					`;
		}, 0);
	}

	onMounted(() => window.addEventListener('resize', sliderResize));
	onUnmounted(() => window.removeEventListener('resize', sliderResize));
</script>

<template>
	<Offcanvas
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@close="RouterBack(animationStore)"
		@loaded="loaded"
		:class="[isModalOpened ? 'modalOpened' : '']"
		ref="canvasRef">
		<template #default="{ layoutConfigData }">
			<CasesSliderVertical
				class="cases-desktop"
				ref="slider"
				:sliders="data"
				@modalOpen="modalOpen($event)"
				@sliderInit="sliderInit" />
			<div class="layer-content cases-mobile">
				<CasesMobile :sliders="data" @modalOpen="modalOpen($event)" @sliderInit="sliderInit" />
			</div>
			<CustomArrowNavigate
				v-if="layoutConfigData.arrowNavName"
				class="layer-arrow-navigate cases-mobile"
				:name="layoutConfigData.arrowNavName" />
			<CustomVideoModal
				class="z-[1] top-0 h-[calc(100%-var(--header-height))] md:h-full md:top-[calc(var(--scroll-top))]"
				:src="currentModalSrc"
				v-model="isModalOpened" />
		</template>
	</Offcanvas>
</template>

<style lang="scss" scoped>
	.modalOpened {
		overflow: hidden !important;
	}

	.cases-desktop {
		@media (max-width: $mobile) {
			display: none !important;
		}
	}

	.cases-mobile {
		@media (min-width: $mobile) {
			display: none !important;
		}
	}
</style>
