<template>
	<OffcanvasMobile
		v-if="isMobile"
		class="app-canvas-tag canvas-core-mobile"
		:headerConfigProp="headerConfigData"
		:layoutConfigProp="layoutConfigData"
		@loaded="$emit('loaded')"
		:class="{
			layoutAnimationStart: animationStore.isLayoutAnimationStart,
			layoutAnimationEnd: animationStore.isLayoutAnimationEnd,
			detailAnimationStart: animationStore.isDetailAnimationStart,
			detailAnimationEnd: animationStore.isDetailAnimationEnd,
		}">
		<template #default="{ layoutConfigData }">
			<slot :layoutConfigData="layoutConfigData" />
		</template>
		<template #nested>
			<slot name="nested" />
		</template>
	</OffcanvasMobile>
	<OffcanvasDesktop
		v-else
		:headerConfigProp="headerConfigData"
		:layoutConfigProp="layoutConfigData"
		class="app-canvas-tag canvas-core-desktop"
		@loaded="$emit('loaded')"
		:class="{
			layoutAnimationStart: animationStore.isLayoutAnimationStart,
			layoutAnimationEnd: animationStore.isLayoutAnimationEnd,
			detailAnimationStart: animationStore.isDetailAnimationStart,
			detailAnimationEnd: animationStore.isDetailAnimationEnd,
		}">
		<template #default="{ layoutConfigData }">
			<slot :layoutConfigData="layoutConfigData" />
		</template>
		<template #nested>
			<slot name="nested">
				<div class="filler"></div>
			</slot>
		</template>
	</OffcanvasDesktop>
</template>

<script>
	import { useAnimationStore } from '@/store/home.store';

	export default {
		props: {
			headerConfigProp: {
				type: Object,
				required: false,
			},
			layoutConfigProp: {
				type: Object,
				required: false,
			},
		},
		emits: {
			loaded: null,
		},
		setup(props, context) {
			const headerConfigData = ref(checkConfigData(props.headerConfigProp, defineHeaderConfig));
			const layoutConfigData = ref(checkConfigData(props.layoutConfigProp, defineLayoutConfig));
			const headerStyles = headerConfigData.value.styles;
			const { isMobile } = useDevice();
			const animationStore = useAnimationStore();

			return { headerConfigData, layoutConfigData, headerStyles, isMobile, animationStore };
		},
	};
</script>

<style lang="scss" scoped>
	.app-canvas-tag {
		overflow-x: hidden;
	}
	.canvas-core-desktop {
		overscroll-behavior: none;
	}
	.canvas-core-mobile {
		overscroll-behavior: none;
	}

	.filled {
		display: none;
	}
</style>
