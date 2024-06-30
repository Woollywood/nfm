<template>
	<div class="about-wrapper" ref="wrapper">
		<Offcanvas @close="close" @loaded="loaded" ref="canvas" :headerConfigProp="headerConfig">
			<template #default="{ layoutConfigData }">
				<div class="layer-content fade-up fade-up--layout">
					<div class="about container container--about" ref="container">
						<section class="about__section" v-for="(section, index) in sections" :key="index">
							<h3 class="about__title">{{ section.title }}</h3>
							<AboutSliderContent
								v-if="section.type === 'content'"
								:slides="section.slides"
								:sliderIndex="index"
								:selectedSlide="selectedSlide"
								:class="{ controllsHidden: sliderActive !== index }"
								@mouseenter="onMouseEnter(index)"
								@click="slideClick({ sliderIndex: index, slideIndex: $event })" />
							<AboutSliderLogos
								v-else
								:slides="section.slides"
								:sliderIndex="index"
								:class="{ controllsHidden: sliderActive !== index }"
								@mouseenter="onMouseEnter(index)" />
						</section>
					</div>
				</div>
				<CustomArrowNavigate
					v-if="layoutConfigData.arrowNavName"
					class="layer-arrow-navigate"
					:name="layoutConfigData.arrowNavName" />
			</template>
		</Offcanvas>

		<div class="about__banner-wrapper" ref="bannerWrapper">
			<div class="about__banner-effect" data-banner-effect></div>
			<AboutBanner
				class="about__banner"
				:bannerPath="isMobile ? bannerPath.mobile : bannerPath.desktop"
				v-model:isFirstChecked="isFirstCheckedBanner"
				:banner="bannerData" />
		</div>
	</div>
</template>

<script>
	import _ from 'lodash';

	import { gsap } from 'gsap';
	import { DEFAULT_BACKGROUND_INDEX } from '@/utils/config';

	import { RouterBack, fromHomeAnimation } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { Service } from '@/api/service';
	import { BASE_URL } from '@/constants/api';

	export default {
		data() {
			return {
				selectedSlide: null,
				sliderActive: 0,

				sliderIndex: null,
				slideIndex: null,
				isFirstCheckedBanner: false,
			};
		},
		resizeObserver: null,
		methods: {
			setGrid() {
				const { canvas, wrapper, container } = this.$refs;
				const canvasElement = canvas.$el;
				const headerElement = canvasElement.querySelector('[data-canvas-header]');

				const headerHeight = headerElement.offsetHeight;
				const containerWidth = container.offsetWidth;

				const containerBox = container.getBoundingClientRect();
				const containerPaddingLeft = containerBox.left;

				wrapper.style.cssText += `
				--header-height: ${headerHeight}px;
				--container-width: ${containerWidth}px;
				--padding-left: ${containerPaddingLeft}px;
			`;
			},

			close() {
				const { bannerWrapper } = this.$refs;
				const bannerBox = bannerWrapper.getBoundingClientRect();

				gsap.to(bannerWrapper, {
					y: `-${bannerBox.top + bannerBox.height}`,
					duration: 0.6,
					ease: 'power3.out',

					onStart: () => {
						bannerWrapper.classList.remove('banner-animation-end');
					},
				});

				this.isFirstCheckedBanner = false;
				RouterBack(this.animationStore);
			},

			loaded() {
				const { canvas: canvasRef } = this.$refs;

				setTimeout(() => {
					const { bannerWrapper } = this.$refs;
					const bannerBox = bannerWrapper.getBoundingClientRect();

					gsap.fromTo(
						bannerWrapper,
						{
							y: `-${bannerBox.top + bannerBox.height}`,
						},
						{
							y: 0,
							duration: 0.6,
							ease: 'power3.out',

							onComplete: () => {
								bannerWrapper.classList.add('banner-animation-end');
							},
						}
					);

					this.$options.resizeObserver = new ResizeObserver((entries) => {
						const { wrapper } = this.$refs;
						const bannerHeight = entries[0].contentRect.height;
						wrapper.style.cssText += `--banner-height: ${bannerHeight}px`;
					});

					this.$options.resizeObserver.observe(bannerWrapper);

					this.setGrid();
					window.addEventListener('resize', this.setGrid);

					const canvas = canvasRef.$el;
					this.animationStore.setPageLayout(canvas);

					fromHomeAnimation(this.animationStore, null);
				}, 0);
			},

			onMouseEnter(index) {
				this.sliderActive = index;
			},

			slideClick({ sliderIndex, slideIndex }) {
				if (this.selectedSlide?.sliderIndex === sliderIndex && this.selectedSlide?.slideIndex === slideIndex) {
					this.isFirstCheckedBanner = false;
					this.selectedSlide = null;
				} else {
					this.selectedSlide = {
						sliderIndex,
						slideIndex,
					};

					this.bannerData = this.banner[sliderIndex === 1 ? sliderIndex : sliderIndex / 2][slideIndex];
				}
			},
		},
		async setup() {
			const service = new Service();

			const headerConfig = ref(defineHeaderConfig(DEFAULT_BACKGROUND_INDEX, 1));
			const animationStore = useAnimationStore();
			const { isMobile } = useDevice();

			const { data: bannerPath } = await useFetch('api/v1/about/banner/about-banner', {
				baseURL: BASE_URL,
			});
			const sectionsResponse = await Promise.all([
				new Promise((resolve) => resolve(service.getDataFromUrl('about/capabilities'))),
				new Promise((resolve) => resolve(service.getDataFromUrl('about/industries'))),
				new Promise((resolve) => resolve(service.getDataFromUrl('about/partners'))),
				new Promise((resolve) => resolve(service.getDataFromUrl('about/sponsors'))),
			]);

			const [capabilities, industries, partners, sponsors] = sectionsResponse;

			const sections = computed(() => [
				{
					title: 'Capabilities',
					type: 'content',
					slides: capabilities.map((slide) => ({
						imagePath: slide.thumbnail,
						banner: {
							desktop: slide.image_desktop,
							mobile: slide.image_mobile,
						},
					})),
				},
				{
					title: 'Partners',
					type: 'logos',
					slides: partners.map((slide) => ({
						imagePath: slide.thumbnail,
						imagePathMobile: slide.thumbnail,
					})),
				},
				{
					title: 'Industries',
					type: 'content',
					slides: industries.map((slide) => ({
						imagePath: slide.thumbnail,
						banner: {
							desktop: slide.image_desktop,
							mobile: slide.image_mobile,
						},
					})),
				},
				{
					title: 'Sports Sponsorships',
					type: 'logos',
					slides: sponsors.map((slide) => ({
						imagePath: slide.thumbnail,
						imagePathMobile: slide.thumbnail,
					})),
				},
			]);

			const banner = computed(() =>
				sections.value
					.filter((item) => item.type === 'content')
					.map((itemOuter) =>
						itemOuter.slides.map((itemInner) => ({
							desktop: itemInner.banner.desktop,
							mobile: itemInner.banner.mobile,
						}))
					)
			);

			const bannerData = ref(banner.value[0]);

			return {
				sections,
				banner,
				bannerPath,
				bannerData,
				headerConfig,
				animationStore,
				isMobile,
				RouterBack,
			};
		},
		created() {
			this.setGrid = _.throttle(this.setGrid, 200);
		},
		unmounted() {
			this.$options.resizeObserver.disconnect();
			window.removeEventListener('resize', this.setGrid);
		},
	};
