<script setup>
	import { useElementSize } from '@vueuse/core';

	const props = defineProps({
		data: {
			type: Array,
			required: true,
		},
	});

	const emits = defineEmits(['clickCard']);

	const wrapper = ref();
	const { width: WrapperWidth } = useElementSize(wrapper);

	const route = useRoute();
	const router = useRouter();
	const slug = ref(route.params.slug);
	const currentCard = computed(() => props.data.find((card) => card.slug === slug.value));
	const id = computed(() => currentCard.value.id);

	function slideChange(slugParam) {
		slug.value = slugParam;
	}

	function wrapperRatio() {
		wrapper.value.style.width = '';
		wrapper.value.style.height = '';

		if (window.innerWidth < TABLET) {
			return;
		}

		const windowHeight = window.innerHeight;

		if (((windowHeight - WrapperWidth.value) / windowHeight) * 100 < 30) {
			wrapper.value.style.height = '70vh';
			wrapper.value.style.width = `70vh`;
		} else {
			wrapper.value.style.height = `${WrapperWidth.value}px`;
		}
	}

	onMounted(() => {
		wrapperRatio();
		window.addEventListener('resize', wrapperRatio);
	});

	onUnmounted(() => {
		window.removeEventListener('resize', wrapperRatio);
	});
</script>

<template>
	<div class="merch-card">
		<div class="merch-card__image-wrapper" ref="wrapper">
			<MerchSlider :slides="data" :id="id" :slug="slug" @slideChange="slideChange" />
		</div>
		<div class="merch-card__text-wrapper">
			<h1 class="merch-card__title">{{ currentCard.name }}</h1>
			<div class="merch-card__text" v-html="currentCard.description"></div>
			<CustomButton class="merch-card__button" @click="$emit('clickCard')">Add to cart</CustomButton>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.merch-card {
		max-width: rem(1440);
		padding: 0 rem(16);
		margin: 0 auto;
		width: 100%;

		@media (min-width: $tablet) {
			padding: 0 calc((rem($containerPadding) + rem(148)) / 2);
		}

		column-gap: rem(148);
		display: grid;
		@media (min-width: $tablet) {
			grid-template-columns: repeat(2, 1fr);
			align-items: center;
			justify-content: center;
			justify-items: flex-end;
		}

		@include adaptiveValue('row-gap', 24, 16, 0, 768, 375);

		@media (max-width: $tablet-l) {
			column-gap: rem(68);
		}

		@media (max-width: $tablet) {
			grid-row: 1fr 30%;
			justify-content: center;
			align-items: center;
			column-gap: rem(24);
			padding-top: var(--header-height);
			padding-bottom: 10svh;
		}

		&__image-wrapper {
			position: relative;
			box-sizing: border-box;
			flex-grow: 0;
			min-width: 0;
			width: 100%;

			@media (max-width: $tablet) {
				max-height: 56vh;
				max-width: max(calc(100vw - rem(32)), 30vh);
				width: 100%;
				aspect-ratio: 1;
				height: auto;
				margin: 0 auto;
				align-self: flex-end;
			}

			@media (max-width: $mobile) {
				width: 100%;
			}
		}

		&__text-wrapper {
			@media (min-width: $tablet) {
				justify-self: left;
			}

			@media (max-width: $tablet) {
				display: flex;
				flex-direction: column;
			}

			opacity: 0;
			visibility: hidden;
			transform: translateY(20%);
			transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;

			.detailAnimationEnd & {
				opacity: 1;
				visibility: visible;
				transform: translateY(0);
			}

			.fromDetailAnimationStart & {
				opacity: 1;
				visibility: visible;
				transform: translateY(0);
			}

			.fromDetailAnimationEnd & {
				opacity: 0;
				visibility: hidden;
				transform: translateY(20%);
			}
		}

		&__title {
			@include adaptiveValue('font-size', 32, 16, 0, 1440, 375);
			font-weight: 500;
			line-height: 100%;
			@include adaptiveValue('letter-spacing', 0.32, 0.16, 0, 1440, 375);

			@media (max-width: $tablet) {
				text-align: center;
			}

			@media (max-width: $mobile) {
				line-height: 125%;
				text-align: left;
			}

			&:not(:last-child) {
				margin-bottom: rem(4);
			}
		}

		&__text {
			&:not(:last-child) {
				@include adaptiveValue('margin-bottom', 26, 20, 0, 1440, 375);
			}

			p {
				color: color('white', 0.4);
				@include adaptiveValue('font-size', 20, 13, 0, 1440, 375);
				line-height: 120%;
				@include adaptiveValue('letter-spacing', 0.2, 0.16, 0, 1440, 375);

				@media (max-width: $tablet) {
					text-align: center;
				}

				@media (max-width: $mobile) {
					line-height: 125%;
					text-align: left;
				}
			}
		}

		&__button {
			@media (max-width: $tablet) and (min-width: $mobileSmall) {
				margin: 0 auto;
			}
		}
	}
</style>
