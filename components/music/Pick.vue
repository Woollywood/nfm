<script setup>
	const props = defineProps({
		pick: {
			type: Object,
			required: true,
		},
	});
</script>

<template>
	<div class="pick">
		<div class="pick__header header-pick">
			<div class="header-pick__avatar ibg">
				<CustomImg :src="pick.title.avatar" />
			</div>
			<div class="header-pick__title">{{ pick.title.text }}</div>
		</div>
		<div class="pick__items">
			<div class="pick__item pick-item" v-for="pickItem in pick.items">
				<div class="pick-item__preview ibg">
					<CustomImg :src="pickItem.preview" />
				</div>
				<div class="pick-item__text-wrapper">
					<div class="pick-item__song-name">{{ pickItem.songName }}</div>
					<div class="pick-item__group-name">{{ pickItem.groupName }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.pick {
		&__header {
			&:not(:last-child) {
				padding-bottom: rem(16);
				border-bottom: rem(1) solid color('white', 0.24);
				margin-bottom: rem(16);

				@media (max-width: $tablet-xl) {
					padding-bottom: rem(8);
				}
			}

			@media (max-width: $mobileSmall) {
				@include adaptiveValue('padding-left', 120, 16, 0, 1440, 375);
				@include adaptiveValue('padding-right', 120, 16, 0, 1440, 375);

				@include adaptiveValue('margin-left', -120, -16, 0, 1440, 375);
				@include adaptiveValue('margin-right', -120, -16, 0, 1440, 375);
			}
		}

		&__items {
		}

		&__item {
			&:not(:last-child) {
				margin-bottom: rem(16);
			}

			@media (max-width: $mobileSmall) {
				padding-bottom: rem(16);
				border-bottom: rem(1) solid color('white', 0.16);

				@media (max-width: $mobileSmall) {
					@include adaptiveValue('padding-left', 120, 16, 0, 1440, 375);
					@include adaptiveValue('padding-right', 120, 16, 0, 1440, 375);

					@include adaptiveValue('margin-left', -120, -16, 0, 1440, 375);
					@include adaptiveValue('margin-right', -120, -16, 0, 1440, 375);
				}
			}
		}
	}
	.header-pick {
		display: flex;
		align-items: center;
		gap: rem(12);

		&__avatar {
			@include adaptiveValue('width', 32, 28, 0, 1440, 375);
			aspect-ratio: 1;
			border-radius: 50%;
			overflow: hidden;
		}

		&__title {
			font-size: rem(20);
			font-weight: 700;
			line-height: 100%;

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
			}

			@media (max-width: $mobile) {
				font-size: rem(14);
			}
		}
	}

	.pick-item {
		display: flex;
		align-items: center;
		gap: rem(20);

		@media (max-width: $tablet-xl) {
			gap: rem(16);
		}

		&__preview {
			width: rem(80);
			aspect-ratio: 1;
			border-radius: rem(16);
			@include adaptiveValue('border-radius', 16, 12, 0, 1440, 375);
			overflow: hidden;
			flex-shrink: 0;

			@media (max-width: $tablet-xl) {
				width: rem(72);
			}

			@media (max-width: $mobile) {
				width: rem(64);
			}
		}

		&__text-wrapper {
			display: flex;
			flex-direction: column;
			gap: rem(4);

			@media (max-width: $mobile) {
				gap: rem(0);
			}
		}

		&__song-name {
			font-size: rem(20);
			line-height: 100%;
			letter-spacing: rem(0.2);

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
				letter-spacing: rem(0.15);
			}

			@media (max-width: $mobile) {
				font-size: rem(14);
				line-height: 142%;
				letter-spacing: rem(0.14);
			}
		}

		&__group-name {
			color: color('white', 0.4);
			font-size: rem(16);
			line-height: 100%;
			letter-spacing: rem(0.16);

			@media (max-width: $tablet-xl) {
				font-size: rem(12);
				letter-spacing: rem(0.12);
			}

			@media (max-width: $mobile) {
				line-height: 133%;
			}
		}
	}
</style>