</script>

<style lang="scss" scoped>
	.about {
		@media (min-width: $mobile) {
			padding-top: calc(var(--banner-height) + rem(54));

			@media (max-width: $tablet-xl) and (max-height: rem(892)) {
				padding-top: calc(var(--banner-height) + rem(42));
			}

			@media (max-width: $tablet-xl) and (max-height: rem(620)) {
				padding-top: calc(var(--banner-height) + rem(32));
			}
		}

		@media (max-width: $mobile) {
			padding-top: calc(var(--banner-height) + rem(18));
		}

		&__banner-wrapper {
			position: fixed;
			z-index: 100;
			top: var(--header-height);
			left: 0;
			width: 100%;

			pointer-events: none;
			transition: background-color 0.1s ease-in-out;

			&.banner-animation-end {
				background-color: color('black');
			}

			display: flex;
			justify-content: center;
		}

		&__banner-effect {
			position: absolute;
			top: 99%;
			left: 0;
			width: 100%;
			@include adaptiveValue('height', 64, 24, 0, 1440, 375);

			.banner-animation-end & {
				background: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0) 100%);
			}
		}

		&__banner {
			@media (min-width: $mobile) {
				max-width: calc(var(--container-width) - rem(272));
				width: 100%;

				@media (max-width: em(1660)) and (max-height: rem(762)) {
					max-width: calc(var(--container-width) - rem(612));
				}

				@media (max-width: em(1660)) and (max-height: rem(620)) {
					max-width: calc(var(--container-width) - rem(720));
				}
			}

			@media (max-width: $tablet-xl) and (min-width: $tablet) {
				width: calc(var(--container-width) - rem(272));
			}

			@media (max-width: $mobile) {
				width: 100%;
			}

			&:not(:last-child) {
				@include adaptiveValue('margin-bottom', 54, 24, 0, 1440, 375);
			}
		}

		&__section {
			&:not(:last-child) {
				@include adaptiveValue('margin-bottom', 98, 34, 0, 1440, 375);

				@media (min-width: $mobile) {
					@media (max-width: $tablet-xl) and (max-height: rem(892)) {
						@include adaptiveValue('margin-bottom', 72, 34, 0, 1920, 768);
					}

					@media (max-width: $tablet-xl) and (max-height: rem(620)) {
						@include adaptiveValue('margin-bottom', 64, 16, 0, 1920, 768);
					}
				}
			}
		}

		&__title {
			font-size: rem(24);
			font-weight: 500;
			line-height: 100%;
			letter-spacing: rem(0.24);

			@media (max-width: $tablet-xl) {
				font-size: rem(18);
				letter-spacing: rem(0.18);
			}

			@media (max-width: $mobile) {
				font-size: rem(16);
				letter-spacing: rem(0.16);
			}

			&:not(:last-child) {
				@include adaptiveValue('margin-bottom', 21, 10, 0, 1440, 375);
			}
		}

		&__capabilities {
		}
	}
</style>
