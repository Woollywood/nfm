<template>
	<div class="celebrities-body" id="celebrities-body">
		<Offcanvas
			class="canvas-desktop"
			:headerConfigProp="headerConfig"
			@close="modalClose"
			@loaded="loadedDesktop"
			:class="{ closing: isClose }"
			ref="canvasRefDesktop">
			<template #default="{ layoutConfigData }">
				<div class="layer-content">
					<div class="celebrities container">
						<p class="celebrities__text">
							The right star can make a client’s brand shine even brighter. Over the past 30+ years, we’re
							proud to have partnered with these notable celebrities on behalf of our clients.
						</p>
						<div class="celebrities__grid fade-up fade-up--layout" ref="grid">
							<button
								class="celebrities__item"
								v-for="item in items"
								:key="item.id"
								ref="gridItems"
								:data-grid-item="item.id"
								:data-detail-card-from="item.id"
								@click="modalOpen(item.id - 1)">
								<div class="celebrities__image ibg">
									<CustomImg :src="item.photo" />
								</div>
								<div class="celebrities__footer">
									<SvgIcon class="celebrities__icon" name="cel-star" />
								</div>
							</button>
						</div>
					</div>

					<Teleport v-if="isModalOpen" to="#celebrities-body">
						<Offcanvas
							@close="modalClose"
							class="nested-canvas"
							:headerConfigProp="headerConfigModal"
							:layoutConfigProp="layoutConfig"
							ref="canvasNestedRef">
							<CelebritiesSlider v-model:slideIndex="slideIndex" :slides="items" @init="init" />
						</Offcanvas>
					</Teleport>
				</div>
				<CustomArrowNavigate
					v-if="layoutConfigData.arrowNavName"
					class="layer-arrow-navigate"
					:name="layoutConfigData.arrowNavName" />
			</template>
		</Offcanvas>

		<Offcanvas
			class="canvas-mobile"
			@close="modalClose"
			:headerConfigProp="headerConfigModal"
			:layoutConfigProp="layoutConfig"
			@loaded="loadedMobile"
			ref="canvasRefMobile">
			<template #default="{ layoutConfigData }">
				<div class="layer-content fade-up fade-up--layout">
					<div class="mobile">
						<CelebritiesSliderMobile :slides="items" />
					</div>
				</div>
				<CustomArrowNavigate
					v-if="layoutConfigData.arrowNavName"
					class="layer-arrow-navigate"
					:name="layoutConfigData.arrowNavName"
			/></template>
		</Offcanvas>
	</div>
</template>

