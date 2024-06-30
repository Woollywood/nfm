<script setup lang="ts">
	import { useElementSize } from '@vueuse/core';

	interface Props {
		slide: { image: string };
	}

	const props = defineProps<Props>();
	const root = ref<HTMLElement | null>(null);

	const { height } = useElementSize(root);
</script>

<template>
	<div class="case-slider__image ibg" ref="root" :data-slide-image-height="height">
		<CustomImg :src="props.slide.image" format="webp" />
	</div>
</template>

<style scoped lang="scss">
	.case-slider {
		&__image {
			position: relative;
			width: 100%;
			height: auto;
			pointer-events: none;
			border-radius: rem(28);
			overflow: hidden;
			-webkit-mask-image: -webkit-radial-gradient(white, black);
			aspect-ratio: 1;

			&--events-reset {
				pointer-events: auto;
			}

			@media (max-width: $tablet-xl) {
				border-radius: rem(16);
			}

			@media (max-width: $mobile) {
				border-radius: rem(12);
			}

			iframe {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
