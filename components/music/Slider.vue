<template>
	<div class="wrapper" ref="wrapper">
		<div class="slider swiper" ref="slider">
			<div class="slider__wrapper swiper-wrapper">
				<div class="slider__slide swiper-slide" v-for="slide in slides" :key="slide.id">
					<div class="slider__img-wrapper" data-slider-image>
						<div class="slider__img ibg">
							<CustomImg :src="slide.imageName" />
						</div>
					</div>
					<div class="slider__song-name">{{ slide.songName }}</div>
					<div class="slider__group-name">{{ slide.groupName }}</div>
				</div>
			</div>
		</div>
		<div class="slider__controlls">
			<button class="js-arrow-prev slider-arrow" ref="arrowPrev">
				<SvgIcon name="arrow-left-music" />
			</button>
			<button class="js-arrow-next slider-arrow" ref="arrowNext">
				<SvgIcon name="arrow-right-music" />
			</button>
		</div>
	</div>
</template>

<script>
	import Swiper from 'swiper';
	import { Navigation } from 'swiper/modules';
	import 'swiper/css';

	export default {
		props: {
			slides: {
				type: Array,
				required: true,
			},
		},
		mounted() {
			const swiper = new Swiper(this.$refs.slider, {
				modules: [Navigation],
				initialSlide: window.innerWidth > MOBILE ? 4 : 0,

				loop: true,

				navigation: {
					nextEl: this.$refs.arrowNext,
					prevEl: this.$refs.arrowPrev,
				},
				breakpoints: {
					320: {
						spaceBetween: 16,
						slidesPerView: 2.7,
						centeredSlides: true,
					},
					556: {
						spaceBetween: 16,
						slidesPerView: 4,
					},
					656: {
						spaceBetween: 16,
						slidesPerView: 5,
					},
					1024: {
						spaceBetween: 24,
						slidesPerView: 6,
					},
					1440: {
						spaceBetween: 24,
						slidesPerView: 8,
					},
				},
				on: {
					resize: (e) => {
						const wrapper = this.$refs.wrapper;
						const slider = e.el;
						const image = slider.querySelector('[data-slider-image]');
						const imageHeight = image.offsetHeight;
						if (wrapper) {
							wrapper.style.cssText += `--image-height: ${imageHeight}px`;
						}
					},
				},
			});
		},
	};
</script>

<style lang="scss" scoped>
	.wrapper {
		position: relative;
		z-index: 1;
		overflow: visible;
	}
	.slider {
		width: 100%;

		&__wrapper {
		}

		&__slide {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		&__img-wrapper {
			position: relative;
			width: 100%;
			aspect-ratio: 1;
			@include adaptiveValue('border-radius', 32, 16, 0, 1440, 375);
			overflow: hidden;

			&:not(:last-child) {
				margin-bottom: rem(16);

				@media (max-width: $mobile) {
					margin-bottom: rem(8);
				}
			}
		}

		&__img {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		&__song-name {
			text-align: center;
			font-size: rem(20);
			line-height: 100%;
			letter-spacing: rem(0.2);

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
				letter-spacing: rem(0.15);
			}

			@media (max-width: $mobile) {
				font-size: rem(14);
				line-height: 142%;
				letter-spacing: rem(0.14);
			}

			&:not(:last-child) {
				margin-bottom: rem(8);

				@media (max-width: $tablet-xl) {
					margin-bottom: rem(4);
				}

				@media (max-width: $mobile) {
					margin-bottom: rem(0);
				}
			}
		}

		&__group-name {
			color: color('white', 0.4);
			font-size: rem(16);
			line-height: 100%;
			letter-spacing: rem(0.16);
			text-align: center;

			@media (max-width: $tablet-xl) {
				font-size: rem(12);
				letter-spacing: rem(0.12);
			}

			@media (max-width: $mobile) {
				line-height: 133%;
			}
		}

		&__controlls {
			--arrow-ration: 56px;

			position: absolute;
			z-index: 2;
			top: calc((var(--image-height) / 2) - (var(--arrow-ration) / 2));
			left: calc((rem(32) + var(--arrow-ration)) * -1);
			pointer-events: none;

			width: calc(100% + rem(32) * 2 + var(--arrow-ration) * 2);
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: rem(36);

			@media (max-width: $tablet-xl) {
				--arrow-ration: 32px;

				left: calc((rem(24) + var(--arrow-ration)) * -1);
				width: calc(100% + rem(24) * 2 + var(--arrow-ration) * 2);
			}

			@media (max-width: $mobile) {
				display: none;
			}
		}
	}

	.slider-arrow {
		pointer-events: auto;

		&:hover {
			svg {
				transform: scale(1.6);
			}
		}

		svg {
			width: var(--arrow-ration);
			aspect-ratio: 1;
			transition: transform 0.3s ease-in-out;
		}
	}
</style>