<script>
	import { ref } from 'vue';

	import { RouterBack, fromHomeAnimation, toDetailPage, fromDetailPage } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { Service } from '@/api/service';

	export default {
		data() {
			return { slideIndex: 0, isModalOpen: false, openIndex: null, isClose: false, gridItemIndex: 0 };
		},
		async setup() {
			const service = new Service();
			const animationStore = useAnimationStore();
			const headerConfig = ref(defineHeaderConfig());
			const headerConfigModal = ref(defineHeaderConfig());
			const layoutConfig = ref(defineLayoutConfig());
			const { isMobile } = useDevice();

			layoutConfig.value.footer = false;
			headerConfig.value.filter = true;
			delete headerConfigModal.value.backgroundPath;

			if (isMobile) {
				headerConfigModal.value.absolute = false;
				headerConfigModal.value.modalCelebritiesMobile = true;
			} else {
				headerConfigModal.value.absolute = true;
			}

			const items = await service.getDataFromUrl('celebrities');

			return {
				items,
				headerConfig,
				headerConfigModal,
				layoutConfig,
				isMobile,
				animationStore,
				RouterBack,
				fromHomeAnimation,
				toDetailPage,
				fromDetailPage,
			};
		},
		methods: {
			modalOpen(index) {
				const { gridItems } = this.$refs;
				this.slideIndex = index;
				this.gridItemIndex = +gridItems[index].dataset.gridItem;

				this.isModalOpen = true;
				this.animationStore.setPageCard(gridItems[index]);
			},

			init() {
				const { canvasNestedRef } = this.$refs;

				setTimeout(() => {
					const canvas = canvasNestedRef.$el;
					this.animationStore.setDetailPageLayout(canvas);
					toDetailPage(this.animationStore);
				}, 0);
			},

			loadedDesktop() {
				const { canvasRefDesktop } = this.$refs;

				setTimeout(() => {
					if (!this.isMobile) {
						const canvasDesktop = canvasRefDesktop.$el;
						this.animationStore.setPageLayout(canvasDesktop);
						fromHomeAnimation(this.animationStore, null);
					}
				}, 0);
			},

			loadedMobile() {
				const { canvasRefMobile } = this.$refs;

				setTimeout(() => {
					if (this.isMobile) {
						const canvasMobile = canvasRefMobile.$el;
						this.animationStore.setPageLayout(canvasMobile);
						fromHomeAnimation(this.animationStore);
					}
				}, 0);
			},

			modalClose() {
				const { canvasRefDesktop, canvasRefMobile } = this.$refs;
				const canvasDesktop = canvasRefDesktop.$el;
				const canvasMobile = canvasRefMobile.$el;

				if (!this.isMobile) {
					if (this.isModalOpen) {
						const gridCard = canvasDesktop.querySelector(`[data-grid-item="${this.slideIndex + 1}"]`);
						const cardBox = gridCard.getBoundingClientRect();
						canvasDesktop.scrollTop = cardBox.top - window.innerHeight / 2 + cardBox.height / 2;

						this.animationStore.setPageCard(gridCard);

						fromDetailPage(this.animationStore, '/celebrities', () => {
							this.animationStore.setDetailAnimationEnd(false);
							this.animationStore.setDetailAnimationStart(false);
							this.isClose = true;
							this.isModalOpen = false;
						});
					} else {
						this.animationStore.setDetailAnimationEnd(false);
						this.animationStore.setDetailAnimationStart(false);
						this.isClose = true;
						this.animationStore.setPageLayout(canvasDesktop);
						RouterBack(this.animationStore);
					}
				} else {
					this.animationStore.setDetailAnimationEnd(false);
					this.animationStore.setDetailAnimationStart(false);
					this.isClose = true;
					this.animationStore.setPageLayout(canvasMobile);
					RouterBack(this.animationStore);
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.canvas-desktop {
		@media (max-width: $mobile) {
			display: none;
		}
	}

	.canvas-mobile {
		@media (min-width: $mobile) {
			display: none;
		}
	}

	.celebrities {
		padding-top: rem(18);

		&__text {
			@media (min-width: $mobile) {
				position: absolute;
				top: calc(var(--header-height) * -1);
				left: 50%;
				transform: translateX(-50%);
				width: 100%;
				height: var(--header-height);
				max-width: 38vw;

				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
			}

			color: color('white', 0.4);
			font-size: rem(12);
			letter-spacing: -0.16px;
			line-height: 125%;

			@media (max-width: $tablet-xl) {
				text-align: center;
			}

			&:not(:last-child) {
				margin-bottom: rem(22);

				@media (max-width: $mobile) {
					margin-bottom: rem(16);
				}
			}
		}

		&__grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: rem(24);

			.closing & {
				opacity: 1;
				visibility: visible;
				transform: translateY(0);
			}

			@media (max-width: $tablet) {
				gap: rem(16);
			}
		}

		&__item {
			position: relative;
			@include adaptiveValue('border-radius', 24, 12, 0, 1440, 375);
			overflow: hidden;
			width: 100%;
			aspect-ratio: 302 / 416;
			-webkit-mask-image: -webkit-radial-gradient(white, black);

			display: flex;
			align-items: flex-end;

			&:hover {
				.celebrities__image {
					transform: scale(1.1);
				}
			}
		}

		&__image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			transition: transform 0.3s ease-in-out;
		}

		&__footer {
			position: relative;
			z-index: 1;
			background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(#000, 0.64) 100%);
			width: 100%;
			height: rem(72);
		}

		&__icon {
			position: absolute;
			left: rem(16);
			bottom: rem(16);
			width: rem(24);

			@media (min-width: $tablet-xl) {
				aspect-ratio: 1;
			}

			@media (max-width: $tablet-xl) {
				width: rem(21);
				height: rem(20);
			}
		}
	}

	.mobile {
		max-height: calc(100svh - var(--header-height));
	}
</style>
