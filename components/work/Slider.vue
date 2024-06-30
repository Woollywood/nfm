<script setup>
	import Swiper from 'swiper';
	import { Navigation, Pagination } from 'swiper/modules';
	import 'swiper/css';

	const props = defineProps({
		slider: {
			type: Object,
			required: true,
		},
	});

	const isVideoOnly = computed(
		() =>
			props.slider.sortedSlides.filter((slide) => slide.type === 'video').length === 1 &&
			!props.slider.sortedSlides.filter((slide) => slide.type === 'image').length
	);

	const isModalOpen = ref(false);
	const sliderIndex = ref(0);

	const slider = ref(null);
	const sliderNext = ref(null);
	const sliderPrev = ref(null);
	const pagination = ref(null);

	const videos = ref(null);

	function getSliderHeight() {
		if (slider.value) {
			const height = slider.value.offsetHeight;
			slider.value.style.cssText += `--slider-height: ${height}px`;
		}
	}

	function modalOpen() {
		isModalOpen.value = true;
	}

	function squareAspect() {
		if (videos.value) {
			const narrowSlides = videos.value.filter((item) => item.dataset.type === 'narrow');

			narrowSlides.forEach((item) => {
				item.style.width = '';
				item.style.height = '';

				const [width, height] = [item.offsetWidth, item.offsetHeight];
				const aspect = Math.min(width, height);

				item.style.width = `${aspect}px`;
				item.style.height = `${aspect}px`;
			});
		}
	}

	onMounted(() => {
		squareAspect();
		window.addEventListener('resize', squareAspect);

		new Swiper(slider.value, {
			spaceBetween: 24,
			slidesPerView: 1,
			loop: true,
			modules: [Navigation, Pagination],
			pagination: {
				el: pagination.value,
				clickable: true,
			},
			navigation: {
				nextEl: sliderNext.value,
				prevEl: sliderPrev.value,
			},
			on: {
				init: (e) => {
					getSliderHeight();
					window.addEventListener('resize', getSliderHeight);
				},

				slideChange: (e) => {
					sliderIndex.value = e.activeIndex;
				},
			},
		});
	});

	onUnmounted(() => window.removeEventListener('resize', squareAspect));
</script>

<template>
	<div class="slider-wrapper" v-if="!isVideoOnly" :class="$attrs.class" data-work-slider>
		<div class="slider-wrapper__logo">
			<CustomImg :src="props.slider.logo" />
		</div>
		<div class="slider-wrapper-inner">
			<div class="slider swiper" ref="slider">
				<div class="slider__wrapper swiper-wrapper">
					<div class="slider__slide swiper-slide" v-for="slide in props.slider.sortedSlides" :key="slide.id">
						<div class="slider__slide-content image image-container" v-if="slide.type === 'image'">
							<CustomImg
								v-for="image in slide.slides"
								:key="image.id"
								:src="image.image"
								loading="eager" />
						</div>
						<template v-else>
							<div :key="slide.id" class="slider__slide-content video">
								<div
									v-for="video in slide.slides"
									:key="video.id"
									class="slide-video video video--work narrow"
									ref="videos"
									data-type="narrow">
									<button class="poster-video ibg" @click="modalOpen">
										<CustomImg class="poster-video__img" :src="video.video_poster" />
										<SvgIcon class="poster-video__icon" name="player--work" />
									</button>
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>
			<div class="slider__bottom" id="slider-bottom">
				<div class="slider__slide-title">{{ props.slider.sortedSlides[sliderIndex].title }}</div>
				<div
					class="js-card-pagination swiper-pagination-bullets"
					:class="`swiper-pagination-bullets--${getPageName()}`"
					ref="pagination"></div>
			</div>
		</div>
		<div class="slider__arrows">
			<button class="slider-arrow slider-arrow-prev" ref="sliderPrev">
				<SvgIcon :name="`arrow-left--${getPageName()}`" />
			</button>
			<button class="slider-arrow slider-arrow-next" ref="sliderNext">
				<SvgIcon :name="`arrow-right--${getPageName()}`" />
			</button>
		</div>
	</div>
	<div class="videoContent" v-else :class="$attrs.class">
		<div class="slider-wrapper__logo">
			<CustomImg :src="props.slider.logo" />
		</div>
		<div
			class="flex items-center justify-center absolute z-[2] top-[50%] left-[50%] translate-x-[-50%] max-h-[calc(100svh-var(--header-height)*2)] translate-y-[-50%] aspect-video w-full md:max-w-[calc(min(calc(100vw-32px*4-56px*2),1440px))] h-auto">
			<CustomLoader class="centered" />
			<iframe
				:src="props.slider.sortedSlides[0].slides[0].video"
				class="h-full w-full relative z-10"
				allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
				frameborder="0"
				allowfullscreen></iframe>
		</div>
	</div>

	<CustomModal v-model="isModalOpen">
		<div class="relative w-full h-full md:max-w-[calc(min(calc(100vw-32px*4-56px*2),1440px))]">
			<CustomLoader class="centered" />
			<iframe
				:src="props.slider.sortedSlides[sliderIndex].slides[0].video"
				class="relative h-full w-full"
				allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
				frameborder="0"
				allowfullscreen></iframe>
		</div>
	</CustomModal>
