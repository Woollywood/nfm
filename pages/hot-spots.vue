<template>
	<Offcanvas
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@close="RouterBack(animationStore, '/')"
		@loaded="loaded"
		class="canvas-core hotspots-canvas"
		ref="canvasRef">
		<div class="hotspots fade-up fade-up--layout">
			<div class="google-map" id="google-map" ref="map"></div>
			<div class="hotspots__effect hotspots__effect--shine"></div>
			<div class="hotspots__effect hotspots__effect--shadow"></div>
			<HotspotsSlider class="slider" :slides="slides" v-model="slideIndex" />
		</div>
	</Offcanvas>
</template>

<script>
	import { defineComponent } from 'vue';
	import { styles } from '@/data/map/styles';

	import { RouterBack, fromHomeAnimation } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { Service } from '@/api/service';

	export default defineComponent({
		async setup() {
			const service = new Service();

			const animationStore = useAnimationStore();
			const headerConfig = ref(defineHeaderConfig());
			const layoutConfig = ref(defineLayoutConfig());
			const { isMobile } = useDevice();

			headerConfig.value.absolute = true;
			delete headerConfig.value.backgroundPath;

			const data = await service.getDataFromUrl('hotspots');
			const dataSoring = computed(() => data.slice().sort((a, b) => a.sorting - b.sorting));
			const slides = computed(() => dataSoring.value);

			const markerOptions = computed(() =>
				dataSoring.value.map((slide) => ({
					position: {
						lat: +slide.latitude,
						lng: +slide.longitude,
					},
					icon: '/map/markers/hotspots.svg',
				}))
			);

			const center = computed(() => markerOptions.value[0].position);

			return { slides, markerOptions, center, isMobile, headerConfig, layoutConfig, animationStore, RouterBack };
		},
		data() {
			return { slideIndex: 0, markerPath: '', activeMarkerPath: '' };
		},
		map: null,
		markers: [],
		methods: {
			loaded() {
				const { canvasRef } = this.$refs;

				setTimeout(() => {
					const { map: mapRef } = this.$refs;
					const markersArray = [];
					let mapCenter = null;

					if (this.isMobile) {
						this.markerPath = `/map/markers/hotspots-mobile.svg`;
						this.activeMarkerPath = `/map/markers/hotspots-mobile--active.svg`;
						mapCenter = this.getMobilePosition(this.center);
					} else {
						this.markerPath = `/map/markers/hotspots.svg`;
						this.activeMarkerPath = `/map/markers/hotspots--active.svg`;
						mapCenter = this.getDesktopPosition(this.center);
					}

					this.$options.map = new google.maps.Map(mapRef, {
						zoom: 14,
						center: mapCenter,
						styles,
						disableDefaultUI: true,
						draggable: false,
						zoomControl: false,
						scrollwheel: false,
						disableDoubleClickZoom: true,
						clickableIcons: false,
					});

					const { map } = this.$options;

					this.markerOptions.map((markerOption, index) => {
						const marker = new google.maps.Marker({
							position: markerOption.position,
							map,
							title: 'marker',
							icon: this.markerPath,
						});
						markersArray.push(marker);

						marker.addListener('click', (e) => {
							this.slideIndex = index;
							if (window.innerWidth > 768) {
								map.panTo(this.getDesktopPosition(markerOption.position));
							} else {
								map.panTo(this.getMobilePosition(markerOption.position));
							}
						});
					});

					this.$options.markers = markersArray;
					markersArray[0].setIcon(this.activeMarkerPath);
					window.initMap = initMap;

					const canvas = canvasRef.$el;
					this.animationStore.setPageLayout(canvas);

					fromHomeAnimation(this.animationStore, null);
				}, 0);
			},

			getMobilePosition(position) {
				return { ...position, lat: position.lat - 0.004 };
			},
			getDesktopPosition(position) {
				return { ...position, lng: position.lng + 0.02 };
			},
			setMarkersIcon(currentIndex) {
				const { markers } = this.$options;
				markers.forEach((marker) => {
					marker.setIcon(this.markerPath);
				});
				markers[currentIndex].setIcon(this.activeMarkerPath);
			},
		},
		watch: {
			slideIndex(newValue) {
				const { map } = this.$options;
				const markerOption = this.markerOptions[newValue];
				if (window.innerWidth > 768) {
					this.setMarkersIcon(newValue);
					map.panTo(this.getDesktopPosition(markerOption.position));
				} else {
					this.setMarkersIcon(newValue);
					map.panTo(this.getMobilePosition(markerOption.position));
				}
			},
		},
	});
</script>

<style lang="scss" scoped>
	.canvas-core {
		overflow: hidden;
	}
	.hotspots {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;

		&__effect {
			position: absolute;
			pointer-events: none;
			z-index: 1;

			&--shine {
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: rem(120);
				aspect-ratio: 1;
				border-radius: 50%;
				overflow: hidden;
				background: linear-gradient(180deg, rgba(255, 1, 79, 0.72) 0%, rgba(255, 116, 1, 0.72) 100%);
				filter: blur(96.53631591796875px);

				@media (max-width: $tablet-xl) {
					width: rem(96);
					filter: blur(86px);
				}

				@media (max-width: $mobile) {
					top: 24%;
					width: rem(80);
					filter: blur(64px);
				}
			}

			&--shadow {
				width: 100%;
				height: 100%;
				opacity: 0.48;
				background: radial-gradient(50% 50% at 50% 50%, rgba(0, 13, 33, 0) 0%, #000 100%);
			}
		}
	}
	.google-map {
		position: absolute;
		z-index: 0;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.slider {
		position: absolute;

		@media (min-width: $tablet) {
			right: rem(128);
			top: 50%;
			transform: translateY(-50%);
		}

		@media (min-width: $mobile) {
			box-shadow: 0px 48px 96px 0px rgba(0, 0, 0, 0.48);
		}

		@media (max-width: $tablet-xl) {
			right: 7.1%;
		}

		@media (max-width: $tablet) {
			bottom: 6%;
			left: 12%;
			right: 12%;
		}

		@media (max-width: $mobileSmall) {
			left: rem(28);
			right: rem(28);
			bottom: rem(16);
		}
	}
</style>
