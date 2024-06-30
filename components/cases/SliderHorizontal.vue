<script setup>
	import lozad from 'lozad';
	import { useCurrentElement } from '@vueuse/core';

	const rootEl = useCurrentElement();
	const { isMobile } = useDevice();

	onMounted(() => {
		const observer = lozad(rootEl.value.querySelectorAll('video'));
		observer.observe();
	});
</script>

<template>
	<div class="case-card" data-case-card ref="root">
		<div class="case-card__body">
			<!-- <div class="case-card__stories" v-if="slideIndex === 0">
				<CasesStories />
			</div> -->
			<div class="case-card__header card-header">
				<div class="card-header__logo ibg">
					<CustomImg :src="slider.logo" />
				</div>
				<div class="card-header__text-wrapper">
					<div class="card-header__title">
						<div
							class="card-header__title-item"
							v-for="(title, index) in slider.name.split(',')"
							:key="index">
							{{ title }}
						</div>
					</div>
					<div class="card-header__bottom">
						<div
							class="card-header__bottom-item"
							v-for="(text, index) in slider.case_types.split(',')"
							:key="index">
							{{ text }}
						</div>
					</div>
				</div>
			</div>
			<div class="case-card__slider">
				<div class="case-slider swiper" ref="slider">
					<div class="case-slider__slider-wrapper swiper-wrapper">
						<div
							v-for="(slide, index) in slides"
							:key="slide.id"
							class="case-slider__slide swiper-slide !h-full"
							ref="caseSlider">
							<div
								class="case-slider__body !h-full"
								:style="[slide.long ? 'grid-template-rows: 1fr' : '']">
								<template v-if="!(!!slide.video_frame || !!slide.video)">
									<CasesSlideWrapper :slide="slide" :index="index" :ref="`sliderInner-${index}`" />
								</template>
								<div
									class="case-slider__wrapper"
									data-slider-image
									:class="{ mobile: isMobile }"
									v-else>
									<div class="case-slider__image case-slider__image--events-reset ibg">
										<CustomLoader class="case-slider__loader" />
										<video
											v-if="slide.autoplay"
											muted
											autoplay
											playsinline
											loop
											class="case-slider__video lozad">
											<source :data-src="slide.video" type="video/mp4" />
										</video>
										<div class="case-slider__video ibg" v-else>
											<button
												class="case-slider__video-button ibg"
												@click="$emit('modalOpen', slide.video_frame)">
												<CustomImg :src="slide.video_poster" />
												<SvgIcon class="case-slider__video-icon" name="player--work" />
											</button>
										</div>
									</div>
								</div>
								<div
									v-if="!slide.long"
									class="case-slider__text"
									data-slide-text
									v-html="slide.description"></div>
							</div>
						</div>
					</div>
					<div
						class="js-card-pagination swiper-pagination-bullets swiper-pagination-bullets--cases"
						ref="pagination"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { Swiper, SwiperSlide } from 'swiper/vue';
	import { Swiper as SwiperConstructor } from 'swiper';
	import { Pagination } from 'swiper/modules';
	import 'swiper/css';

	export default {
		components: {
			Swiper,
			SwiperSlide,
		},
		data() {
			return {
				lastSliderIndex: 0,
				slidesHeight: [],
			};
		},
		emits: {
			sliderInit: null,
		},
		props: {
			slider: {
				type: Object,
				required: true,
			},
			slideIndex: {
				type: Number,
				required: true,
			},
		},
		computed: {
			slides() {
				return this.slider.slides.slice(0).sort((a, b) => a.sorting - b.sorting);
			},
		},
		mounted() {
			const cardSlider = new SwiperConstructor(this.$refs.slider, {
				modules: [Pagination],
				lazy: true,
				loop: true,
				slidesPerView: 1,
				spaceBetween: 24,
				pagination: {
					el: this.$refs.pagination,
					clickable: true,
				},
				on: {
					init: (e) => {
						document.addEventListener(
							'fromHomeEnd',
							() => {
								this.$emit('sliderInit');
							},
							{ once: true }
						);
					},

					realIndexChange: (e) => {
						const getSwipers = () => {
							const wrapper = e.el;
							const sliderInnerList = wrapper.querySelectorAll('[data-slider-inner]');
							const sliderInnerIndexList = Array.from(sliderInnerList).map(
								(slider) => slider.dataset.sliderInner
							);
							return new Array(sliderInnerIndexList.length)
								.fill(null)
								.map(
									(swiper, index) =>
										this.$refs[`sliderInner-${sliderInnerIndexList[index]}`][0].sliderInner
											.sliderInner.$.provides.swiper.value
								);
						};
						if (e.realIndex === e.slides.length - 1 && this.lastSliderIndex === 0) {
							getSwipers().forEach((swiper) => swiper.slidePrev(swiper.params.speed));
						}
						if (e.realIndex === 0 && this.lastSliderIndex === e.slides.length - 1) {
							getSwipers().forEach((swiper) => swiper.slidePrev(swiper.params.speed));
						}

						this.lastSliderIndex = e.realIndex;

						const slides = e.slides.sort((a, b) => a.dataset.swiperSlideIndex - b.dataset.swiperSlideIndex);
						const index = e.realIndex;
						const prevSlide = slides[index - 1];
						const nextSlide = slides[index + 1];

						if (prevSlide?.querySelector('[data-slider-inner]')) {
							const swiperInner =
								this.$refs[`sliderInner-${index - 1}`][0].sliderInner.sliderInner.$.provides.swiper
									.value;
							swiperInner.slideNext(swiperInner.params.speed);
						}
						if (nextSlide?.querySelector('[data-slider-inner]')) {
							const swiperInner =
								this.$refs[`sliderInner-${index + 1}`][0].sliderInner.sliderInner.$.provides.swiper
									.value;
							swiperInner.slidePrev(swiperInner.params.speed);
						}
					},
				},
			});

			const thisArg = this;

			cardSlider.sliderPrevCustom = function () {
				const slider = cardSlider;
				const slides = cardSlider.slides
					.slice()
					.sort((a, b) => a.dataset.swiperSlideIndex - b.dataset.swiperSlideIndex);
				const currentSlide = slides[slider.realIndex];

				if (currentSlide.querySelector('[data-slider-inner]')) {
					const swiperInner =
						thisArg.$refs[`sliderInner-${slider.realIndex}`][0].sliderInner.sliderInner.$.provides.swiper
							.value;

					if (!swiperInner.isBeginning) {
						swiperInner.slidePrev(swiperInner.params.speed);
					} else {
						const prevRealIndex = slider.realIndex;
						slider.slidePrev(slider.params.speed);

						if (prevRealIndex === slider.realIndex) {
							slider.slidePrev(slider.params.speed);
						}
					}
				} else {
					const prevRealIndex = slider.realIndex;
					slider.slidePrev(slider.params.speed);

					if (prevRealIndex === slider.realIndex) {
						slider.slidePrev(slider.params.speed);
					}
				}
			};

			cardSlider.sliderNextCustom = function () {
				const slider = cardSlider;
				const slides = cardSlider.slides
					.slice()
					.sort((a, b) => a.dataset.swiperSlideIndex - b.dataset.swiperSlideIndex);
				const currentSlide = slides[slider.realIndex];

				if (currentSlide.querySelector('[data-slider-inner]')) {
					const swiperInner =
						thisArg.$refs[`sliderInner-${slider.realIndex}`][0].sliderInner.sliderInner.$.provides.swiper
							.value;

					if (!swiperInner.isEnd) {
						swiperInner.slideNext(swiperInner.params.speed);
					} else {
						const prevRealIndex = slider.realIndex;
						slider.slideNext(slider.params.speed);

						if (prevRealIndex === slider.realIndex) {
							slider.slideNext(slider.params.speed);
						}
					}
				} else {
					const prevRealIndex = slider.realIndex;
					slider.slideNext(slider.params.speed);

					if (prevRealIndex === slider.realIndex) {
						slider.slideNext(slider.params.speed);
					}
				}
			};

			this.$emit('mounted', cardSlider);
		},
	};
