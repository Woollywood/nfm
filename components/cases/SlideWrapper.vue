<script setup lang="ts">
	import { useElementSize } from '@vueuse/core';

	interface Props {
		slide: any;
		index: number;
	}

	const props = defineProps<Props>();
	const { isMobile } = useDevice();

	const root = ref<HTMLElement>();
	const sliderInner = ref();

	const { height } = useElementSize(root);

	defineExpose({
		sliderInner,
	});
</script>

<template>
	<div
		class="case-slider__wrapper h-full"
		data-slider-image
		:class="{
			mobile: isMobile && !props.slide.long,
			big: isMobile && props.slide.long,
		}"
		ref="root"
		:data-slide-root-height="height"
		:data-slide-type="props.slide.long ? `long` : `short`">
		<CasesSlideShort v-if="!props.slide.long" :slide="props.slide" />
		<CasesSlideLong v-else :index="props.index" :slide="props.slide" ref="sliderInner" />
	</div>
</template>

<style lang="scss" scoped>
	.case-slider {
		&__wrapper {
			position: relative;
			width: 100%;
			overflow: visible;

			&:not(:last-child) {
				margin-bottom: rem(38);

				@media (max-width: $mobile) {
					margin-bottom: rem(28);
				}
			}

			&.mobile {
				aspect-ratio: 343 / 320;
			}

			&.big {
				aspect-ratio: 343 / 395;
			}
		}
	}
</style>
