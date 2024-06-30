<script setup lang="ts">
	import { BLUE_BACKGROUND_INDEX } from '@/utils/config';
	import { toHomeAnimation, fromHomeAnimation } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';

	const animationStore = useAnimationStore();

	const headerConfig = ref(defineHeaderConfig());
	headerConfig.value.absolute = true;
	headerConfig.value.filter = true;

	const layoutConfig = ref(defineLayoutConfig(BLUE_BACKGROUND_INDEX));
	// @ts-ignore
	delete layoutConfig.value.footer;

	const canvasRef = ref(null);

	function loaded() {
		setTimeout(() => {
			// @ts-ignore
			const canvas = canvasRef.value.$el;
			animationStore.setPageLayout(canvas);

			fromHomeAnimation(animationStore, null);
		}, 0);
	}
</script>

<template>
	<Offcanvas
		class="canvas canvas-chat max-h-svh"
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@close="toHomeAnimation('/', animationStore)"
		@loaded="loaded"
		ref="canvasRef">
		<Suspense>
			<ChatLayout>
				<slot />
			</ChatLayout>
			<template #fallback>
				<div class="flex items-center justify-center">
					<CustomLoader />
				</div>
			</template>
		</Suspense>
	</Offcanvas>
</template>

<style lang="scss" scoped>
	.canvas {
		overflow: hidden;
	}
</style>
