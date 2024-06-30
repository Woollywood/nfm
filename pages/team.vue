<script setup>
	import { ref } from 'vue';
	import { BLUE_BACKGROUND_INDEX } from '@/utils/config';
	import { RouterBack, fromHomeAnimation } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { Service } from '@/api/service';
	const service = new Service();

	const animationStore = useAnimationStore();
	const headerConfig = ref(defineHeaderConfig());
	const layoutConfig = ref(defineLayoutConfig(BLUE_BACKGROUND_INDEX));

	const canvasRef = ref(null);
	const slider = ref(null);

	headerConfig.value.absolute = true;
	layoutConfig.value.footer = false;

	const slides = await service.getDataFromUrl('team/list');

	function loaded() {
		setTimeout(() => {
			const canvas = canvasRef.value.$el;
			animationStore.setPageLayout(canvas);

			fromHomeAnimation(animationStore);
		}, 0);
	}
</script>

<template>
	<Offcanvas
		class="canvas canvas-team"
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@close="RouterBack(animationStore)"
		@loaded="loaded"
		ref="canvasRef">
		<CustomSliderHorizontal :slides="slides" ref="slider" class="slider-team fade-up fade-up--layout">
			<template #sliderCard="{ slide }">
				<div class="slider-card">
					<div class="slider-card__aspect-fix-wrapper">
						<div class="slider-card__aspect-fix-top"></div>
						<div class="slider-card__aspect-fix-image"></div>
						<div class="slider-card__aspect-fix-text"></div>
					</div>
					<div class="slider-card__background ibg">
						<CustomImg :src="slide.photo" />
					</div>
					<div class="slider-card__text-wrapper">
						<div class="slider-card__username">{{ slide.nickname }}</div>
						<div class="slider-card__description" v-html="slide.description"></div>
					</div>
					<div class="slider-card__shadow-effect"></div>
				</div>
			</template>
		</CustomSliderHorizontal>
	</Offcanvas>
</template>

<style lang="scss" scoped>
	.canvas {
		overflow: hidden;
	}

	.slider-card {
		--padding: 24px;

		position: relative;
		width: auto;
		height: auto;
		@include adaptiveValue('border-radius', 32, 20, 0, 1440, 375);
		overflow: hidden;

		@media (max-width: $mobile) {
			height: 100%;
			display: grid;
			align-items: flex-end;
		}

		@media (min-width: $mobile) {
			@media (max-width: $tablet) {
				--padding: 12px;
			}
		}

		opacity: 0;
		visibility: hidden;

		.layoutAnimationEnd & {
			opacity: 1;
			visibility: visible;
		}

		&__aspect-fix-wrapper {
			box-sizing: border-box;
			pointer-events: none;
			opacity: 0;
			visibility: hidden;
			padding: var(--padding);
			width: 100%;
			height: 100%;
			font-size: rem(20);

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
			}

			@media (max-width: $mobile) {
				display: none;
			}
		}

		&__aspect-fix-top {
			@include adaptiveValue('height', 56, 40, 0, 1440, 375);
			@include adaptiveValue('margin-bottom', 24, 16, 0, 1440, 375);
		}

		&__aspect-fix-image {
			width: 100%;
			height: auto;
			aspect-ratio: 1 / 1.1;
		}

		&__aspect-fix-text {
			height: calc(3em * 1.2);
		}

		&__background {
			position: absolute;
			z-index: 0;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			@include adaptiveValue('border-radius', 32, 20, 0, 1440, 375);
			overflow: hidden;
		}

		&__text-wrapper {
			z-index: 1;

			@media (min-width: $mobile) {
				position: absolute;
				bottom: 0;
				left: 0;
			}

			@media (max-width: $mobile) {
				position: relative;
			}

			@include adaptiveValue('padding', 40, 16, 0, 1440, 375);
		}

		&__username {
			font-size: rem(28);
			font-weight: 500;
			line-height: 100%;
			letter-spacing: rem(0.28);

			@media (max-width: $tablet-xl) {
				font-size: rem(18);
			}

			@media (max-width: $mobile) {
				font-size: rem(16);
				letter-spacing: rem(0.16);
			}

			&:not(:last-child) {
				margin-bottom: rem(10);

				@media (max-width: $tablet-xl) {
					margin-bottom: rem(6);
				}

				@media (max-width: $mobile) {
					margin-bottom: rem(5);
				}
			}
		}

		&__description {
			font-size: rem(24);
			line-height: 134%;

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
			}

			@media (max-width: $mobile) {
				font-size: rem(14);
			}
		}

		&__shadow-effect {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 40%;
			opacity: 0.88;
			background: linear-gradient(180deg, rgba(4, 5, 6, 0) 0%, #051125 100%);
		}
	}
</style>
