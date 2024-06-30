<template>
	<div class="slider-wrapper" v-if="!isVideoOnly" data-work-slider>
		<div class="slider swiper" ref="slider">
			<div class="slider__wrapper swiper-wrapper">
				<div class="slider__slide swiper-slide big" v-for="slide in slides.slides" :key="slide.id">
					<div class="slider__slide-content image" v-if="slide.type === 'image'">
						<!-- <swiper
							class="slider-inner"
							v-if="slide.kind === 'big'"
							:class="{ big: slide.kind }"
							:slidesPerView="0.5"
							:spaceBetween="16"
							:initialSlide="2"
							data-slider-inner
							:ref="`sliderInner-${index}`">
							<swiper-slide class="slider-inner__slide">
								<div class="slider-inner__image">
									<CustomImg :src="slide.path" loading="eager" />
								</div>
							</swiper-slide>
						</swiper> -->
						<CustomImg :src="slide.image" loading="eager" />
					</div>
					<div class="slider__slide-content video narrow" v-else>
						<button class="slide-video video video--work" @click="modalOpen">
							<CustomImg class="poster__img" :src="slide.video_poster" />
							<SvgIcon class="poster__icon" name="player--work" />
							<!-- <div class="slide-video__info-wrapper">
								<SvgIcon class="slide-video__icon" name="video-time" />
								<div class="slide-video__timestamp">
									<span>{{ slide.timestamp.m }}</span>
									<span>{{ slide.timestamp.s }}</span>
								</div>
							</div> -->
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="slider__bottom" id="slider-bottom">
			<div class="slider__slide-title multiline">
				{{ slides.slides[sliderIndex].name }}
			</div>
			<div
				class="js-card-pagination swiper-pagination-bullets"
				:class="`swiper-pagination-bullets--${getPageName()}`"
				ref="pagination"></div>
		</div>
	</div>
	<div class="videoContent" v-else>
		<CustomLoader class="centered" />
		<iframe
			:src="slides.slides[0].video"
			allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
			frameborder="0"
			allowfullscreen
			style="position: absolute; width: 100%; height: 100%; top: 0; left: 0"></iframe>
	</div>

	<CustomModal v-if="isModalOpen && !isVideoOnly" v-model="isModalOpen">
		<div class="modal-video">
			<CustomLoader class="centered" />
			<iframe
				:src="slides.slides[sliderIndex].video"
				allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
				frameborder="0"
				allowfullscreen
				style="position: absolute; width: 100%; height: 100%; top: 0; left: 0"></iframe>
		</div>
	</CustomModal>
</template>

<script>
	import { Swiper, SwiperSlide } from 'swiper/vue';
	import { Swiper as SwiperConstructor } from 'swiper';
	import { Navigation, Pagination } from 'swiper/modules';

	export default {
		components: {
			Swiper,
			SwiperSlide,
		},
		props: {
			slides: {
				type: Object,
				required: true,
			},
		},
		data() {
			return {
				isModalOpen: false,
				sliderIndex: 0,
			};
		},
		computed: {
			isVideoOnly() {
				return this.slides.slides.length === 1 && this.slides.slides[0].type === 'video';
			},
		},
		methods: {
			getSliderHeight() {
				const { slider } = this.$refs;

				if (slider) {
					const height = slider.offsetHeight;
					slider.style.cssText += `--slider-height: ${height}px`;
				}
			},

			modalOpen() {
				this.isModalOpen = true;
			},
		},
		mounted() {
			const swiper = new SwiperConstructor(this.$refs.slider, {
				spaceBetween: 24,
				slidesPerView: 1,
				loop: true,
				modules: [Navigation, Pagination],
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
						this.getSliderHeight();
						window.addEventListener('resize', this.getSliderHeight);
					},

					slideChange: (e) => {
						this.sliderIndex = e.activeIndex;

						const slider = e.hostEl;
						const slides = e.slides;
						const index = e.activeIndex;

						const prevSlide = slides[index - 1];
						const curSlide = slides[index];
						const nextSlide = slides[index + 1];

						if (prevSlide?.querySelector('[data-slider-inner]')) {
							const swiperInner = this.$refs[`sliderInner-${index - 1}`][0].$.provides.swiper.value;
							swiperInner.slideNext(swiperInner.params.speed);
						}

						if (nextSlide?.querySelector('[data-slider-inner]')) {
							const swiperInner = this.$refs[`sliderInner-${index + 1}`][0].$.provides.swiper.value;
							swiperInner.slidePrev(swiperInner.params.speed);
						}
					},
				},
			});
		},
	};
</script>

<style lang="scss" scoped>
	.poster {
		&__img {
		}

		&__icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: rem(80);
			height: rem(80);
		}
	}

	.videoContent {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100svh;
		overflow: hidden;
	}
	.slider-wrapper {
		position: relative;
		width: 100%;
		height: 100svh;
		display: grid;
		grid-template-rows: 1fr auto;
		@include adaptiveValue('gap', 32, 16, 0, 768, 375);

		padding-top: var(--header-height);
		padding-bottom: rem(32);
	}

	.slider {
		width: 100vw;
		box-sizing: border-box;
		overflow: hidden;

		&__wrapper {
		}

		&__slide {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;

			&.big {
				.slider__slide-content {
					&.image {
						box-sizing: border-box;
						padding: 0 rem(16);
					}
				}
			}
		}

		&__slide-content {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 100%;
			height: 100%;

			max-height: var(--slider-height);
			max-width: 100%;

			@include adaptiveValue('gap', 96, 32, 0, 1440, 1440);

			&.image {
				display: grid;
				grid-auto-flow: column;
				align-items: center;
				justify-content: center;
			}

			&.video {
				width: calc(100% - rem(32));
				display: grid;
				align-items: center;

				&.wide {
					width: calc(100% - rem(32));
					height: calc(100vw - rem(32));
				}

				&.narrow {
					width: calc(100% - rem(32));
					height: calc((100vw - rem(32)) * 0.58);
				}

				.slide-video {
					position: relative;
					@include adaptiveValue('border-radius', 24, 0, 0, 1440, 568);
					overflow: hidden;
					width: 100%;
					height: 100%;
				}

				.player-icon {
					@include adaptiveValue('width', 96, 80, 0, 1440, 375);
					aspect-ratio: 1;
				}
			}

			img {
				max-height: var(--slider-height);
				object-fit: contain;
			}
		}

		&__bottom {
			display: flex;
			flex-direction: column;
			@include adaptiveValue('gap', 28, 18, 0, 1440, 375);
			align-items: center;
		}

		&__slide-title {
			text-align: center;
			@include adaptiveValue('font-size', 16, 13, 0, 1440, 375);
			font-weight: 500;
		}
	}

	.slide-video {
		position: relative;

		&__info-wrapper {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			padding: rem(16);
			background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.64) 100%);

			display: flex;
			align-items: center;
			gap: rem(8);
		}

		&__icon {
			width: rem(16);
			aspect-ratio: 1;
		}

		&__timestamp {
			color: color('white', 0.4);
			font-size: rem(12);
			line-height: 100%;
		}
	}

	.slider-inner {
		width: 100%;
		min-width: 0;
		box-sizing: border-box;
		overflow: visible;

		&.big {
			width: auto;
			margin: 0 rem(-16);
		}

		&__slide {
		}

		&__image {
			width: 200vw;
		}
	}
</style>
