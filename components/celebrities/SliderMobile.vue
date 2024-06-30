<script setup>
	import { Swiper } from 'swiper';
	import { Mousewheel } from 'swiper/modules';
	import 'swiper/css';

	const props = defineProps({
		slides: {
			type: Array,
			required: true,
		},
	});

	const slider = ref(null);

	onMounted(() => {
		new Swiper(slider.value, {
			modules: [Mousewheel],
			direction: 'vertical',
			slidesPerView: 1,
			mousewheel: true,
			resistanceRatio: 0,
		});
	});
</script>

<template>
	<div class="slider swiper" ref="slider">
		<div class="slider__wrapper swiper-wrapper">
			<div class="slider__slide swiper-slide" v-for="slide in slides" :key="slide.id">
				<p v-if="slide.id === 0" class="celebrities__text">
					<span>
						The right star can make a client’s brand shine even brighter. Over the past 30+ years, we’re
						proud to have partnered with these notable celebrities on behalf of our clients.
					</span>
				</p>
				<CelebritiesSliderCard :slide="slide" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.slider {
		max-height: calc((100svh - var(--header-height)) * 0.96);
		overflow: visible;

		&__wrapper {
		}

		&__slide {
			width: 100%;
			aspect-ratio: 375 / 500;

			display: flex;
			flex-direction: column;
		}
	}

	.celebrities {
		&__text {
			position: relative;
			z-index: 1;
			color: color('white', 0.4);
			font-size: rem(12);
			line-height: 134%;
			letter-spacing: -0.12px;

			span {
				position: relative;
				z-index: 2;
			}

			&:not(:last-child) {
				@include adaptiveValue('margin-bottom', 24, 16, 0, 1440, 375);
			}

			@media (max-width: $mobile-mid) {
				padding: 0 rem(16);
			}

			&::after {
				content: '';
				position: absolute;
				z-index: 1;
				left: 0;
				top: calc(100% - rem(28));
				width: 100%;
				height: rem(120);
				border-radius: 0px 0px 3.601px 3.601px;
				background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8));
				transform: scaleX(1.2);
				filter: blur(24px);
			}
		}
	}
</style>
