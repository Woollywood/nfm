<script setup lang="ts">
	import { Swiper, SwiperSlide } from 'swiper/vue';

	interface Props {
		index: number;
		slide: {
			image: string;
			description: string;
		};
	}

	const props = defineProps<Props>();
	const sliderInner = ref<InstanceType<typeof SwiperSlide>>();
	const { isMobile } = useDevice();

	defineExpose({
		sliderInner,
	});
</script>

<template>
	<Swiper class="case-slider-inner" :slidesPerView="0.5" :data-slider-inner="props.index" ref="sliderInner">
		<SwiperSlide class="case-slider-inner__slide">
			<div class="case-slider-inner__img-top">
				<div class="case-slider-inner__img ibg" :class="{ mobile: isMobile }">
					<CustomImg :src="props.slide.image" />
				</div>
			</div>
			<div
				class="case-slider__text case-slider__text--big"
				data-slide-text
				v-html="props.slide.description"></div>
		</SwiperSlide>
	</Swiper>
</template>

<style scoped lang="scss">
	.case-slider__text {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;

		&--big {
			width: calc(50% - var(--padding));
		}
	}

	.case-slider-inner {
		height: 100%;
		overflow: visible;
		margin-right: calc(var(--padding) * -1);

		&__slide {
			height: 100%;
			display: grid;
			grid-template-rows: 1fr calc(3em * 1.2);
			margin-bottom: calc(3em * -1.2);
			gap: rem(38);

			font-size: rem(20);
			line-height: 120%;
			letter-spacing: rem(0.2);

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
			}

			@media (max-width: $mobile) {
				gap: rem(28);
				font-size: rem(13);
				line-height: 124%;
				letter-spacing: rem(0.13);
			}
		}

		&__img-top {
			position: relative;
			width: 100%;
			height: var(--image-height);
		}

		&__img {
			position: absolute;
			top: 0;
			left: 0;
			width: calc(100% - var(--padding));
			height: 100%;
			@include adaptiveValue('border-radius', 28, 12, 0, 1440, 375);
			overflow: hidden;

			@media (max-width: $tablet-xl) and (min-width: $mobile) {
				border-radius: rem(16);
			}

			@media (max-width: $mobile) {
				aspect-ratio: 1;
				height: auto;
			}

			&.mobile {
				aspect-ratio: none;
				height: 100%;
			}
		}
	}
</style>
