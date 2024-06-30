<template>
	<div class="slider-wrapper" ref="sliderWrapper">
		<div class="slider swiper" ref="slider">
			<div class="slider__wrapper swiper-wrapper">
				<div class="slider__slide swiper-slide" v-for="slide in slides" :key="slide.id">
					<div class="slide">
						<div class="slide__image-wrapper">
							<div class="slide__image ibg">
								<CustomImg :src="slide.image" />
							</div>
						</div>
						<div class="slide__body">
							<div class="slide__body-wrapper" ref="bodyWrapper">
								<div class="slide__head">
									<div class="slide__left">
										<div class="slide__title">{{ slide.name }}</div>
										<div class="slide__rate">
											<SvgIcon name="star" v-for="rating in slide.stars" />
										</div>
									</div>
									<div class="slide__avatar ibg">
										<CustomImg :src="slide.teammate.thumbnail" />
									</div>
								</div>
								<div class="slide__main">
									<div class="slide__text" v-html="slide.review"></div>
									<div class="slide__username">{{ slide.teammate.nickname }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="slider__arrows">
			<button class="slider-arrow slider-arrow-prev" ref="sliderPrev" @click="sliderPrev">
				<SvgIcon :name="`arrow-left--${getPageName()}`" />
			</button>
			<button class="slider-arrow slider-arrow-next" ref="sliderNext" @click="sliderNext">
				<SvgIcon :name="`arrow-right--${getPageName()}`" />
			</button>
		</div>
	</div>
</template>

<script>
	import Swiper from 'swiper';
	import { Pagination } from 'swiper/modules';

	import 'swiper/css';
	import 'swiper/css/navigation';

	export default {
		props: {
			slides: {
				type: Array,
				required: true,
			},
			modelValue: {
				type: Number,
				required: true,
			},
		},
		methods: {
			getBodyWrapperHeight() {
				const { sliderWrapper, bodyWrapper } = this.$refs;

				if (sliderWrapper) {
					sliderWrapper.style.cssText += `--body-wrapper-height: ${bodyWrapper.offsetHeight}px`;
				}
			},
			sliderPrev() {
				const { slider } = this.$options;
				slider.slidePrev();
			},
			sliderNext() {
				const { slider } = this.$options;
				slider.slideNext();
			},
		},
		slider: null,
		mounted() {
			const { slider, sliderPrev, sliderNext } = this.$refs;

			this.$options.slider = new Swiper(slider, {
				spaceBetween: 12,
				slidesPerView: 1,
				loop: true,

				modules: [Pagination],

				// Navigation arrows
				navigation: {
					nextEl: sliderNext,
					prevEl: sliderPrev,
				},

				on: {
					init: (e) => {
						this.getBodyWrapperHeight();
					},

					resize: (e) => {
						this.getBodyWrapperHeight();
					},

					slideChange: (e) => {
						this.$emit('update:modelValue', e.realIndex);
					},
				},
			});
		},
		watch: {
			modelValue(newValue, oldValue) {
				const { slider } = this.$options;
				slider.slideToLoop(newValue, slider.originalParams.speed, null);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.slider {
		position: relative;
		min-width: 0;
		max-width: 100%;
		width: 40vw;
		display: flex;

		@include adaptiveValue('border-radius', 24, 12, 0, 1440, 375);

		@media (max-width: $tablet-xl) {
			width: rem(464);
		}

		@media (max-width: $tablet) {
			width: auto;
		}

		@media (max-width: $tablet) {
			display: flex;
		}

		@media (max-width: $tablet) {
			overflow: visible;
		}

		* {
			min-width: 0;
		}

		&__wrapper {
			display: flex;
			height: 100%;
		}

		&__slide {
			height: 100%;
		}

		&__arrows {
			--ratio: 56px;
			--offset: 40px;

			position: absolute;
			z-index: 3;
			left: calc((var(--ratio) + var(--offset)) * -1);
			top: rem(160);
			width: calc(100% + ((var(--ratio) + var(--offset)) * 2));
			pointer-events: none;
			transform: translateY(-50%);

			display: flex;
			align-items: center;
			justify-content: space-between;

			@media (max-width: $tablet-xl) {
				--offset: 16px;
				--ratio: 36px;
				top: rem(112);
			}

			@media (max-width: $tablet-l) {
				--offset: 8px;
			}

			@media (max-width: $tablet) {
				display: none;
			}

			@media (max-width: $mobile) {
				top: rem(72);
			}

			@media (max-width: $mobile-mid) {
				display: none;
			}
		}
	}

	.slide {
		position: relative;
		@include adaptiveValue('border-radius', 24, 12, 0, 1440, 375);
		background-color: color('red-1');
		overflow: hidden;
		height: 100%;
		display: flex;
		flex-direction: column;

		&__image-wrapper {
			position: relative;
			height: rem(160);

			@media (max-width: $tablet-xl) {
				height: rem(112);
			}

			@media (max-width: $mobile) {
				height: rem(72);
			}
		}

		&__image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		&__body {
			position: relative;
			flex: 1 1 auto;
			display: grid;

			&::before {
				content: '';
				position: absolute;
				z-index: 1;
				top: 0;
				left: 0;
				width: 100%;
				height: rem(96);
				background: linear-gradient(180deg, rgba(0, 0, 0, 0.32) 0%, rgba(0, 0, 0, 0) 100%);

				@media (max-width: $tablet-xl) {
					height: rem(56);
				}

				@media (max-width: $mobile) {
					height: rem(48);
				}
			}
		}

		&__body-wrapper {
			position: relative;
			z-index: 2;
			padding: rem(24) rem(40) rem(34);

			@media (max-width: $tablet-xl) {
				padding: rem(16) rem(24) rem(20);
			}

			@media (max-width: $mobile) {
				padding: rem(14) rem(16) rem(16);
			}
		}

		&__head {
			display: flex;
			justify-content: space-between;
			align-items: center;

			&:not(:last-child) {
				margin-bottom: rem(18);

				@media (max-width: $tablet-xl) {
					margin-bottom: rem(8);
				}

				@media (max-width: $mobile) {
					margin-bottom: rem(12);
				}
			}
		}

		&__left {
		}

		&__title {
			font-size: rem(28);
			font-weight: 500;
			letter-spacing: rem(-0.28);
			line-height: 100%;

			@media (max-width: $tablet-xl) {
				font-size: rem(18);
				letter-spacing: rem(-0.18);
			}

			@media (max-width: $mobile) {
				font-size: rem(16);
				letter-spacing: rem(-0.16);
			}

			&:not(:last-child) {
				margin-bottom: rem(10);

				@media (max-width: $tablet-xl) {
					margin-bottom: rem(4);
				}

				@media (max-width: $mobile) {
					margin-bottom: rem(1.6);
				}
			}
		}

		&__rate {
			display: flex;
			align-items: center;
			@include adaptiveValue('gap', 6, 4, 0, 1440, 375);

			svg {
				width: rem(20);
				height: rem(28);

				@media (max-width: $tablet-xl) {
					width: rem(14);
					height: rem(18);
				}

				@media (max-width: $mobile) {
					width: rem(12);
					height: rem(18);
				}
			}
		}

		&__avatar {
			width: rem(64);
			aspect-ratio: 1;
			border-radius: 50%;
			overflow: hidden;

			@media (max-width: $tablet-xl) {
				width: rem(40);
			}

			@media (max-width: $mobile) {
				width: rem(32);
				margin-top: rem(-8);
			}
		}

		&__main {
		}

		&__text {
			@media (max-width: $tablet-xl) and (min-width: $mobile) {
				&:not(:last-child) {
					margin-bottom: rem(0.33);
				}
			}

			@media (max-width: $mobile) {
				&:not(:last-child) {
					margin-bottom: rem(8);
				}
			}

			::v-deep(p) {
				font-size: rem(22);
				line-height: 124%;
				letter-spacing: rem(-0.22);

				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;

				span {
					color: white !important;
				}

				@media (max-width: $tablet-l) {
					font-size: rem(18);
					letter-spacing: rem(-0.18);
					line-height: 128%;
				}

				@media (max-width: $mobile) {
					font-size: rem(15);
					letter-spacing: rem(-0.15);
					line-height: 134%;

					&:not(:last-child) {
						margin-bottom: rem(8);
					}
				}
			}
		}

		&__username {
			font-size: rem(22);
			font-weight: 700;
			line-height: 128%;
			letter-spacing: rem(-0.22);

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
				letter-spacing: rem(-0.15);
			}

			@media (max-width: $tablet-xl) and (min-width: $mobile) {
				line-height: 134%;
			}

			@media (max-width: $mobile) {
				font-size: rem(12);
				letter-spacing: rem(-0.12);
			}
		}
	}

	.slider-arrow {
		pointer-events: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: transform 0.3s ease-in-out;

		&:hover {
			transform: scale(1.1);

			@media (max-width: $tablet-xl) {
				transform: scale(1.4);
			}
		}

		svg {
			width: var(--ratio);
			aspect-ratio: 1;
		}
	}
	.slider-arrow-prev {
	}
	.slider-arrow-next {
	}
</style>