</script>

<style lang="scss" scoped>
	.slider-inner-text-slider {
		width: 100%;
		min-width: 0;

		&__slide {
			min-width: 0;
		}
	}
	.player-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: rem(96);
		aspect-ratio: 1;

		@media (max-width: $mobile) {
			width: rem(80);
		}
	}
	.case-card {
		height: 100%;
		--padding: 24px;

		@media (max-width: $tablet-xl) {
			--padding: 20px;
		}

		&__body {
			height: 100%;
			display: flex;
			flex-direction: column;

			@media (min-width: $mobile) {
				overflow: hidden;
			}

			@media (min-width: $mobile) {
				border: 1px solid color('white', 0.24);
				background: color('white', 0.12);
				backdrop-filter: blur(12px);
				padding: var(--padding);

				@media (max-width: $tablet) {
					--padding: 12px;
				}

				.slideFirst & {
					border-top-right-radius: rem(32);
					border-top-left-radius: rem(32);
				}

				.slideLast & {
					border-bottom-left-radius: rem(32);
					border-bottom-right-radius: rem(32);
				}
			}
		}

		&__stories {
			@media (min-width: $mobile) {
				@include adaptiveValue('padding', 24, 12, 0, 1440, 1200);
				@include adaptiveValue('margin', -24, -12, 0, 1440, 1200);
			}

			@media (max-width: $mobile) {
				padding: 0 rem(16);
				margin: 0 rem(-16);
			}

			&:not(:last-child) {
				@include adaptiveValue('padding-bottom', 24, 14, 0, 1440, 375);
				border-bottom: rem(1) solid color('white', 0.32);
				@include adaptiveValue('margin-bottom', 24, 14, 0, 1440, 375);
			}
		}

		&__slider {
			flex: 1 1 auto;
		}

		&__header {
		}
	}
	.card-header {
		display: flex;
		align-items: center;
		@include adaptiveValue('gap', 16, 12, 0, 1440, 375);

		&:not(:last-child) {
			@include adaptiveValue('margin-bottom', 24, 16, 0, 1440, 375);
		}

		&__logo {
			flex-grow: 0;
			flex-shrink: 0;
			@include adaptiveValue('flex-basis', 56, 40, 0, 1440, 375);
			@include adaptiveValue('width', 56, 40, 0, 1440, 375);
			aspect-ratio: 1;
			border-radius: 50%;
			overflow: hidden;
		}

		&__text-wrapper {
			display: flex;
			flex-direction: column;
		}

		&__title {
			display: flex;
			@include adaptiveValue('gap', 8, 5, 0, 1440, 375);
			align-items: center;
		}

		&__title-item {
			font-size: rem(20);
			font-weight: 500;
			line-height: 120%;
			letter-spacing: 0.2px;

			@media (max-width: $tablet-xl) {
				font-size: rem(18);
			}

			@media (max-width: $mobile) {
				font-size: rem(14);
			}

			&:not(:first-child) {
				position: relative;
				@include adaptiveValue('gap', 8, 5, 0, 1440, 375);
				display: flex;
				align-items: center;

				&::before {
					content: '';
					@include adaptiveValue('width', 4, 3, 0, 1440, 375);
					aspect-ratio: 1;
					border-radius: 50%;
					background-color: color('white');
				}
			}
		}

		&__bottom {
			display: flex;
			@include adaptiveValue('gap', 8, 5, 0, 1440, 375);
			align-items: center;
		}

		&__bottom-item {
			font-size: rem(16);
			line-height: 150%;
			letter-spacing: 0.16px;

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
			}

			@media (max-width: $mobile) {
				font-size: rem(12);
			}

			&:not(:first-child) {
				position: relative;
				@include adaptiveValue('gap', 8, 5, 0, 1440, 375);
				display: flex;
				align-items: center;

				&::before {
					content: '';
					@include adaptiveValue('width', 4, 3, 0, 1440, 375);
					aspect-ratio: 1;
					border-radius: 50%;
					background-color: color('white');
				}
			}
		}
	}

	.case-slider {
		height: 100%;
		overflow: visible;

		&__slider-wrapper {
		}

		&__slide {
		}

		&__body {
			position: relative;
			height: auto;
			display: grid;
			grid-template-rows: auto calc(3em * 1.2);

			font-size: rem(20);
			line-height: 120%;
			letter-spacing: rem(0.2);

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
			}

			@media (max-width: $mobile) {
				font-size: rem(13);
				line-height: 124%;
				letter-spacing: rem(0.13);
			}

			min-width: 0;

			* {
				min-width: 0;
			}
		}

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

		&__loader {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		&__video {
			position: absolute;
			z-index: 1000;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			-webkit-mask-image: -webkit-radial-gradient(white, black);
		}

		&__video-button {
			width: 100%;
			height: 100%;

			&:hover {
				.case-slider__video-icon {
					transform: translate(-50%, -50%) scale(1.1);
				}
			}
		}

		&__video-icon {
			position: absolute;
			width: rem(96);
			height: rem(96);
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			transition: transform 0.1s ease-in-out;
		}

		&__text {
			display: -webkit-box;
			-webkit-line-clamp: 4;
			-webkit-box-orient: vertical;
			overflow: hidden;

			&--big {
				width: calc(50% - var(--padding));
			}
		}
	}

	.js-card-pagination {
		position: absolute;
		z-index: 1;
		top: calc(var(--image-height) + ((var(--container-height) - var(--image-height)) / 2));
		transform: translateY(-50%);
		width: 100%;
	}
</style>
