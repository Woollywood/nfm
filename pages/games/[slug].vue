<script setup>
	import { ref } from 'vue';
	import { BLUR_DARK_BACKGROUND_INDEX } from '@/utils/config';
	import { toDetailPage, fromDetailPage } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { BASE_URL } from '@/constants/api';

	const route = useRoute();
	const slug = route.params.slug;
	const { data: game, error } = await useFetch(`api/v1/games/${slug}/`, {
		baseURL: BASE_URL,
	});

	const isGameExists = computed(
		() => !!game.value.iframe.length && !!game.value.video.length && !!game.value.image.length
	);

	const canvasRef = ref(null);
	const isStarted = ref(false);

	if (error.value || !isGameExists.value) {
		const router = useRouter();
		router.push('/games');
	}

	const animationStore = useAnimationStore();
	const headerConfig = ref(defineHeaderConfig());
	const layoutConfig = ref(defineLayoutConfig(BLUR_DARK_BACKGROUND_INDEX));

	headerConfig.value.absolute = true;
	headerConfig.value.filter = false;
	layoutConfig.value.footer = false;
	layoutConfig.value.header = false;

	function loaded() {
		setTimeout(() => {
			const canvas = canvasRef.value.$el;
			animationStore.setDetailPageLayout(canvas);

			toDetailPage(animationStore, null);
		}, 0);
	}
</script>

<template>
	<Offcanvas
		class="nested-canvas !overflow-hidden"
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@loaded="loaded"
		@close="fromDetailPage(animationStore)"
		ref="canvasRef">
		<div
			class="absolute top-0 left-0 w-full px-4 flex items-center justify-center overflow-hidden pt-[var(--header-height)] h-svh bg-black"
			data-animation-card>
			<iframe v-if="isStarted" class="w-full h-full" :src="game.iframe" ref="iframe" tabindex="1"></iframe>
			<div
				v-else
				class="flex flex-col gap-4 items-center justify-center aspect-[384/576] max-h-[84svh] h-full rounded-lg overflow-hidden mt-[calc(var(--header-height)*-1*0.82)]">
				<div class="relative flex items-center justify-center w-full h-full">
					<CustomLoader class="loader" />
					<iframe
						class="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[12px] md:rounded-[16px]"
						:src="game.video"
						allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write;"
						frameborder="0"></iframe>
				</div>
				<button
					class="start-button shrink-0 uppercase flex justify-center items-center text-center text-[13px]/[20px] md:text-base/[20px] font-bold w-full h-[48px] rounded-sm overflow-hidden"
					@click="isStarted = true">
					Click to start
				</button>
			</div>
		</div>
	</Offcanvas>
</template>

<style lang="scss" scoped>
	.wrapper {
		@media (max-width: $tablet-xl) {
			padding-top: calc(var(--header-height) * 0.4);
		}
	}

	.start-button {
		background-color: rgba(33, 33, 255, 1);
	}
</style>
