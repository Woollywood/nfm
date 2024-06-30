<template>
	<Offcanvas
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@close="RouterBack(animationStore)"
		@loaded="loaded"
		:style="{ overflow: hasNestedRoutes() ? 'hidden' : 'auto' }"
		ref="canvasRef">
		<template #default="{ layoutConfigData }">
			<div class="layer-content fade-up fade-up--layout">
				<div class="merch container container--merch">
					<div class="merch__banner">
						<div class="merch__image ibg">
							<CustomImg class="merch__img--desktop" :src="banner.desktop" />
							<CustomImg class="merch__img--mobile" :src="banner.mobile" />
						</div>
					</div>
					<div class="merch__grid">
						<div
							class="merch-item"
							v-for="item in items"
							:key="item.id"
							@click="clickLink(item.id)"
							ref="gridItems"
							:data-detail-card-from="item.id">
							<NuxtLink class="merch-item__image-wrapper" :to="`/merch/gallery/${item.slug}`">
								<div class="merch-item__image ibg">
									<CustomImg :src="item.image" />
								</div>
							</NuxtLink>
							<h2 class="merch-item__title">
								{{ item.name }}
							</h2>
						</div>
					</div>
				</div>
			</div>
			<CustomArrowNavigate
				v-if="layoutConfigData.arrowNavName"
				class="layer-arrow-navigate"
				:name="layoutConfigData.arrowNavName" />
		</template>
		<template #nested>
			<slot />
		</template>
	</Offcanvas>
</template>

<script>
	import { ref } from 'vue';
	import { TRANSPARENT_BACKGROUND_INDEX } from '@/utils/config';
	import { Service } from '@/api/service';

	import { RouterBack, fromHomeAnimation } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { BASE_URL } from '@/constants/api';

	export default {
		async setup() {
			const service = new Service();

			const headerConfig = ref(defineHeaderConfig());
			const animationStore = useAnimationStore();
			const layoutConfig = ref(defineLayoutConfig());
			const { isMobile } = useDevice();

			headerConfig.value.filter = !hasNestedRoutes();

			const { data: banner } = await useFetch('api/v1/about/banner/merch-banner', {
				baseURL: BASE_URL,
			});
			const items = await service.getDataFromUrl('merch');

			return { banner, items, headerConfig, layoutConfig, isMobile, animationStore, RouterBack };
		},
		methods: {
			loaded() {
				const { canvasRef } = this.$refs;

				setTimeout(() => {
					const canvas = canvasRef.$el;
					this.animationStore.setPageLayout(canvas);

					fromHomeAnimation(this.animationStore, null);
				}, 0);
			},

			clickLink(index) {
				const { gridItems } = this.$refs;
				this.animationStore.setPageCard(gridItems[index]);
			},
		},
		watch: {
			$route(to, from) {
				if (hasNestedRoutes()) {
					this.headerConfig.backgroundStyles =
						defineHeaderConfig(TRANSPARENT_BACKGROUND_INDEX).backgroundStyles;
				} else {
					this.headerConfig.backgroundStyles = defineHeaderConfig().backgroundStyles;
				}
			},
		},
		mounted() {
			window.addEventListener(
				'fromDetail',
				() => {
					this.headerConfig.backgroundStyles = defineHeaderConfig().backgroundStyles;
				},
				{ once: true }
			);
		},
	};
</script>

<style lang="scss" scoped>
	.merch {
		&__banner {
			position: relative;
			width: 100%;
			aspect-ratio: 1280 / 378;

			opacity: 0;
			visibility: hidden;
			transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;

			@media (max-width: $mobile) {
				aspect-ratio: 343 / 176;
			}

			.layoutAnimationEnd & {
				opacity: 1;
				visibility: visible;
				transform: translateX(0);
			}

			&:not(:last-child) {
				@include adaptiveValue('margin-bottom', 24, 16, 0, 1440, 375);
			}
		}

		&__image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		&__img {
			&--desktop {
				@media (max-width: $mobile) {
					display: none;
				}
			}

			&--mobile {
				@media (min-width: $mobile) {
					display: none;
				}
			}
		}

		&__grid {
			opacity: 0;
			visibility: hidden;
			transform: translateY(20%);
			transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;

			.layoutAnimationEnd & {
				opacity: 1;
				visibility: visible;
				transform: translateY(0);
			}

			display: grid;
			grid-template-columns: repeat(4, 1fr);

			column-gap: rem(16);
			row-gap: rem(12);
			row-gap: rem(44);

			column-gap: rem(24);
			row-gap: rem(44);

			@media (max-width: $tablet-xl) {
				row-gap: rem(18);
			}

			@media (max-width: $tablet) {
				grid-template-columns: repeat(3, 1fr);
				column-gap: rem(16);
				row-gap: rem(18);
			}

			@media (max-width: $mobile) {
				grid-template-columns: 1fr 1fr;
				row-gap: rem(8);
			}
		}
	}

	.merch-item {
		&:hover {
			.merch-item__image {
				img {
					transform: scale(1.06);
				}
			}

			.merch-item__title {
				color: color('yellow-2');
			}
		}

		&__image-wrapper {
			display: block;
			position: relative;
			width: 100%;
			aspect-ratio: 1;

			&:not(:last-child) {
				margin-bottom: rem(16);

				@media (max-width: $tablet-xl) {
					margin-bottom: rem(18);
				}

				@media (max-width: $mobile) {
					margin-bottom: rem(8);
				}
			}
		}

		&__image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			img {
				transition: transform 0.3s ease;
			}

			@include adaptiveValue('border-radius', 24, 12, 0, 1440, 385);
			overflow: hidden;
			-webkit-mask-image: -webkit-radial-gradient(white, black);
		}

		&__title {
			font-size: rem(16);
			font-weight: 500;
			line-height: 125%;
			letter-spacing: rem(0.16);
			transition: color 0.3s ease;

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
				letter-spacing: rem(0.15);
			}

			@media (max-width: $mobile) {
				font-size: rem(13);
				letter-spacing: rem(0.13);
			}
		}
	}
</style>
