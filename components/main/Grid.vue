<template>
	<div class="app-grid">
		<button
			class="app-about"
			@click="clickLink($event, aboutLink.slug)"
			data-link-wrapper
			:data-link="aboutLink.title">
			<template v-for="video in aboutLink.videos" :key="video.id">
				<div class="app-about__inner">
					<div class="app-about__image ibg">
						<CustomImg :src="video.preview" />
					</div>
					<SvgIcon class="app-about__icon" name="plus" />
				</div>
				<div class="app-about__video-wrapper ibg">
					<iframe
						:src="video.iframe"
						data-about-video
						allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"></iframe>
				</div>
				<div class="app-link__name">{{ aboutLink.title }}</div>
			</template>
		</button>
		<button
			class="app-work"
			@click="clickLink($event, workLink.slug)"
			data-link-wrapper
			:data-link="workLink.title">
			<swiper
				class="app-slider"
				:modules="modules"
				:space-between="workSpaceBetween"
				:loop="true"
				:slides-per-view="1"
				:autoplay="{ delay: 3000 }">
				<swiper-slide v-for="banner in workLink.banners" :key="banner.id" class="app-slide">
					<div class="app-slide__body">
						<div class="app-slide__image ibg">
							<CustomImg :src="banner.image" :alt="banner.image_alt" />
						</div>
					</div>
				</swiper-slide>
			</swiper>
			<div class="app-link__name">{{ workLink.title }}</div>
		</button>
		<button
			v-for="link in normalLinks"
			:key="link.id"
			class="app-link"
			:class="[`home-link__${link.title}`, link.type]"
			@click="clickLink($event, link.slug)"
			data-link-wrapper
			:data-link="link.title.toLowerCase()">
			<div class="app-link__icon-box">
				<div class="app-link__icon ibg">
					<CustomImg :src="link.icon" />
				</div>
			</div>
			<div class="app-link__name">{{ link.title }}</div>
		</button>
	</div>
</template>

<style lang="scss" scoped></style>

<script>
	import { Swiper, SwiperSlide } from 'swiper/vue';
	import { Autoplay } from 'swiper/modules';
	import 'swiper/css';
	import { useAnimationStore } from '@/store/home.store';

	export default {
		components: {
			Swiper,
			SwiperSlide,
		},
		props: {
			normalLinks: {
				type: Array,
				required: true,
			},
			aboutLink: {
				type: Object,
				required: true,
			},
			workLink: {
				type: Object,
				required: true,
			},
		},
		emits: {
			clickLink: null,
		},
		methods: {
			clickLink(event, path) {
				if (!this.animationStore.isLayoutAnimationStart) {
					const router = useRouter();
					router.push(path);
					this.$emit('clickLink', event);
				} else {
					console.log('router blocked');
				}
			},
		},
		data() {
			return {
				workSpaceBetween: 32,
			};
		},
		async setup() {
			const modules = [Autoplay];
			const { isMobile, isTablet } = useDevice();
			const animationStore = useAnimationStore();

			return { modules, isMobile, isTablet, animationStore };
		},

		mounted() {
			if (this.isTablet) {
				this.workSpaceBetween = 24;
			}
		},
	};
</script>

