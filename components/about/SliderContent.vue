<template>
	<div class="section-wrapper" :class="$attrs.class">
		<div class="slider swiper" ref="slider">
			<div class="swiper-wrapper">
				<div
					v-for="(slide, index) in slides"
					class="slider__slide swiper-slide"
					:class="{ selected: isSlideSelected === index }"
					:key="index"
					@click="$emit('click', index)">
					<div class="slider__slide-inner-wrapper">
						<div class="slider__slide-inner">
							<div class="slider__slide-image ibg">
								<CustomImg :src="slide.imagePath" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<AboutSliderArrow @mounted="controllsMounted" />
	</div>
</template>

<script>
	import { sliderContentInit } from './sliderInit';

	export default {
		props: {
			slides: {
				type: Array,
				required: true,
			},

			selectedSlide: {
				type: Object,
				default: null,
			},

			sliderIndex: {
				type: Number,
				required: true,
			},
		},
		emits: {
			click: null,
		},
		data() {
			return {
				arrows: null,
			};
		},
		computed: {
			isSlideSelected() {
				if (this.sliderIndex === this.selectedSlide?.sliderIndex) {
					return this.selectedSlide.slideIndex;
				} else {
					return false;
				}
			},
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

			sliderContentInit({ slider, sliderArrowPrev, sliderArrowNext });
		},
	};
</script>

<style lang="scss" scoped>
	.section-wrapper {
		position: relative;
	}

	.slider {
		@media (max-width: $mobile) {
			overflow: visible;
		}

		&__slide {
			cursor: pointer;
			width: 100%;
			aspect-ratio: 1;
		}

		&__slide-inner-wrapper {
			position: relative;
			width: 100%;
			height: 100%;
			border: rem(2) solid transparent;
			box-sizing: border-box;
			border-radius: rem(24);

			&::before {
				content: '';
				position: absolute;
				top: -2px;
				bottom: -2px;
				left: -2px;
				right: -2px;
				background: linear-gradient(#00ff80, #00c7ff);
				border-radius: rem(24);
				z-index: -1;
				opacity: 0;
				visibility: hidden;

				@media (max-width: $mobile) {
					border-radius: rem(8);
				}
			}

			.selected & {
				&::before {
					opacity: 1;
					visibility: visible;
				}
			}

			@media (max-width: $mobile) {
				border-radius: rem(8);
			}
		}

		&__slide-inner {
			position: relative;
			width: 100%;
			height: 100%;
			transition: border 0.3s ease;

			@include adaptiveValue('border-radius', 24, 8, 0, 1440, 375);
			overflow: hidden;
		}

		&__slide-image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
</style>
