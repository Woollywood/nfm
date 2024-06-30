<template>
	<button class="button">
		<span class="button__text">
			<slot />
		</span>
		<slot name="icon" />
	</button>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.button {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: rem(96);
	background: linear-gradient(121deg, #0ff 30.09%, #0094ff 77.83%);
	height: rem(64);

	@media (max-width: $tablet-xl) {
		height: rem(40);
		border-radius: rem(64);
	}

	&__text {
		color: color('black-2');
		font-size: rem(24);
		font-weight: 700;
		line-height: 100%;

		@media (max-width: $tablet-xl) {
			font-size: rem(16);
		}
	}
}
</style>