<style lang="scss" scoped>
	.app-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-auto-flow: row;
		column-gap: var(--ratio);
		row-gap: calc(var(--ratio) * 0.75);
		max-width: calc(13 * var(--ratio));
		margin: auto 0 auto;

		@media (min-width: $mobile) {
			max-height: calc(3 * var(--ratio) + (var(--ratio) * 0.75) * 2);
		}

		@media (max-width: $mobile) {
			grid-template-columns: repeat(4, 1fr);
			column-gap: calc(var(--ratio--mobile) * 0.75);
			row-gap: calc(var(--ratio--mobile) * 0.84);

			max-width: calc(4 * var(--ratio--mobile) + var(--ratio--mobile) * 0.75);
		}
	}

	.app-about {
		position: relative;
		display: flex;
		grid-column: span 3;
		grid-row: span 2;

		@media (min-width: $mobile) {
			width: calc(var(--ratio) * 5);
			height: calc(var(--ratio) * 2 + var(--ratio) * 0.75);
		}

		@media (max-width: $mobile) {
			grid-column: span 4;
			grid-row-start: 3;
			aspect-ratio: 16 / 9;

			margin-bottom: rem(-8);
		}

		&__inner {
			width: 100%;
			height: 100%;
			position: relative;
			border-radius: rem(32);
			overflow: hidden;
			-webkit-mask-image: -webkit-radial-gradient(white, black);

			@media (max-width: $tablet-xl) {
				border-radius: rem(24);
			}

			@media (max-width: $mobile) {
				border-radius: rem(12);
			}
		}

		&__image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		&__video-wrapper {
			pointer-events: none;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border-radius: rem(32);
			overflow: hidden;
			-webkit-mask-image: -webkit-radial-gradient(white, black);

			@media (max-width: $tablet-xl) {
				border-radius: rem(24);
			}

			@media (max-width: $mobile) {
				border-radius: rem(12);
			}

			iframe {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		&__icon {
			position: absolute;
			@include adaptiveValue('right', 24, 12, 0, 1440, 991);
			@include adaptiveValue('bottom', 24, 12, 0, 1440, 991);
			@include adaptiveValue('width', 40, 32, 0, 1440, 991);
			aspect-ratio: 1;
		}
	}

	.app-work {
		position: relative;
		grid-column-start: 6;
		grid-column-end: 8;
		grid-row-start: 2;
		grid-row-end: 4;
		min-width: 0;
		@include adaptiveValue('font-size', 32, 12, 0, 1440, 375);
		overflow: visible;

		width: calc(var(--ratio) * 3);
		height: calc(var(--ratio) * 2 + var(--ratio) * 0.92);

		img {
			object-fit: contain;
		}

		@media (max-width: $mobile) {
			grid-column-start: 3;
			grid-column-end: 5;
			grid-row-start: 4;
			grid-row-end: 6;

			width: calc(var(--ratio--mobile) * 2 + var(--ratio--mobile) * 0.75);
			height: calc(var(--ratio--mobile) * 2 + var(--ratio--mobile) * 0.9);
		}
	}

	.app-slider {
		width: 100%;
		height: 100%;

		@include adaptiveValue('border-radius', 32, 12, 0, 1440, 375);
		overflow: hidden;
		overflow-y: visible;
		transform: scale(1.2);
	}
	.app-slide {
		&__body {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			@include adaptiveValue('border-radius', 32, 12, 0, 1440, 375);
			overflow: hidden;
		}

		&__image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	.app-link {
		position: relative;
		display: flex;
		width: var(--ratio);
		aspect-ratio: 1;

		&:hover {
			.app-link__icon-box {
				transform: scale(1.1);
			}
		}

		@media (max-width: $mobile) {
			width: var(--ratio--mobile);
		}

		&__icon-box {
			position: relative;
			width: 100%;
			aspect-ratio: 1;
			border-radius: calc(28 / 128 * 100%);
			overflow: hidden;
			transition: transform 0.3s ease-in-out;
			-webkit-mask-image: -webkit-radial-gradient(white, black);

			@media (max-width: $mobile) {
				border-radius: calc(12 / 48 * 100%);
			}
		}

		&__icon {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			img {
				object-fit: contain;
			}
		}

		&__name {
			position: absolute;
			top: calc(100% + 8px);
			left: 50%;
			transform: translateX(-50%);

			text-align: center;
			color: color('white');
			font-size: min(vw(28px), vh(28px));
			font-weight: 400;
			line-height: 128%;
			@include adaptiveValue('letter-spacing', 0.28, 0.12, 1440, 375);
			white-space: nowrap;
			text-transform: capitalize;

			@media (max-width: $tablet-xl) {
				font-size: min(vw(24px), vh(24px));
			}

			@media (max-width: $mobile) {
				font-size: rem(12);
				line-height: 134%;
				top: calc(100% + 4px);
			}
		}
	}

	[data-link='chat'] {
		@media (min-width: $mobile) {
			display: none;
		}
	}

	[data-link='cases'] {
		&:hover {
			.app-link__icon-box {
				transform: scale(1.26);
			}
		}
		.app-link__icon-box {
			transform: scale(1.2);
			transform-origin: left top;
		}
	}

	[data-link='careers'] {
		&:hover {
			.app-link__icon-box {
				transform: scale(1.46);
			}
		}
		.app-link__icon-box {
			transform: scale(1.3);
		}
	}

	[data-link='contact'] {
		&:hover {
			.app-link__icon-box {
				transform: scale(1.46);
			}
		}
		.app-link__icon-box {
			transform: scale(1.3);
		}
	}

	[data-link='chat'] {
		&:hover {
			.app-link__icon-box {
				transform: scale(1.46);
			}
		}
		.app-link__icon-box {
			transform: scale(1.3);
		}
	}
</style>
