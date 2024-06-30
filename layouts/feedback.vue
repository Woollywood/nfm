<script setup>
	import { ref } from 'vue';
	import { FEEDBACK_BACKGROUND_INDEX } from '@/utils/config';
	import { RouterBack, fromHomeAnimation } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';

	const animationStore = useAnimationStore();
	const headerConfig = ref(defineHeaderConfig(FEEDBACK_BACKGROUND_INDEX));
	const layoutConfig = ref(defineLayoutConfig(FEEDBACK_BACKGROUND_INDEX));
	const route = useRoute();

	const canvasRef = ref(null);

	headerConfig.value.filter = true;
	layoutConfig.value.footer = false;
	const pageName = route.name;

	function loaded() {
		setTimeout(() => {
			const canvas = canvasRef.value.$el;
			animationStore.setPageLayout(canvas);

			fromHomeAnimation(animationStore, null);
		}, 0);
	}
</script>

<template>
	<Offcanvas
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@close="RouterBack(animationStore)"
		@loaded="loaded"
		ref="canvasRef">
		<Feedback :pageName="pageName" class="fade-up fade-up--layout">
			<slot />
		</Feedback>
	</Offcanvas>
</template>