</template>

<style lang="scss" scoped>
	.image-container {
		max-width: min(calc(100vw - rem(32) * 4 - rem(56) * 2), rem(1440)) !important;
		padding: 0 calc(rem($containerPadding) / 2) !important;
		margin: 0 auto;

		@media (min-width: $tablet) {
			padding: 0 rem(24);
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
		grid-template-rows: auto 1fr;

		&__logo {
			width: 100vw;
			height: var(--header-height);

			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.slider-wrapper-inner {
		display: flex;
		flex-direction: column;
		@include adaptiveValue('gap', 32, 16, 0, 1440, 375);
		justify-content: space-between;

		padding-bottom: rem(32);
	}

	.slider {
		width: 100vw;
		box-sizing: border-box;
		overflow: hidden;
		flex: 1 1 auto;

		&__wrapper {
		}

		&__slide {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
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
				display: flex;
				justify-content: center;
				align-items: center;

				.slide-video {
					position: relative;
					z-index: 2;
					@include adaptiveValue('border-radius', 24, 0, 0, 1440, 568);
					overflow: hidden;
					width: 100%;
					height: 100%;
					margin: 0 rem(16);

					&__poster {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
					}

					&.wide {
						max-width: rem(1281);
						max-height: rem(721);
						aspect-ratio: 1281 / 721;
					}

					&.narrow {
						max-width: rem(840);
						max-height: rem(840);
						aspect-ratio: 1;
					}
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
			@include adaptiveValue('font-size', 16, 13, 0, 1440, 375);
			font-weight: 700;
		}

		&__arrows {
			position: absolute;
			z-index: 2;
			top: 50%;
			left: 0;
			width: 100%;

			display: flex;
			justify-content: space-between;
			align-items: center;

			padding: 0 rem(32);
			pointer-events: none;
		}
	}

	.poster-video {
		width: 100%;
		height: 100%;

		&:hover {
			.poster-video__icon {
				transform: translate(-50%, -50%) scale(1.1);
			}
		}

		&__img {
			object-fit: cover !important;
		}

		&__icon {
			position: absolute;
			width: rem(96);
			height: rem(96);
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			transition: transform 0.1s ease-in-out;
		}
	}

	.js-card-pagination {
	}
	.swiper-pagination-bullets {
	}
	.slider-arrow {
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: auto;

		svg {
			width: rem(56);
			aspect-ratio: 1;
		}
	}
	.slider-arrow-prev {
	}
	.slider-arrow-next {
	}
</style>
