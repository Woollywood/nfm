<template>
	<div class="cases" ref="root">
		<div class="cases-wrapper" ref="wrapper">
			<div
				class="background-slider js-cases-slider js-cases-slider--background swiper"
				v-if="!isMobile"
				:style="{
					'--slider-height': `${WinHeight}px`,
				}">
				<div class="background-slider__slider-wrapper swiper-wrapper">
					<div
						v-for="(slider, index) in sliders"
						:key="slider.id"
						class="background-slider__slide swiper-slide"
						:style="{ '--slide-index': `${index}` }">
						<div class="background-slider__body">
							<div class="background-slider__background ibg">
								<CustomImg :src="slider.background_image" />
							</div>
							<div
								class="background-slider__content-wrapper fade-up fade-up--layout"
								data-content-wrapper>
								<div class="background-slider__content">
									<div class="background-slider__logo">
										<CustomImg :src="slider.badge" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				class="foreground-slider js-cases-slider js-cases-slider--foreground swiper fade-up fade-up--layout"
				ref="sliderForegroundWrapper"
				:class="{ mobile: isMobile }"
				data-slider-foreground>
				<div class="foreground-slider__slider-wrapper swiper-wrapper">
					<div
						v-for="(slider, index) in sliders"
						:key="slider.id"
						class="foreground-slider__slide swiper-slide"
						ref="foregroundSlide"
						:data-custom-slider-index="index">
						<div
							class="foreground-slider__body"
							:class="{ slideFirst: index === 0, slideLast: index === sliders.length - 1 }">
							<CasesSliderHorizontal
								:slideIndex="index"
								:slider="slider"
								@mounted="sliderMounted"
								@modalOpen="$emit('modalOpen', $event)"
								@sliderInit="sliderInit" />
						</div>
					</div>
				</div>
				<div
					class="foreground-slider-controlls fade-up fade-up--layout"
					ref="sliderControlls"
					data-slider-controlls>
					<button
						class="js-card-slider-prev slider-arrow"
						ref="buttonPrev"
						data-button-prev
						@click="sliderPrev">
						<SvgIcon name="arrow-left" />
					</button>
					<button
						class="js-card-slider-next slider-arrow"
						ref="buttonNext"
						data-button-next
						@click="sliderNext">
						<SvgIcon name="arrow-right" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { Swiper } from 'swiper';
	import { Mousewheel, EffectCreative } from 'swiper/modules';
	import 'swiper/css';

	import { useWindowSize } from '@vueuse/core';
	import { useAnimationStore } from '@/store/home.store';

	export default {
		props: {
			sliders: {
				type: Array,
				required: true,
			},
		},
		data() {
			return {
				swipers: [],
				sliderIndex: 0,
				isLocked: true,
			};
		},
		emits: {
			sliderInit: null,
		},
		setup() {
			const animationStore = useAnimationStore();

			const { width: WinWidth, height: WinHeight } = useWindowSize();
			const { isMobile } = useDevice();

			return { animationStore, WinWidth, WinHeight, isMobile };
		},
		methods: {
			sliderInit() {
				this.$emit('sliderInit');
			},

			getCardWidth(e) {
				const slider = e.hostEl;
				const caseCard = slider.querySelector('[data-case-card]');
				slider.style.cssText += `--card-width: ${caseCard.offsetWidth}px;`;
			},

			async getSliderForegroundSliderWidth() {
				await nextTick();
				try {
					const sliderForegroundBox = this.$refs.sliderForegroundWrapper.getBoundingClientRect();
					const paddingRight = window.innerWidth - sliderForegroundBox.left;
					this.$refs.wrapper.style.cssText += `--slider-foreground-width: ${paddingRight}px`;
				} catch (error) {
					console.log(error);
				}
			},

			sliderMounted(slider) {
				this.swipers.push(slider);
			},

			sliderPrev() {
				const currentSlider = this.swipers[this.sliderIndex];
				currentSlider.sliderPrevCustom();
			},

			sliderNext() {
				const currentSlider = this.swipers[this.sliderIndex];
				currentSlider.sliderNextCustom();
			},
		},
		mounted() {
			const mainSliderBackground = new Swiper('.js-cases-slider.js-cases-slider--background', {
				modules: [EffectCreative, Mousewheel],
				effect: 'creative',
				direction: 'vertical',
				mousewheel: true,
				speed: 1200,
				slidesPerView: 1,
				allowSlideNext: !this.isLocked,
				allowSlidePrev: !this.isLocked,
				creativeEffect: {
					prev: {
						shadow: true,
						opacity: 0,
						translate: [0, 0, 0],
					},
					next: {
						opacity: 1,
						translate: [0, 0, 0],
					},
				},
			});

			const mainSliderForeground = new Swiper('.js-cases-slider.js-cases-slider--foreground', {
				modules: [Mousewheel],
				direction: 'vertical',
				speed: 1200,
				slidesPerView: 'auto',
				mousewheel: true,
				autoHeight: true,
				allowSlideNext: !this.isLocked,
				allowSlidePrev: !this.isLocked,
				centeredSlides: true,
				breakpoints: {
					320: {
						spaceBetween: 24,
					},
					[MOBILE_SMALL]: {
						spaceBetween: 0,
					},
				},
				on: {
					init: (e) => {
						document.addEventListener(
							'fromHomeStart',
							async () => {
								await this.getSliderForegroundSliderWidth();
								this.getCardWidth(e);

								e.eventsListeners.resize.push(async (e) => {
									await this.getSliderForegroundSliderWidth();
									this.getCardWidth(e);
								});
							},
							{ once: true }
						);
						this.sliderIndex = e.activeIndex;
					},

					activeIndexChange: (e) => {
						this.sliderIndex = e.activeIndex;
					},
				},
			});

			if (!this.isMobile) {
				setTimeout(() => {
					this.isLocked = false;

					mainSliderBackground.params.allowSlideNext = !this.isLocked;
					mainSliderBackground.params.allowSlidePrev = !this.isLocked;
					mainSliderBackground.update();

					mainSliderForeground.params.allowSlideNext = !this.isLocked;
					mainSliderForeground.params.allowSlidePrev = !this.isLocked;
					mainSliderForeground.update();
				}, 1000);
			}

			const swipeAllSliders = (index) => {
				if (window.innerWidth > MOBILE_SMALL) {
					mainSliderBackground.slideToLoop(index);
					mainSliderForeground.slideToLoop(index);
				}
			};

			mainSliderBackground.on('slideChange', () => swipeAllSliders(mainSliderBackground.realIndex));
			mainSliderForeground.on('slideChange', () => swipeAllSliders(mainSliderForeground.realIndex));
		},
	};
