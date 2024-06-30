<template>
	<Offcanvas
		class="nested-canvas"
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		ref="canvasRef"
		@loaded="loaded">
		<div class="preloader-wrapper">
			<CustomLoader />
		</div>
		<div
			class="video-player flex items-center justify-center mt-[var(--header-height)] max-h-[calc(100svh-var(--header-height)*2)] h-full"
			data-videos-player>
			<iframe
				:src="videoData.iframe"
				class="aspect-video md:max-w-[calc(min(calc(100vw-32px*4-56px*2),1440px))] px-4 w-full h-full"
				allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
				frameborder="0"
				allowfullscreen></iframe>
		</div>
	</Offcanvas>
</template>

<script>
	import { ref } from 'vue';
	import { useAnimationStore } from '@/store/home.store';
	import { toDetailPage } from '@/animations/layouts';
	import { BASE_URL } from '@/constants/api';

	export default {
		async setup() {
			const animationStore = useAnimationStore();
			const headerConfig = ref(defineHeaderConfig());
			const layoutConfig = ref(defineLayoutConfig());
			const route = useRoute();

			headerConfig.value.absolute = true;
			headerConfig.value.filter = false;
			layoutConfig.value.footer = false;
			layoutConfig.value.header = false;

			const slug = route.params.slug;
			const { data: videoData } = await useFetch(`api/v1/videos/${slug}`, {
				baseURL: BASE_URL,
			});

			return { videoData, headerConfig, layoutConfig, animationStore, toDetailPage };
		},
		methods: {
			loaded() {
				setTimeout(() => {
					this.animationStore.setDetailPageLayout(this.$refs.canvasRef.$el);
					toDetailPage(this.animationStore);
				}, 0);
			},
		},
		watch: {
			$route(to, from) {
				if (hasNestedRoutes()) {
					delete this.headerConfig.backgroundPath;
					this.headerConfig.backgroundStyles = 'background-color: transparent;';
				} else {
					this.headerConfig.backgroundPath = defineHeaderConfig().backgroundPath;
					this.headerConfig.filter = true;
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.nested-canvas {
		z-index: 4;
		top: var(--scroll-top);
		overflow: hidden;
		transition: none;
	}

	.preloader-wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		transform: translate(-50%, -50%);
	}

	.video-player {
		position: relative;
		width: 100%;
		height: 100%;

		video {
			object-fit: fill;
		}
	}
</style>
