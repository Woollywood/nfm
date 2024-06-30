<template>
	<button class="button">
		<slot />
	</button>
</template>

<style lang="scss" scoped>
.button {
	border-radius: rem(8);
	background: linear-gradient(121deg, #f4e832 24.78%, #f28f1d 77.83%);
	text-transform: uppercase;

	display: flex;
	justify-content: center;
	align-items: center;

	@include adaptiveValue('min-width', 256, 224, 0, 1440, 375);
	@include adaptiveValue('min-height', 62, 48, 0, 1440, 375);

	color: color('black');
	@include adaptiveValue('font-size', 20, 13, 0, 1440, 375);
	font-weight: 700;
	@include adaptiveValue('letter-spacing', -0.2, 0.13, 0, 1440, 375);
}
</style>
