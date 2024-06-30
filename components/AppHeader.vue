<script setup>
	import { useAnimationStore } from '@/store/home.store';
	import { RouterBack } from '@/animations/layouts';

	defineProps({
		headerConfig: {
			type: Object,
			required: true,
		},
	});

	defineEmits(['close']);

	const animationStore = useAnimationStore();
</script>

<template>
	<div class="app-header header-animation" data-app-header>
		<div class="app-header__body header-desktop">
			<div class="left">
				<button class="logo" @click="RouterBack(animationStore, '/')">
					<CustomImg :src="headerConfig.logoPath" />
				</button>
				<div class="title">
					<CustomImg :src="headerConfig.titlePath" />
				</div>
			</div>
			<button class="close" @click="$emit('close')">
				<SvgIcon :name="headerConfig.closeIconName" />
			</button>
		</div>
		<div class="app-header__body header-laptop">
			<div class="left">
				<button class="logo" @click="RouterBack(animationStore, '/')">
					<CustomImg :src="headerConfig.logoPathLaptop" />
				</button>
				<div class="title">
					<CustomImg :src="headerConfig.titlePathLaptop" />
				</div>
			</div>
			<button class="close" @click="$emit('close')">
				<SvgIcon :name="headerConfig.closeIconName" />
			</button>
		</div>
		<div class="app-header__body header-mobile">
			<button class="logo" @click="RouterBack(animationStore, '/')">
				<CustomImg :src="headerConfig.logoPathMobile" :densities="false" />
			</button>
			<div class="title">
				<CustomImg :src="headerConfig.titlePathMobile" :densities="false" />
			</div>
			<div class="close-wrapper">
				<button class="close" @click="$emit('close')">
					<SvgIcon :name="headerConfig.closeIconName" />
				</button>
			</div>
		</div>
		<div
			class="app-header__background"
			:style="`--transparency: ${headerConfig.transparency}`"
			:class="{ modalCelebritiesMobile: headerConfig.modalCelebritiesMobile }">
			<div class="app-header__background-effect" :style="headerConfig.backgroundStyles"></div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.header-desktop {
		@media (max-width: $tablet-xl) {
			display: none !important;
		}
	}

	.header-laptop {
		display: none !important;

		@media (max-width: $tablet-xl) and (min-width: $mobile) {
			display: flex !important;
		}
	}

	.header-mobile {
		@media (min-width: $mobile) {
			display: none !important;
		}
	}

	.app-header {
		position: relative;

		&__body {
			position: relative;
			z-index: 1;

			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: rem(36);

			height: rem(120);
			padding: rem(16) rem(44);

			@media (max-width: $tablet-xl) {
				height: rem(80);
				padding: rem(12) rem(24);
			}

			@media (max-width: $mobile) {
				padding: rem(8) rem(16);
				height: rem(56);
			}

			@media (max-width: $mobile) {
				display: grid;
				grid-template-columns: 1fr auto 1fr;

				@include adaptiveValue('padding-top', 24, 12, 0, 768, 375);
				@include adaptiveValue('padding-bottom', 24, 12, 0, 768, 375);
				@include adaptiveValue('padding-left', 24, 16, 0, 768, 375);
				@include adaptiveValue('padding-right', 16, 8, 0, 768, 375);
			}
		}

		&__background {
			position: absolute;
			z-index: 0;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
			visibility: hidden;
			backdrop-filter: blur(24px);
			overflow: hidden;
			transition: backdrop-filter 0.3s ease-in-out;

			.nested & {
				backdrop-filter: blur(0);
			}

			&.modalCelebritiesMobile {
				opacity: 1;
				visibility: visible;
			}

			.scrolled & {
				opacity: 1;
				visibility: visible;
			}
		}

		&__background-effect {
			position: absolute;
			z-index: 0;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			opacity: var(--transparency);
			transition: all 0.3s ease-in-out;

			img {
				display: none;
			}
		}
	}

	.left {
		display: flex;
		align-items: center;
		gap: rem(24);
	}

	.title {
		display: flex;
		align-items: center;
		gap: rem(24);

		@media (min-width: $mobile) {
			&::before {
				content: '';
				display: block;
				height: rem(24);
				width: rem(1);
				background-color: color('white', 0.32);
			}
		}
	}

	.close-wrapper {
		@media (max-width: $mobile) {
			justify-self: flex-end;
		}
	}

	.close {
		transition: all 0.3s ease;
		transform-origin: center;

		display: flex;
		justify-content: center;
		align-items: center;

		@media (max-width: $tablet-xl) and (min-width: $mobile) {
			transform: scale(0.8);
		}

		&:hover {
			transform: scale(1.4);

			@media (max-width: $tablet-xl) and (min-width: $mobile) {
				transform: scale(1.2);
			}
		}

		svg {
			width: rem(32);
			aspect-ratio: 1;

			@media (max-width: $mobile) {
				transform: scale(0.8);
			}
		}
	}
</style>
