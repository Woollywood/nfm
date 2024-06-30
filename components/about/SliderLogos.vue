<template>
	<div class="section-wrapper" :class="$attrs.class">
		<div class="slider swiper" ref="slider">
			<div class="swiper-wrapper">
				<div class="slider__slide swiper-slide" v-for="slide in slides">
					<CustomImg class="slider__slide-image" :src="slide.imagePathMobile" />
				</div>
			</div>
		</div>
		<AboutSliderArrow @mounted="controllsMounted" />
	</div>
</template>

<script>
	import { sliderLogosInit } from './sliderInit';

	export default {
		props: {
			slides: {
				type: Array,
				required: true,
			},

			sliderIndex: {
				type: Number,
				required: true,
			},
		},
		data() {
			return {
				arrows: null,
			};
		},
		methods: {
			controllsMounted({ sliderArrowPrev, sliderArrowNext }) {
				this.arrows = {
					sliderArrowPrev,
					sliderArrowNext,
				};
			},
		},
		mounted() {
			const { slider } = this.$refs;
			const { sliderArrowPrev, sliderArrowNext } = this.arrows;

			sliderLogosInit({ slider, sliderArrowPrev, sliderArrowNext });
		},
	};
</script>

<style lang="scss" scoped>
	.section-wrapper {
		position: relative;
	}

	.swiper-wrapper {
		align-items: center;
	}

	.slider {
		@media (max-width: $mobile) {
			overflow: visible;
		}

		&__slide {
			position: relative;
			overflow: hidden;

			height: 100%;
			width: auto;
		}

		&__slide-image {
			height: rem(64);

			@media (max-width: $tablet-xl) {
				height: rem(56);
			}

			@media (max-width: $mobile) {
				height: rem(48);
			}
		}
	}
</style>
