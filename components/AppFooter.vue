<script setup>
	import { useAnimationStore } from '@/store/home.store';
	import { RouterBack } from '@/animations/layouts';

	const animationStore = useAnimationStore();
</script>

<template>
	<div>
		<footer class="footer footer-desktop">
			<div class="footer__left">
				<button class="footer__logo ibg" @click="RouterBack(animationStore, '/')">
					<CustomImg src="logo.svg" />
				</button>
				<div class="footer__text">960 Penn Avenue, Suite 303, Pittsburgh, Pennsylvania 15222</div>
			</div>
			<div class="footer__privacy-policy">© 2024 NFM Agency. All Rights Reserved</div>
		</footer>
		<footer class="footer footer--mobile footer-mobile">
			<div class="footer__policy">
				960 Penn Avenue, Suite 303 Pittsburgh, Pennsylvania 15222 <br />
				© 2024 NFM Agency All Rights Reserved
			</div>
			<button class="footer__logo ibg" @click="RouterBack(animationStore, '/')">
				<CustomImg src="logo.svg" />
			</button>
		</footer>
	</div>
</template>

<script>
	export default {};
</script>

<style lang="scss" scoped>
	.footer-desktop {
		position: relative;

		@media (max-width: $mobile) {
			display: none !important;
		}
	}

	.footer-mobile {
		position: relative;

		@media (min-width: $mobile) {
			display: none !important;
		}
	}

	.footer {
		display: flex;
		align-items: center;
		gap: rem(36);
		justify-content: space-between;

		@media (max-width: $tablet) {
			justify-content: center;
		}

		padding: rem(18) 0;
		@include adaptiveValue('padding-left', 32, 16, 0, 1440, 375);
		@include adaptiveValue('padding-right', 32, 16, 0, 1440, 375);
		min-height: rem(88);

		&--mobile {
			display: flex;
			flex-direction: column-reverse;
			gap: rem(10);
			align-items: center;
		}

		&__policy {
			text-align: center;
			font-size: rem(12);
			line-height: 134%;
			letter-spacing: 0.336px;
		}

		&__left {
			display: flex;
			align-items: center;
			@include adaptiveValue('gap', 24, 10, 0, 1440, 375);

			@media (max-width: $tablet) {
				flex-direction: column-reverse;
			}
		}

		&__logo {
			width: rem(48);
			height: rem(30);

			img {
				object-fit: contain;
			}

			@media (max-width: $mobile) {
				width: rem(36);
				height: rem(24);
			}
		}

		&__text {
			font-size: rem(16);
			font-weight: 500;
			line-height: 100%;
			letter-spacing: 0.16px;

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
			}

			@media (min-width: $tablet) {
				display: flex;
				align-items: center;
				gap: rem(24);

				&::before {
					content: '';
					display: block;
					background-color: color('white', 0.32);
					height: rem(24);
					width: rem(1);
				}
			}

			@media (max-width: $tablet) {
				text-align: center;
			}

			@media (max-width: $mobile) {
				font-size: rem(12);
			}

			@media (max-width: $mobileSmall) {
				font-weight: 400;
			}
		}

		&__privacy-policy {
			font-size: rem(16);
			font-weight: 500;
			line-height: 100%;
			letter-spacing: 0.16px;

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
			}

			@media (max-width: $mobile) {
				font-size: rem(12);
			}
		}
	}
</style>
