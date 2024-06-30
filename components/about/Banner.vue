<script setup>
	const { isMobile } = useDevice();
</script>

<template>
	<div class="banner" ref="banner" :class="{ firstChecked: isFirstChecked }">
		<div class="banner__wrapper">
			<div class="banner__video-wrapper" :class="{ firstChecked: isFirstChecked }">
				<div class="banner__video-inner-outside">
					<div class="banner__video-inner-wrapper" data-video-wrapper>
						<div class="banner__video-inner">
							<CustomLoader class="banner__video-loader" />
							<img class="banner__video" :src="bannerPath" />
						</div>
					</div>
				</div>
				<div class="banner__image-wrapper banner__image-wrapper--video ibg">
					<div class="img-preloader">
						<CustomLoader />
					</div>
					<CustomImg
						class="banner__image"
						v-if="!changed"
						:src="isMobile ? `${banner.mobile}` : `${banner.desktop}`" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			banner: {
				type: [Object, undefined],
				required: true,
			},
			bannerPath: {
				type: String,
				required: true,
			},
			isFirstChecked: {
				type: Boolean,
				required: true,
			},
		},
		data() {
			return {
				changed: false,
			};
		},
		watch: {
			banner(from, to) {
				this.$emit('update:isFirstChecked', true);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.banner {
		position: relative;
		width: 100%;
		height: 50vh;
		aspect-ratio: 1280 / 540;

		width: 100%;
		height: 100%;

		@media (max-width: $mobile) {
			height: auto;
			aspect-ratio: 375 / 212;
		}

		&__wrapper {
			width: 100%;
			height: 100%;
			transform: translateY(-8.4%);
		}

		&__image-wrapper {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			@media (max-width: $mobile) {
				display: none;
			}

			&--video {
				display: none;

				.firstChecked & {
					display: block;
				}
			}
		}

		&__image {
		}

		&__video-wrapper {
			position: relative;
			width: auto;
			height: 100%;

			border-radius: rem(16);
			overflow: hidden;
			-webkit-mask-image: -webkit-radial-gradient(white, black);
		}

		&__video-inner-outside {
			width: 100%;
			height: 100%;

			.firstChecked & {
				display: none;
			}

			@media (max-width: $mobile) {
				padding: 0 rem(16);
			}
		}

		&__video-inner-wrapper {
			position: relative;
			width: 100%;
			height: 100%;
			border-radius: rem(16);
			overflow: hidden;
			-webkit-mask-image: -webkit-radial-gradient(white, black);
		}

		&__video-inner {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		&__video-loader {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		&__video {
			position: absolute;
			z-index: 0;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			pointer-events: none;
		}
	}

	.img-preloader {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
