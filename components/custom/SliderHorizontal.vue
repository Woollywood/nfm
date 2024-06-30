<script setup>
	import { getPageName } from '@/utils/config';
</script>

<template>
	<div class="slider-wrapper" ref="wrapper">
		<div class="slider-background" ref="sliderBackground" data-slider-background>
			<div class="slider-background__wrapper swiper-wrapper">
				<div class="slider-background__slide swiper-slide" v-for="slide in slides" :key="slide.id">
					<slot name="slideBackground" :slide="slide"></slot>
					<div class="slider-background__image-wrapper">
						<CustomImg :src="slide.signature" />
					</div>
				</div>
			</div>
		</div>

		<div
			class="slider-foreground-wrapper js-slider-foreground"
			ref="sliderForegroundWrapper"
			data-slider-foreground>
			<div class="slider-foreground__slider-wrapper">
				<div class="slider-foreground swiper" ref="sliderForeground">
					<div class="slider-foreground__wrapper swiper-wrapper">
						<div class="slider-foreground__slide swiper-slide" v-for="slide in slides" :key="slide.id">
							<slot name="sliderCard" :slide="slide"></slot>
						</div>
					</div>
				</div>
				<div
					class="js-card-pagination swiper-pagination-bullets"
					:class="`swiper-pagination-bullets--${getPageName()}`"
					ref="pagination"></div>
			</div>
			<div class="slider-foreground__arrows">
				<button class="slider-arrow slider-arrow-prev" ref="sliderPrev">
					<SvgIcon :name="`arrow-left--${getPageName()}`" />
				</button>
				<button class="slider-arrow slider-arrow-next" ref="sliderNext">
					<SvgIcon :name="`arrow-right--${getPageName()}`" />
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Swiper from 'swiper';
	import { Navigation, Pagination, EffectCreative } from 'swiper/modules';
	import 'swiper/css';
	import 'swiper/scss/effect-creative';

	export default {
		props: {
			slideIndex: {
				type: Number,
				default: 0,
			},
			slides: {
				type: Array,
				required: true,
			},
		},
		emits: {
			init: null,
			slideChange: null,
		},
		methods: {
			getSliderForegroundSliderWidth() {
				const sliderForegroundBox = this.$refs.sliderForegroundWrapper.getBoundingClientRect();
				const paddingRight = window.innerWidth - sliderForegroundBox.left;
				this.$refs.wrapper.style.cssText += `--slider-foreground-width: ${paddingRight}px`;
			},
		},
		mounted() {
			const sliderBackground = new Swiper(this.$refs.sliderBackground, {
				modules: [EffectCreative],
				effect: 'creative',
				initialSlide: this.slideIndex,
				creativeEffect: {
					prev: {
						translate: [0, 0, 0],
					},
					next: {
						translate: [0, 0, 0],
					},
				},
				slidesPerView: 1,
			});

			const sliderForeground = new Swiper(this.$refs.sliderForeground, {
				modules: [Navigation, Pagination],
				spaceBetween: 24,
				loop: true,
				initialSlide: this.slideIndex,

				pagination: {
					el: this.$refs.pagination,
					clickable: true,
				},

				navigation: {
					nextEl: this.$refs.sliderNext,
					prevEl: this.$refs.sliderPrev,
				},

				on: {
					init: (e) => {
						this.$emit('init', e.slides[e.realIndex]);
					},

					slideChange: (e) => {
						this.$emit('slideChange', e.realIndex);
					},
				},
			});

			this.getSliderForegroundSliderWidth();
			window.addEventListener('resize', this.getSliderForegroundSliderWidth);

			const swipeAllSliders = (index) => {
				if (window.innerWidth > MOBILE_SMALL) {
					sliderBackground.slideToLoop(index);
					sliderForeground.slideToLoop(index);
				}
			};

			sliderBackground.on('realIndexChange', () => swipeAllSliders(sliderBackground.realIndex));
			sliderForeground.on('realIndexChange', () => swipeAllSliders(sliderForeground.realIndex));
		},
		unmounted() {
			window.removeEventListener('resize', this.getSliderForegroundSliderWidth);
		},
	};
</script>

<style lang="scss" scoped>
	.slider-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100svh;
		overflow: hidden;
	}
	.slider-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		&__wrapper {
		}

		&__slide {
			box-sizing: border-box;
			opacity: 0 !important;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-right: var(--slider-foreground-width);
			transition: none !important;

			&.swiper-slide-active {
				opacity: 1 !important;
			}
		}

		&__image-wrapper {
			position: relative;
			z-index: 1;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: rem(56);
			transition: opacity 0.3s ease-in-out;
			transform: translateY(0) scale(0.7);

			@media (max-width: $tablet-xl) {
				padding: rem(126);
			}

			@media (max-width: $tablet) {
				padding: rem(74);
			}

			@media (max-width: $mobile) {
				padding: rem(24);
			}
		}
	}

	.slider-foreground-wrapper {
		position: absolute;
		z-index: 1;
		top: 0;
		right: rem(128);
		aspect-ratio: 688 / 976;
		height: 100%;
		overflow: hidden;
		@include adaptiveValue('padding-top', 32, 56, 0, 1440, 375);
		@include adaptiveValue('padding-bottom', 32, 20, 0, 1440, 375);
		overflow: visible;
		min-width: 0;
		display: grid;
		align-items: center;

		@media (min-width: $mobile) {
			max-width: 40vw;
		}

		@media (max-width: $tablet-xl) {
			aspect-ratio: 640 / 976;
			right: rem(84);
		}

		@media (max-width: $mobile-mid) {
			right: rem(36);
			aspect-ratio: auto;
			@include adaptiveValue('right', 56, 0, 0, 560, 375);
			@include adaptiveValue('left', 56, 0, 0, 560, 375);
			width: auto;
		}
	}

	.slider-foreground {
		height: 100%;
		width: 100%;
		@include adaptiveValue('border-radius', 32, 20, 0, 1440, 375);

		&__slider-wrapper {
			width: 100%;

			@media (max-width: $mobile) {
				height: 100%;
			}

			display: flex;
			flex-direction: column;
			gap: rem(32);
			overflow: hidden;

			@media (max-width: $tablet-xl) {
				gap: rem(20);
			}
		}

		&__wrapper {
		}

		&__slide {
			display: grid;
			align-items: center;
			height: auto;
		}

		&__arrows {
			--ratio: 56px;
			--offset: 40px;

			@media (max-width: $tablet-xl) {
				--offset: 30px;
				--ratio: 32px;
			}

			@media (max-width: $tablet-l) {
				--offset: 26px;
			}

			position: absolute;
			z-index: 3;
			left: calc((var(--ratio) + var(--offset)) * -1);
			top: 50%;
			transform: translateY(-50%);
			width: calc(100% + ((var(--ratio) + var(--offset)) * 2));
			pointer-events: none;

			display: flex;
			align-items: center;
			justify-content: space-between;

			@media (max-width: $mobile) {
				display: none;
			}
		}
	}

	.slider-arrow {
		pointer-events: auto;
		display: flex;
		transition: transform 0.3s ease-in-out;

		&:hover {
			transform: scale(1.6);
		}

		svg {
			width: var(--ratio);
			aspect-ratio: 1;

			@media (max-width: $tablet-xl) {
				transform: scale(1.4);
			}
		}
	}
</style>
