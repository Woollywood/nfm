<template>
	<Offcanvas
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@close="RouterBack(animationStore)"
		@loaded="loaded"
		ref="canvasRef">
		<template #default="{ layoutConfigData }">
			<div class="layer-content">
				<div class="content container">
					<div class="content__grid fade-up fade-up--layout">
						<div class="content__item" v-for="video in grid" :key="video.id">
							<NuxtLink
								class="content__item-video video-item"
								:to="`/videos/gallery/${video.slug}`"
								@click="clickVideo"
								data-video-item>
								<div class="video-item__video ibg">
									<CustomImg :src="video.poster" />
								</div>
								<div class="video-item__controlls">
									<div class="video-item__time">
										<SvgIcon class="video-item__time-icon" name="video-time" />
										<div class="video-item__time-value">
											<span>{{ video.duration }}</span>
										</div>
									</div>
								</div>
							</NuxtLink>
							<div class="content__item-title">{{ video.name }}</div>
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
	import { gsap } from 'gsap';
	import { ref } from 'vue';
	import { PURPLE_BACKGROUND_INDEX, TRANSPARENT_BACKGROUND_INDEX } from '@/utils/config';

	import { RouterBack, fromHomeAnimation } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { Service } from '@/api/service';

	export default {
		async setup() {
			const service = new Service();
			const headerConfig = ref(defineHeaderConfig(PURPLE_BACKGROUND_INDEX));
			const animationStore = useAnimationStore();
			const layoutConfig = ref(defineLayoutConfig(PURPLE_BACKGROUND_INDEX));

			headerConfig.value.filter = !hasNestedRoutes();

			const grid = await service.getDataFromUrl('videos');

			return {
				grid,
				headerConfig,
				layoutConfig,
				animationStore,
				RouterBack,
				fromHomeAnimation,
			};
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

			clickVideo(event) {
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
					this.headerConfig.backgroundStyles = defineHeaderConfig(PURPLE_BACKGROUND_INDEX).backgroundStyles;
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
	.content {
		padding-top: rem(40);

		@media (max-width: $tablet-xl) {
			padding-top: 0;
		}

		&__grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			column-gap: rem(16);
			row-gap: rem(21);

			@media (min-width: $tablet) {
				column-gap: rem(24);
				row-gap: rem(22);
			}

			@media (max-width: $tablet-xl) {
				row-gap: rem(20);
			}

			@media (max-width: $mobileSmall) {
				grid-template-columns: 1fr;
				row-gap: rem(12);
			}

			&:not(:last-child) {
				@include adaptiveValue('margin-bottom', 110, 96, 0, 1440, 375);
			}
		}

		&__item {
		}

		&__item-video {
			&:not(:last-child) {
				margin-bottom: rem(18);

				@media (max-width: $mobile) {
					margin-bottom: rem(12);
				}
			}
		}

		&__item-title {
			font-size: rem(16);
			font-weight: 500;
			line-height: 100%;
			letter-spacing: rem(0.16);

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
				letter-spacing: rem(0.15);
			}

			@media (max-width: $mobile) {
				font-size: rem(13);
				letter-spacing: rem(0.13);
			}
		}

		&__actions {
			display: flex;
			justify-content: center;
		}

		&__arrow-top {
			svg {
				@include adaptiveValue('width', 96, 36, 0, 1440, 375);
				aspect-ratio: 1;
			}
		}
	}

	.video-item {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		@include adaptiveValue('border-radius', 24, 12, 0, 1440, 375);
		overflow: hidden;

		display: flex;
		align-items: flex-end;

		&__video {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			-webkit-mask-image: -webkit-radial-gradient(white, black);
			transition: transform 0.3s ease-in-out;

			&:hover {
				transform: scale(1.06);
			}
		}

		&__controlls {
			position: relative;
			z-index: 1;
			padding: rem(18);

			@media (max-width: $mobile) {
				padding: rem(12);
			}
		}

		&__time {
			display: flex;
			align-items: center;
			gap: rem(8);
		}

		&__time-icon {
			width: rem(16);
			aspect-ratio: 1;
			fill: color('white', 0.4);
		}

		&__time-value {
			color: color('white', 0.4);
			@include adaptiveValue('font-size', 16, 12, 0, 1440, 375);
			line-height: 100%;
		}
	}
</style>