</script>

<style lang="scss" scoped>
	.cases {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;

		@media (max-width: $mobile) {
			padding-top: rem(56);
		}
	}

	.cases-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;

		@media (max-width: $mobile) {
			@include adaptiveValue('padding-left', 128, 16, 0, 1440, 375);
			@include adaptiveValue('padding-right', 128, 16, 0, 1440, 375);
		}

		&__stories {
		}
	}

	.background-slider {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		&__slider-wrapper {
		}

		&__slide {
			transition: transform 1.2s ease, opacity 0.6s ease !important;
			transform: translate3d(0, calc(var(--slider-height) * var(--slide-index) * -1), 0) !important;
			opacity: 0 !important;

			&.swiper-slide-active {
				opacity: 1 !important;
				transform: translate3d(0, calc(var(--slider-height) * var(--slide-index) * -1), 0) !important;
			}

			&.swiper-slide-prev {
				opacity: 0 !important;
				transform: translate3d(
					0,
					calc((var(--slider-height) * var(--slide-index) + (var(--slider-height) * 0.2)) * -1),
					0
				) !important;
			}

			&.swiper-slide-next {
				opacity: 0 !important;
				transform: translate3d(
					0,
					calc((var(--slider-height) * var(--slide-index) - (var(--slider-height) * 0.2)) * -1),
					0
				) !important;
			}
		}

		&__body {
			position: relative;
			width: 100%;
			height: 100%;
		}

		&__background {
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		&__content-wrapper {
			position: absolute;
			z-index: 5;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-right: var(--slider-foreground-width);
		}

		&__content {
			position: relative;
			z-index: 2;
			width: 100%;
			height: 100%;
			padding: rem(36);

			display: flex;
			align-items: center;
			justify-content: center;

			@media (max-width: $tablet-xl) and (min-width: $mobile) {
				transform: scale(0.7);
			}
		}

		&__logo {
			transform: scale(0.75);
		}
	}

	.foreground-slider {
		position: absolute;
		z-index: 1;
		top: 0;
		right: rem(128);
		max-width: min(40vw);
		width: 100%;
		max-height: 100svh;
		height: 100%;
		overflow: hidden;
		@include adaptiveValue('padding-top', 32, 56, 0, 1440, 375);
		@include adaptiveValue('padding-bottom', 32, 20, 0, 1440, 375);
		overflow: visible;

		@media (max-width: $tablet-xl) {
			max-width: 40vw;
			aspect-ratio: 640 / 976;
			right: rem(84);
		}

		@media (max-width: $tablet-l) {
			aspect-ratio: 504 / 976;
		}

		min-width: 0;

		@media (max-width: $mobile-mid) {
			right: rem(36);
			aspect-ratio: auto;
			@include adaptiveValue('right', 56, 0, 0, 560, 375);
			@include adaptiveValue('left', 56, 0, 0, 560, 375);
			width: auto;
		}

		&.mobile {
			@media (min-width: $mobile) {
				@include adaptiveValue('padding-top', 120, 56, 0, 1440, 375);
			}
		}

		&__slider-wrapper {
			max-height: 100svh;
		}

		&__slide {
			max-height: 100svh;

			@media (max-width: $mobile) {
				box-sizing: border-box;

				&:not(:last-child) {
					padding: 0 rem(16);

					padding-bottom: rem(24);
					border-bottom: rem(1) solid color('white', 0.16);
				}
			}
		}

		&__body {
			box-sizing: border-box;
			position: relative;
			width: 100%;
			height: 100%;
		}
	}

	.cases-slider {
		width: 100%;
		height: 100%;

		&__slider-wrapper {
		}

		&__slide {
			transition: all 0.3s ease;
		}

		&__body {
			box-sizing: border-box;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			@include adaptiveValue('padding-top', 32, 16, 0, 1440, 1200);
			@include adaptiveValue('padding-bottom', 32, 20, 0, 1440, 1200);
			@include adaptiveValue('padding-right', 128, 16, 0, 1440, 375);
			@include adaptiveValue('padding-left', 128, 16, 0, 1440, 375);
		}

		&__background {
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		&__content {
			position: relative;
			height: 100%;
			z-index: 2;
			display: grid;
			grid-template-columns: 60% 1fr;
			@include adaptiveValue('gap', 32, 24, 0, 1440, 1200);
			align-items: center;
		}

		&__left {
		}

		&__logo {
		}

		&__right {
			min-width: 0;
		}
	}

	.foreground-slider-controlls {
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

		.slider-arrow {
			width: var(--ratio);
			aspect-ratio: 1;
			border-radius: 50%;
			pointer-events: auto;

			display: flex;
			justify-content: center;
			align-items: center;

			svg {
				fill: color('white');
				width: calc(var(--ratio) / 2);
				aspect-ratio: 1;
			}
		}
	}
</style>
