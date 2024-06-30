<script setup>
import { RouterBack } from '@/animations/layouts';
import { useAnimationStore } from '@/store/home.store';
const animationStore = useAnimationStore();
</script>

<template>
	<div class="merch-error container">
		<div class="merch-error__image-wrapper" ref="card">
			<div class="merch-error__image ibg">
				<CustomImg :src="imgPath" />
			</div>
		</div>
		<div class="merch-error__text-wrapper">
			<h1 class="merch-error__title">Error</h1>
			<p class="merch-error__text">
				Sorry! There seems to be a problem with your order. Perhaps you should check your selection, and ask
				yourself, “Is this for real?”
			</p>
			<NuxtLink to="/merch" class="merch-error__link">
				<CustomButton class="merch-error__button" @click="RouterBack(animationStore, '/merch')">
					Back to Store
				</CustomButton>
			</NuxtLink>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		imgPath: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.merch-error {
	@media (min-width: $mobile) {
		display: grid;
		align-items: center;
		grid-template-columns: 48% 1fr;
	}

	@include adaptiveValue('column-gap', 64, 24, 0, 1440, 768);
	@include adaptiveValue('row-gap', 24, 16, 0, 768, 375);

	@media (max-width: $mobile) {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	&__image-wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		@include adaptiveValue('border-radius', 24, 12, 0, 1440, 375);
		overflow: hidden;

		.wiggle-animation & {
			animation: wiggle 2s linear;
		}

		@media (max-width: $mobile) and (min-width: $mobileSmall) {
			width: 70%;
			margin: 0 auto;
		}
	}

	&__image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	&__text-wrapper {
		@media (max-width: $mobile-mid) {
			display: flex;
			flex-direction: column;
		}
	}

	&__title {
		font-family: MuseoSlab, sans-serif;
		@include adaptiveValue('font-size', 64, 48, 0, 1440, 375);
		@include adaptiveValue('letter-spacing', 0.64, 0.48, 0, 1440, 375);
		text-transform: uppercase;

		background: linear-gradient(121deg, #f4e832 24.78%, #f28f1d 77.83%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;

		@media (max-width: $mobile) {
			text-align: center;
		}
	}

	&__text {
		color: color('white', 0.4);
		@include adaptiveValue('font-size', 20, 13, 0, 1440, 375);
		line-height: 120%;
		@include adaptiveValue('letter-spacing', 0.2, 0.13, 0, 1440, 375);

		&:not(:last-child) {
			@include adaptiveValue('margin-bottom', 26, 20, 0, 1440, 375);
		}

		@media (max-width: $mobile) {
			text-align: center;
		}
	}

	&__link {
		@media (max-width: $mobile) {
			display: flex;
			justify-content: center;
		}
	}

	&__button {
		@media (max-width: $mobileSmall) {
			width: 100%;
		}
	}
}

@keyframes wiggle {
	0%,
	7% {
		transform: rotateZ(0);
	}
	15% {
		transform: rotateZ(-15deg);
	}
	20% {
		transform: rotateZ(10deg);
	}
	25% {
		transform: rotateZ(-10deg);
	}
	30% {
		transform: rotateZ(6deg);
	}
	35% {
		transform: rotateZ(-4deg);
	}
	40%,
	100% {
		transform: rotateZ(0);
	}
}
</style>
