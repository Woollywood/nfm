<template>
	<div class="cases fade-up fade-up--layout">
		<div class="foreground-slider js-cases-slider">
			<div class="foreground-slider__slider-wrapper">
				<div
					v-for="(slider, index) in sliders"
					:key="slider.id"
					class="foreground-slider__slide"
					data-foreground-slide>
					<div
						class="foreground-slider__body"
						:class="{ slideFirst: index === 0, slideLast: index === sliders.length - 1 }">
						<CasesSliderHorizontal
							:slideIndex="index"
							:slider="slider"
							@mounted="sliderMounted"
							@modalOpen="$emit('modalOpen', $event)"
							@sliderInit="$emit('sliderInit')" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				swipers: [],
				sliderIndex: 0,
			};
		},
		props: {
			sliders: {
				type: Array,
				required: true,
			},
		},
		emits: {
			sliderInit: null,
		},
		methods: {
			sliderInit() {
				this.$emit('sliderInit');
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
			setTimeout(() => {
				const scrollWrapper = document.querySelector('[data-scroll-wrapper]');
				scrollWrapper.style.overflow = 'hidden';
				let counter = -1;
				const timerId = setInterval(() => {
					counter++;
					scrollWrapper.scrollTop = 0;

					if (counter >= 60) {
						clearInterval(timerId);
						scrollWrapper.style.overflow = '';
					}
				}, 10);
			}, 0);
		},
	};
</script>

<style lang="scss" scoped>
	.cases {
		@media (max-width: $mobile) {
			padding-top: rem(16);
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

	.foreground-slider {
		position: relative;
		z-index: 1;
		max-width: 100%;

		@media (min-width: $mobile) {
			@include adaptiveValue('padding-top', 32, 16, 0, 1440, 1200);
			@include adaptiveValue('padding-bottom', 32, 20, 0, 1440, 1200);
			@include adaptiveValue('padding-right', 128, 16, 0, 1440, 375);
		}

		@media (max-width: $mobile) {
			padding: 0 rem(16) rem(24);
		}

		&.mobile {
			@media (min-width: $mobile) {
				@include adaptiveValue('padding-top', 120, 56, 0, 1440, 375);
			}
		}

		&__slider-wrapper {
		}

		&__slide {
			@media (max-width: $mobile) {
				box-sizing: border-box;

				&:not(:last-child) {
					padding: 0 rem(16);
					margin: 0 rem(-16);

					padding-bottom: rem(20);
					margin-bottom: rem(20);
					border-bottom: rem(1) solid color('white', 0.16);
				}
			}
		}

		&__body {
			box-sizing: border-box;
			position: relative;
			width: 100%;
			height: 100%;

			@media (min-width: $mobile) {
				padding-left: 60%;

				@media (max-width: $tablet-l) {
					padding-left: 50%;
				}

				@media (max-width: $tablet-l) {
					padding-left: 40%;
				}
			}
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
</style>
