<script setup>
	import Swiper from 'swiper';
	import { Pagination } from 'swiper/modules';

	const sliderRef = ref();
	const pagination = ref();
	const sliderPrevRef = ref();
	const sliderNextRef = ref();

	const props = defineProps({
		slides: {
			type: Array,
			required: true,
		},
		id: {
			type: Number,
			required: true,
		},
		slug: {
			type: String,
			required: true,
		},
	});

	const emits = defineEmits(['slideChange']);

	let slider = null;

	onMounted(() => {
		slider = new Swiper(sliderRef.value, {
			modules: [Pagination],
			spaceBetween: 12,
			slidesPerView: 1,
			loop: true,
			initialSlide: props.id - 1,
			pagination: {
				el: pagination.value,
				clickable: true,
			},

			navigation: {
				nextEl: sliderNextRef.value,
				prevEl: sliderPrevRef.value,
			},

			on: {
				slideChange: (swiper) => {
					const card = props.slides.find((card) => card.id === swiper.realIndex + 1);
					emits('slideChange', card.slug);
				},
			},
		});
	});

	function sliderPrev() {
		slider.slidePrev();
	}

	function sliderNext() {
		slider.slideNext();
	}
</script>

<template>
	<div class="slider-wrapper">
		<div class="swiper slider" ref="sliderRef">
			<div class="swiper-wrapper" data-animation-slider>
				<div class="swiper-slide slide" v-for="slide in slides" :key="slide.id">
					<div class="merch-card__image ibg" :data-animation-card="slide.id">
						<CustomImg :src="slide.image" />
					</div>
				</div>
			</div>
		</div>
		<div class="slider__arrows">
			<button class="slider-arrow slider-arrow-prev" ref="sliderPrevRef" @click="sliderPrev">
				<SvgIcon :name="`arrow-left--team`" />
			</button>
			<button class="slider-arrow slider-arrow-next" ref="sliderNextRef" @click="sliderNext">
				<SvgIcon :name="`arrow-right--team`" />
			</button>
		</div>
		<div
			class="js-card-pagination bullets swiper-pagination-bullets swiper-pagination-bullets--team"
			ref="pagination"></div>
	</div>
</template>

<style scoped lang="scss">
	.slider-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		min-width: 0;

		// display: flex;
		// flex-direction: column;

		@media (max-width: $tablet) {
			gap: rem(20);
		}
	}

	.bullets {
		@media (min-width: $tablet) {
			position: absolute;
			top: calc(100% + rem(24));
			left: 50%;
			transform: translateX(-50%);

			@media (max-width: $tablet-xl) {
				top: calc(100% + rem(20));
			}
		}

		@media (max-width: $tablet) {
			position: fixed;
			bottom: calc(6svh / 2);
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
	.slider {
		position: relative;
		width: 100%;
		height: 100%;
		@include adaptiveValue('border-radius', 24, 12, 0, 1440, 375);
		overflow: hidden;

		@media (max-width: $mobileSmall) {
			width: calc(100vw - rem(24) * 2);
		}

		&__arrows {
			--ratio: 56px;
			--offset: 24px;

			@media (max-width: $tablet-xl) {
				--offset: 16px;
				--ratio: 36px;
			}

			@media (max-width: $tablet) {
				--offset: 8px;
			}

			@media (max-width: $mobile) {
				--offset: 16px;
				--ratio: 36px;
			}

			position: absolute;
			z-index: 3;
			left: calc((var(--ratio) + var(--offset)) * -1);
			top: 50%;
			width: calc(100% + ((var(--ratio) + var(--offset)) * 2));
			pointer-events: none;
			transform: translateY(-50%);

			display: flex;
			align-items: center;
			justify-content: space-between;

			@media (max-width: $mobile-mid) {
				display: none;
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

	.merch-card {
		&__image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			@include adaptiveValue('border-radius', 24, 12, 0, 1440, 375);
			overflow: hidden;
		}
	}
</style>
