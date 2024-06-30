<template>
	<Offcanvas
		class="nested-canvas"
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@loaded="loaded"
		ref="canvasRef">
		<div class="gallery">
			<div class="slider-preview swiper" ref="sliderPreview" data-slider-preview>
				<div class="slider-preview__wrapper swiper-wrapper">
					<div
						class="slider-preview__slide swiper-slide"
						v-for="galleryItem in gallery"
						:key="galleryItem.id">
						<div class="slider-preview__date">{{ galleryItem.created_at }}</div>
						<div
							class="slider-preview__image-wrapper"
							data-slide-preview
							:class="{
								tight: galleryItem.orientation === 'portrait',
								wide: galleryItem.orientation === 'landscape',
							}">
							<div class="slider-preview__image ibg">
								<CustomImg :src="galleryItem.photo" />
							</div>
						</div>
					</div>
				</div>
				<div class="slider-preview__controlls">
					<button class="slider-arrow slider-arrow-prev">
						<SvgIcon name="arrow-left--photos" />
					</button>
					<button class="slider-arrow slider-arrow-next">
						<SvgIcon name="arrow-right--photos" />
					</button>
				</div>
			</div>
			<div class="slider-thumbs swiper" ref="sliderThumbs" data-slider-thumbs>
				<div class="slider-thumbs__wrapper swiper-wrapper">
					<div
						class="slider-thumbs__slide swiper-slide"
						v-for="galleryItem in gallery"
						:key="galleryItem.id"
						:data-detail-photo-to="galleryItem.id">
						<div class="slider-thumbs__slide-inner">
							<div
								class="slider-thumbs__image-wrapper"
								:class="{
									tight: galleryItem.orientation === 'portrait',
									wide: galleryItem.orientation === 'landscape',
								}">
								<div class="slider-thumbs__image ibg">
									<CustomImg :src="galleryItem.photo" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Offcanvas>
</template>

