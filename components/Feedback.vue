<template>
	<div class="feedback">
		<div class="feedback__top container feedback-container" data-feedback-top>
			<slot />
		</div>
		<div class="feedback__footer">
			<div class="feedback__map" ref="map"></div>
			<div class="feedback__map-effect"></div>
			<div class="feedback__map-blend"></div>
		</div>
	</div>
</template>

<script>
	import { styles } from '@/data/map/styles';

	export default {
		props: {
			pageName: {
				type: String,
				required: true,
			},
		},
		methods: {},
		setup() {
			const { isMobile } = useDevice();
			return { isMobile };
		},

		mounted() {
			const { map: mapRef } = this.$refs;

			const myLatLng = { lat: 40.444618895642996, lng: -79.99584741424344 };
			const map = new google.maps.Map(mapRef, {
				zoom: 14,
				center: myLatLng,
				styles,
				disableDefaultUI: true,
				draggable: false,
				zoomControl: false,
				scrollwheel: false,
				disableDoubleClickZoom: true,
				clickableIcons: false,
			});

			let markerName = '';

			if (this.isMobile) {
				markerName = `feedback-${this.pageName}--mobile.svg`;
			} else {
				if (window.innerWidth > 1440) {
					markerName = `feedback-${this.pageName}.svg`;
				} else {
					markerName = `feedback-${this.pageName}--laptop.svg`;
				}
			}

			const marker = new google.maps.Marker({
				position: myLatLng,
				map,
				title: 'Hello World!',
				icon: `/map/markers/${markerName}`,
			});

			const tooltip = new google.maps.InfoWindow({
				content: `<div class="map-tooltip">
					  	<div class="map-tooltip__content">
							960 Penn. Ave., Suite 303 <br />
							Pittsburgh, PA 15222
						`,
			});

			map.addListener('idle', (e) => {
				tooltip.open(map, marker);
			});

			window.initMap = initMap;
		},
	};
</script>

<style lang="scss" scoped>
	.feedback-container {
		padding: 0 rem(40);
		max-width: 100%;

		@media (max-width: $mobile) {
			padding-top: rem(32);
		}
	}
	.feedback {
		display: grid;
		grid-template-rows: auto minmax(rem(560), 1fr);

		&__footer {
			position: relative;

			display: flex;
			justify-content: center;
			align-items: center;
			overflow: hidden;
		}

		&__location-wrapper {
			position: relative;
			z-index: 1;

			display: flex;
			flex-direction: column;
			align-items: center;
			gap: rem(8);
		}

		&__map {
			position: absolute;
			z-index: 0;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		&__map-effect {
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
			width: 100%;
			height: 140%;
			pointer-events: none;
			opacity: 0.48;
			background: radial-gradient(
				25.74% 25.74% at 50% 33.29%,
				rgba(0, 13, 33, 0) 0%,
				rgba(5, 20, 33, 0.01) 0.01%,
				#051421 100%
			);

			@media (max-width: $mobile) {
				left: -280%;
				width: 600%;
			}
		}

		&__map-blend {
			position: absolute;
			z-index: 2;
			top: 0;
			left: 0;
			width: 100%;
			height: 140%;
			pointer-events: none;
			background-color: color('black-2', 0.4);
			mix-blend-mode: color;
		}
	}
</style>
