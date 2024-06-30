<script setup>
	import { gsap } from 'gsap';
	import { BLUE_BACKGROUND_INDEX } from '@/utils/config';
	import { backgroundStyles } from '@/utils/config';
	import { Service } from '@/api/service';
	import { useAnimationStore } from '@/store/home.store';

	const service = new Service();
	const animationStore = useAnimationStore();

	const wrapper = ref(null);
	const grid = ref(null);
	const panel = ref(null);

	const isMounted = ref(false);

	const gridItemsResponse = await service.getDataFromUrl('pages');
	const panelItemsResponse = await service.getDataFromUrl('pages/social-links');

	// const preloadImgList = await service.getDataFromUrl('photos/grid');

	const normalLinks = computed(() => gridItemsResponse.filter((link) => !link.banners.length && !link.videos.length));
	const aboutLink = computed(() => gridItemsResponse.find((link) => link.videos.length));
	const workLink = computed(() => gridItemsResponse.find((link) => link.banners.length));

	const background = backgroundStyles[BLUE_BACKGROUND_INDEX];

	function clickLink(event) {
		const linkWrapper = event.target.closest('[data-link-wrapper]');
		animationStore.setHomeLink(linkWrapper);
	}

	function getPanelHeight() {
		const panelHeight = panel.value.$el.offsetHeight;
		wrapper.value.style.cssText += `--panel-height: ${panelHeight}px`;
	}

	function animationInit() {
		const gridElement = grid.value.$el;
		const panelElement = panel.value.$el;
		isMounted.value = true;

		gsap.from(gridElement, {
			scale: 1.2,
			opacity: 0,
			duration: 1,
		});

		gsap.from(panelElement, {
			opacity: 0,
			y: '100',
			duration: 1,
		});
	}

	onMounted(() => {
		animationStore.setHomeLayout(wrapper.value);
		animationInit();
		getPanelHeight();
		window.addEventListener('resize', getPanelHeight);
	});

	onUnmounted(() => window.removeEventListener('resize', getPanelHeight));
</script>

<template>
	<NuxtLoadingIndicator />
	<div class="page-wrapper" ref="wrapper" :style="background">
		<div class="page-container" :class="{ mounted: isMounted }">
			<MainGrid
				class="grid animation-element"
				:normalLinks="normalLinks"
				:aboutLink="aboutLink"
				:workLink="workLink"
				data-animation-element="grid"
				ref="grid"
				@clickLink="clickLink" />
			<MainPanel
				class="panel animation-element"
				data-animation-element="panel"
				data-panel
				ref="panel"
				:items="panelItemsResponse"
				@clickLink="clickLink" />
		</div>
	</div>
	<slot></slot>
	<!-- <div class="preload-container absolute top-0 left-0 opacity-0 invisible pointer-events-none" aria-hidden="true">
		<div v-for="preloadImg in preloadImgList">
			<div v-if="preloadImg.type === 'mixed'">
				<div v-for="row in preloadImg.rows">
					<div v-for="column in row.columns">
						<img v-for="img in column.images" :src="img.imagePath" alt="" />
					</div>
				</div>
			</div>
			<div>
				<div v-for="column in preloadImg.columns">
					<img v-for="img in column.images" :src="img.imagePath" alt="" />
				</div>
			</div>
		</div>
	</div> -->
</template>

<style lang="scss" scoped>
	.page-wrapper {
		position: relative;
		width: 100%;
		height: 100svh;
		overflow: hidden;
	}
	.page-container {
		--ref-vh: (1080 / 128);
		--ref-vw: (1920 / 128);
		--ratio-vh: calc(100vh / var(--ref-vh));
		--ratio-vw: calc(100vw / var(--ref-vw));
		--ratio: min(var(--ratio-vw), var(--ratio-vh));

		--ref-vh--mobile: (652 / 48);
		--ref-vw--mobile: (375 / 48);
		--ratio-vh--mobile: calc(100vh / var(--ref-vh--mobile));
		--ratio-vw--mobile: calc(100vw / var(--ref-vw--mobile));
		--ratio--mobile: min(var(--ratio-vw--mobile), var(--ratio-vh--mobile));

		@media (max-height: 680px) {
			--ref-vh--mobile: (652 / 46);
			--ref-vw--mobile: (375 / 46);
			--ratio-vh--mobile: calc(100vh / var(--ref-vh--mobile));
			--ratio-vw--mobile: calc(100vw / var(--ref-vw--mobile));
			--ratio--mobile: min(var(--ratio-vw--mobile), var(--ratio-vh--mobile));
		}

		position: relative;
		height: 100%;

		display: grid;
		padding: var(--ratio) var(--ratio) rem(24);
		gap: calc(var(--ratio) * 1.34);

		@media (max-width: $mobile) {
			padding: calc(var(--ratio--mobile) / 2) calc(var(--ratio--mobile) * 0.25) rem(12);
			gap: calc(var(--ratio--mobile) * 0.9);

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
		}
	}

	.grid {
		position: relative;
		z-index: 1;
		justify-self: center;
		justify-content: center;
	}

	.panel {
		z-index: 2;
		justify-self: center;
		align-self: flex-end;

		@media (max-width: $mobile) {
			align-self: center;
			justify-self: flex-end;
		}
	}

	.animation-element {
		opacity: 0;
		visibility: hidden;

		.mounted & {
			opacity: 1;
			visibility: visible;
		}
	}
</style>
