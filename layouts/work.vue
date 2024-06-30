<template>
	<Offcanvas
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@close="RouterBack(animationStore)"
		@loaded="loaded"
		:style="{ overflow: hasNestedRoutes() ? 'hidden' : 'auto' }"
		ref="canvasRef">
		<template #default="{ layoutConfigData }">
			<div class="layer-content">
				<div class="work container">
					<div class="work__grid grid fade-up fade-up--layout">
						<div class="work-item" v-for="item in grid" :key="item.id">
							<NuxtLink
								class="work-item__image-wrapper"
								data-link-wrapper
								@click="clickLink"
								:to="`/work/gallery/${item.slug}`">
								<div class="work-item__image ibg">
									<CustomImg :src="item.image" />
								</div>
							</NuxtLink>
							<div class="work-item__icon-wrapper" v-if="!isMobile">
								<div class="work-item__icon ibg">
									<CustomImg :src="item.logo" />
								</div>
							</div>
							<div class="work-item__content-top" v-else>
								<div class="work-item__icon-wrapper">
									<div class="work-item__icon ibg">
										<CustomImg :src="item.logo" />
									</div>
								</div>
								<div class="work-item__inner-info-wrapper">
									<div class="work-item__inner-info-item" v-if="item.photosLength">
										{{ item.photosLength }}
										<span v-if="item.photosLength === 1">photo</span>
										<span v-else>photos</span>
									</div>
									<div class="work-item__inner-info-item" v-if="item.videosLength">
										{{ item.videosLength }}
										<span v-if="item.videosLength === 1">video</span>
										<span v-else>videos</span>
									</div>
								</div>
							</div>
							<div class="work-item__text-wrapper">
								<h1 class="work-item__title">{{ item.name }}</h1>
								<div class="work-item__description" v-html="item.description"></div>
							</div>
							<div class="work-item__inner-info-wrapper" v-if="!isMobile">
								<div class="work-item__inner-info-item" v-if="item.photosLength">
									{{ item.photosLength }}
									<span v-if="item.photosLength === 1">photo</span>
									<span v-else>photos</span>
								</div>
								<div class="work-item__inner-info-item" v-if="item.videosLength">
									{{ item.videosLength }}
									<span v-if="item.videosLength === 1">video</span>
									<span v-else>videos</span>
								</div>
							</div>
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
	import { BLUE_BACKGROUND_INDEX } from '@/utils/config';
	import { TRANSPARENT_BACKGROUND_INDEX } from '@/utils/config';

	import { RouterBack, fromHomeAnimation } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { Service } from '@/api/service';

	export default {
		async setup() {
			const service = new Service();
			const headerConfig = ref(defineHeaderConfig(BLUE_BACKGROUND_INDEX));
			const animationStore = useAnimationStore();
			const layoutConfig = ref(defineLayoutConfig(BLUE_BACKGROUND_INDEX));
			const { isMobile } = useDevice();

			headerConfig.value.filter = !hasNestedRoutes();

			const dataResponse = await service.getDataFromUrl('works');
			const grid = computed(() =>
				dataResponse.map((item) => ({
					...item,
					photosLength: item.photo_slides.reduce(
						(acc, current) => (current.image ? (acc = acc + 1) : acc),
						0
					),
					videosLength: item.photo_slides.reduce(
						(acc, current) => (current.video ? (acc = acc + 1) : acc),
						0
					),
				}))
			);

			return { grid, headerConfig, layoutConfig, isMobile, animationStore, RouterBack };
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

			clickLink(event) {
				const card = event.target.closest('[data-link-wrapper]');
				this.animationStore.setPageCard(card);
			},
		},
		watch: {
			$route(to, from) {
				if (hasNestedRoutes()) {
					this.headerConfig.backgroundStyles =
						defineHeaderConfig(TRANSPARENT_BACKGROUND_INDEX).backgroundStyles;
				} else {
					this.headerConfig.backgroundStyles = defineHeaderConfig(BLUE_BACKGROUND_INDEX).backgroundStyles;
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
	.work {
		padding-top: rem(40);

		@media (max-width: $tablet-xl) {
			padding-top: rem(0);
		}

		&__grid {
		}
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		@include adaptiveValue('column-gap', 64, 24, 0, 1920, 1440);
		@include adaptiveValue('row-gap', 16, 12, 0, 1440, 375);

		@media (max-width: $mobile) {
			column-gap: rem(16);
		}

		@media (max-width: $mobile-mid) {
			grid-template-columns: 1fr;
		}
	}
	.work-item {
		&__image-wrapper {
			display: block;
			position: relative;
			aspect-ratio: 608 / 374;

			&:not(:last-child) {
				margin-bottom: rem(-16);

				@media (max-width: $tablet-xl) {
					margin-bottom: rem(-12);
				}

				@media (max-width: $tablet) {
					margin-bottom: rem(-8);
				}
			}
		}

		&__image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		&__icon-wrapper {
			position: relative;
			width: rem(32);
			aspect-ratio: 1;
			border-radius: 50%;
			overflow: hidden;

			@media (min-width: $mobile) {
				&:not(:last-child) {
					@include adaptiveValue('margin-bottom', 8, 12, 0, 1440, 375);
				}
			}
		}

		&__content-top {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;

			&:not(:last-child) {
				@include adaptiveValue('margin-bottom', 8, 12, 0, 1440, 375);
			}
		}

		&__icon {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		&__text-wrapper {
			&:not(:last-child) {
				margin-bottom: rem(8);

				@media (max-width: $tablet-xl) {
					margin-bottom: rem(5.12);
				}
			}
		}

		&__title {
			font-size: rem(16);
			font-weight: 700;
			line-height: 134%;

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
			}

			@media (max-width: $mobile) {
				font-size: rem(13);
				line-height: 124%;
				font-weight: 500;
				letter-spacing: rem(0.13);
			}

			@media (max-width: $mobile-mid) {
				font-weight: 500;
			}

			&:not(:last-child) {
				margin-bottom: rem(4);

				@media (max-width: $tablet-xl) {
					margin-bottom: rem(1.6);
				}

				@media (max-width: $mobile) {
					margin-bottom: rem(0);
				}
			}
		}

		&__description {
			font-size: rem(16);
			line-height: 125%;

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
				line-height: 100%;
			}

			@media (max-width: $mobile) {
				font-size: rem(13);
				line-height: 124%;
				letter-spacing: 0.13px;
			}
		}

		&__inner-info-wrapper {
			display: flex;
			align-items: center;
			gap: rem(8);
		}

		&__inner-info-item {
			color: color('white', 0.4);
			font-size: rem(12);
		}
	}
</style>
