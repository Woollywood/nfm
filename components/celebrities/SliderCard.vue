<template>
	<div class="slider-card">
		<div class="slider-card__background ibg" :data-animation-card="slide.id">
			<CustomImg :src="slide.photo" />
		</div>
		<div class="cels-slider__aspect-fix-wrapper">
			<div class="cels-slider__aspect-fix-top"></div>
			<div class="cels-slider__aspect-fix-image"></div>
			<div class="cels-slider__aspect-fix-text"></div>
		</div>
		<div class="slider-card__text-wrapper">
			<div class="slider-card__username">
				<div class="slider-card__username-text">{{ slide.nickname }}</div>
				<div class="slider-card__username-icon">
					<SvgIcon class="celebrities__icon" name="cel-star" />
				</div>
			</div>
			<div class="slider-card__description" v-html="slide.description"></div>
			<div class="slider-card__tags">
				<div class="slider-card__tag" v-for="tag in slide.tags" :key="tag.id">
					<div class="cursor-pointer">{{ tag.name }}</div>
				</div>
			</div>
		</div>
		<div class="slider-card__shadow-effect"></div>
	</div>
</template>

<script>
	export default {
		props: {
			slide: {
				type: Object,
				required: true,
			},
		},
	};
</script>

<style lang="scss" scoped>
	.cels-slider {
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
				font-size: rem(13);
				line-height: 124%;
				letter-spacing: rem(0.13);
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
	}

	.slider-card {
		--padding: 24px;

		@media (min-width: $mobile) {
			@media (max-width: $tablet) {
				--padding: 12px;
			}
		}

		position: relative;
		width: auto;
		height: auto;
		@include adaptiveValue('border-radius', 32, 20, 0, 1440, 375);
		overflow: hidden;
		display: flex;
		align-items: flex-end;

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
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: auto;
			z-index: 1;
			opacity: 0;
			visibility: hidden;
			transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
			transform: translateY(20%);
			box-sizing: border-box;

			@media (max-width: $mobile) {
				opacity: 1;
				visibility: visible;
				transform: translateY(0);
			}

			.detailAnimationEnd & {
				transform: translateY(0);
				opacity: 1;
				visibility: visible;
			}

			@include adaptiveValue('padding', 40, 16, 0, 1440, 375);
		}

		&__username {
			display: flex;
			align-items: center;
			@include adaptiveValue('gap', 8, 4, 0, 1440, 375);

			&:not(:last-child) {
				@include adaptiveValue('margin-bottom', 10, 5, 0, 1440, 375);
			}
		}

		&__username-text {
			font-size: rem(28);
			font-weight: 500;
			line-height: 120%;
			letter-spacing: rem(0.28);

			@media (max-width: $tablet-xl) {
				font-size: rem(18);
			}

			@media (max-width: $mobile) {
				font-size: rem(16);
				letter-spacing: rem(0.16);
			}
		}

		&__username-icon {
			display: flex;
			transform: translateY(-10%);

			svg {
				width: rem(28);
				aspect-ratio: 1;

				@media (max-width: $tablet-xl) {
					width: rem(20);
				}

				@media (max-width: $mobile) {
					width: rem(18);
				}
			}
		}

		&__description {
			font-size: rem(24);
			line-height: 116%;
			max-width: rem(580);

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
				line-height: 134%;
			}

			@media (max-width: $mobile) {
				font-size: rem(14);
			}

			&:not(:last-child) {
				margin-bottom: rem(20);

				@media (max-width: $tablet-xl) {
					margin-bottom: rem(16);
				}

				@media (max-width: $mobile) {
					margin-bottom: rem(4);
				}
			}
		}

		&__tags {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			@include adaptiveValue('column-gap', 8, 4, 0, 1440, 375);
			max-width: rem(548);
		}

		&__tag {
			font-size: rem(24);
			font-weight: 500;
			line-height: 116%;
			letter-spacing: rem(0.24);

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
				line-height: 134%;
			}

			@media (max-width: $mobile) {
				font-size: rem(14);
				letter-spacing: rem(0.14);
			}

			&:hover {
				text-decoration: underline;
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