<script>
	import Swiper from 'swiper';
	import { Navigation, Thumbs } from 'swiper/modules';
	import 'swiper/css';

	import { ref } from 'vue';
	import { gsap } from 'gsap';
	import { PURPLE_BACKGROUND_INDEX } from '@/utils/config';
	import { getReadyPhotos } from '@/animations/layouts';

	import { useAnimationStore } from '@/store/home.store';
	import { Service } from '@/api/service';

	const DURATION = 0.6;

	export default {
		sliders: {
			thumbSlider: null,
			previewSlider: null,
		},

		async setup() {
			const service = new Service();
			const animationStore = useAnimationStore();
			const headerConfig = ref(defineHeaderConfig(PURPLE_BACKGROUND_INDEX));
			const layoutConfig = ref(defineLayoutConfig(PURPLE_BACKGROUND_INDEX));

			headerConfig.value.absolute = true;
			headerConfig.value.filter = false;
			layoutConfig.value.footer = false;
			layoutConfig.value.header = false;

			const galleryResponse = await service.getDataFromUrl('photos');
			const gallery = computed(() =>
				galleryResponse.map((item, index) => ({
					...item,
					id: index,
				}))
			);

			return { gallery, animationStore, headerConfig, layoutConfig };
		},

		methods: {
			loaded() {
				setTimeout(() => {
					const { canvasRef } = this.$refs;
					const canvas = canvasRef.$el;
					this.animationStore.setDetailPageLayout(canvas);

					this.$options.sliders.thumbSlider = new Swiper(this.$refs.sliderThumbs, {
						spaceBetween: 14,
						slidesPerView: 'auto',
						watchOverflow: true,

						on: {
							init: (sliderInstance) => {
								setTimeout(() => {
									this.sliderThumbsAnimation(sliderInstance);
								}, 0);
							},
						},
					});

					this.$options.sliders.previewSlider = new Swiper(this.$refs.sliderPreview, {
						modules: [Navigation, Thumbs],
						slidesPerView: 1,
						spaceBetween: 24,
						navigation: {
							nextEl: '.slider-arrow.slider-arrow-next',
							prevEl: '.slider-arrow.slider-arrow-prev',
						},
						thumbs: {
							swiper: this.$options.sliders.thumbSlider,
						},
						on: {
							init: (sliderInstance) => {
								const id = this.$route.params.id;
								sliderInstance.slideTo(id, 0, null);

								document.addEventListener(
									'thumbsAnimationStart',
									(e) => {
										this.sliderPreviewAnimation(sliderInstance);
									},
									{ once: true }
								);
							},
						},
					});
				}, 0);
			},

			async sliderThumbsAnimation(sliderInstance) {
				const event = new Event('thumbsAnimationStart');

				const pageLayout = this.animationStore.getPageLayout;
				const detailPageLayout = this.animationStore.getDetailPageLayout;

				const slidePreview = detailPageLayout.querySelector(
					'[data-slider-preview] .swiper-slide-active [data-slide-preview]'
				);
				const photosTo = detailPageLayout.querySelectorAll('[data-detail-photo-to].swiper-slide-fully-visible');
				const viewportIndexes = Array.from(photosTo).map((photo) => +photo.dataset.detailPhotoTo);
				const allPhotosFrom = pageLayout.querySelectorAll('[data-detail-photo-from]');
				const allPhotosFromExluded = Array.from(allPhotosFrom).filter(
					(photo) => !photo.classList.contains('router-link-active')
				);
				const photosFrom = Array.from(pageLayout.querySelectorAll('[data-detail-photo-from]')).filter((photo) =>
					viewportIndexes.includes(+photo.dataset.detailPhotoFrom)
				);
				const copyList = Array.from(photosTo).map((photo) => photo.cloneNode(true));

				gsap.set(copyList, {
					position: 'absolute',
					zIndex: 201,
					opacity: '0',
					visibility: 'hidden',
					onComplete: () => {
						for (const copy of copyList) {
							document.body.append(copy);
						}
					},
				});

				await getReadyPhotos(copyList);

				gsap.set([allPhotosFromExluded, photosTo, slidePreview], {
					opacity: '0',
					visibility: 'hidden',
				});

				gsap.set(copyList, {
					opacity: '',
					visibility: '',
				});

				copyList.forEach((copy, index) => {
					const fromBox = photosFrom[index].getBoundingClientRect();
					const toBox = photosTo[index].getBoundingClientRect();

					gsap.fromTo(
						copy,
						{
							left: fromBox.left,
							top: fromBox.top,
							width: fromBox.width,
							height: fromBox.height,
						},
						{
							left: toBox.left,
							top: toBox.top,
							width: toBox.width,
							height: toBox.height,

							ease: 'power3.out',
							duration: DURATION,

							onStart: () => {
								document.dispatchEvent(event);
								this.animationStore.setDetailAnimationStart(true);
							},

							onComplete: () => {
								this.animationStore.setDetailAnimationEnd(true);
								copy.remove();

								gsap.set(photosTo, {
									opacity: '',
									visibility: '',
								});
							},
						}
					);
				});
			},

			async sliderPreviewAnimation(sliderInstance) {
				const slidePreview =
					sliderInstance.slides[sliderInstance.activeIndex].querySelector('[data-slide-preview]');
				const slidePreviewBox = slidePreview.getBoundingClientRect();
				const slidePreviewCopy = slidePreview.cloneNode(true);

				let photoLink = this.animationStore.getPageCard;

				if (!photoLink) {
					const layout = document.querySelector('[data-canvas-layout]');
					this.animationStore.setPageLayout(layout);
					this.animationStore.setPageCard(layout.querySelector('.router-link-active'));
					photoLink = this.animationStore.getPageCard;
				}

				const photoLinkBox = photoLink.getBoundingClientRect();

				gsap.set(slidePreviewCopy, {
					position: 'absolute',
					zIndex: 200,
					opacity: '0',
					visibility: 'hidden',
				});

				document.body.append(slidePreviewCopy);
				await new Promise((resolve) => (slidePreviewCopy.querySelector('img').onload = () => resolve()));

				gsap.set([photoLink, slidePreview], {
					opacity: '0',
					visibility: 'hidden',

					onComplete: () => {
						gsap.set(slidePreviewCopy, {
							opacity: '',
							visibility: '',
						});
					},
				});

				gsap.fromTo(
					slidePreviewCopy,
					{
						left: photoLinkBox.left,
						top: photoLinkBox.top,
						width: photoLinkBox.width,
						height: photoLinkBox.height,
					},
					{
						left: slidePreviewBox.left,
						top: slidePreviewBox.top,
						width: slidePreviewBox.width,
						height: slidePreviewBox.height,

						ease: 'power3.out',
						duration: DURATION,

						onComplete: () => {
							gsap.set(slidePreview, {
								opacity: '',
								visibility: '',
							});

							slidePreviewCopy.remove();
						},
					}
				);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.nested-canvas {
		z-index: 6;
		top: var(--scroll-top);
		overflow: hidden;

		opacity: 0 !important;
		visibility: hidden !important;
		transition: none;

		&.detailAnimationEnd {
			opacity: 1 !important;
			visibility: visible !important;
		}
	}

	.gallery {
		position: relative;
		height: 100svh;
		@include adaptiveValue('padding-top', 120, 72, 0, 1440, 375);
		@include adaptiveValue('padding-left', 32, 16, 0, 1440, 375);
		@include adaptiveValue('padding-right', 32, 16, 0, 1440, 375);
		@include adaptiveValue('padding-bottom', 24, 16, 0, 1440, 375);

		display: grid;
		grid-template-rows: 1fr auto;
		@include adaptiveValue('gap', 82, 16, 0, 1440, 375);
		min-width: 0;
	}

	.slider-preview {
		position: relative;
		width: auto;

		@include adaptiveValue('padding-left', 32, 16, 0, 1440, 375);
		@include adaptiveValue('padding-right', 32, 16, 0, 1440, 375);
		@include adaptiveValue('margin-left', -32, -16, 0, 1440, 375);
		@include adaptiveValue('margin-right', -32, -16, 0, 1440, 375);

		&__wrapper {
		}

		&__slide {
			display: flex;
			justify-content: center;
			align-items: center;

			@media (max-width: $mobile) {
				flex-direction: column;
				@include adaptiveValue('gap', 16, 8, 768, 375);
			}
		}

		&__date {
			align-self: flex-start;
			color: color('white', 0.4);
			font-size: rem(14);
			line-height: 114%;
			letter-spacing: 0.14px;

			@media (min-width: $mobile) {
				display: none;
			}
		}

		&__controlls {
			--ratio: 56px;
			--offset: 44px;

			position: absolute;
			z-index: 1;
			top: 50%;
			left: calc(var(--ratio) - var(--offset) / 2);
			transform: translateY(-50%);
			width: calc(100% - (var(--ratio) - var(--offset) / 2) * 2);
			height: 100%;

			display: flex;
			justify-content: space-between;
			align-items: center;
			pointer-events: none;

			@media (max-width: $tablet-xl) {
				--ratio: 38px;
				--offset: 32px;
			}

			@media (max-width: $mobile) {
				display: none;
			}
		}

		&__image-wrapper {
			position: relative;
			height: 100%;
			@include adaptiveValue('border-radius', 32, 12, 0, 1440, 375);
			overflow: hidden;

			@media (min-width: $mobile) {
				&.tight {
					aspect-ratio: 560 / 760;
				}

				&.wide {
					aspect-ratio: 760 / 560;
				}
			}

			@media (max-width: $mobile) {
				&.tight {
					aspect-ratio: 353 / 456;
				}

				&.wide {
					height: auto;
					width: 100%;
					aspect-ratio: 456 / 353;
				}
			}

			@media (max-width: $mobileSmall) {
				&.tight {
					width: 100%;
					height: 100%;
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
	}
	.slider-arrow {
		flex: 1 1 auto;
		height: 100%;

		display: flex;
		align-items: center;
		pointer-events: auto;

		&:hover {
			svg {
				transform: scale(1.6);
			}
		}

		svg {
			width: var(--ratio);
			aspect-ratio: 1;
			transition: transform 0.3s ease;
		}
	}
	.slider-arrow-next {
		justify-content: flex-end;
	}
	.slider-arrow-prev {
	}
	.slider-thumbs {
		width: auto;
		@include adaptiveValue('height', 96, 72, 0, 1440, 375);

		@include adaptiveValue('padding-left', 32, 16, 0, 1440, 375);
		@include adaptiveValue('padding-right', 32, 16, 0, 1440, 375);
		@include adaptiveValue('margin-left', -32, -16, 0, 1440, 375);
		@include adaptiveValue('margin-right', -32, -16, 0, 1440, 375);

		&__wrapper {
			height: 100%;
		}

		&__slide {
			width: auto;
			padding: rem(6) 0;
			box-sizing: border-box;

			@media (max-width: $mobile) {
				padding: rem(4) 0;
			}

			&.swiper-slide-thumb-active {
				.slider-thumbs__slide-inner {
					@include adaptiveValue('border-radius', 12, 8, 0, 1440, 375);
					outline: rem(3) solid color('purple-1');
					box-shadow: 0 rem(8) rem(16) color('black');

					@media (max-width: $mobile) {
						outline: rem(2) solid color('purple-1');
					}
				}
			}
		}

		&__slide-inner {
			width: 100%;
			height: 100%;
		}

		&__image-wrapper {
			cursor: pointer;
			position: relative;
			height: 100%;
			@include adaptiveValue('border-radius', 12, 8, 0, 1440, 375);
			overflow: hidden;

			&.tight {
				@include adaptiveValue('width', 69, 56, 0, 1440, 375);
			}

			&.wide {
				@include adaptiveValue('width', 154, 104, 0, 1440, 375);
			}
		}

		&__image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		.ibg {
		}
	}
</style>
