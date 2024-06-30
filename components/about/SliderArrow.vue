<template>
	<div class="controlls">
		<button class="slider-arrow slider-arrow-prev" ref="sliderArrowPrev">
			<SvgIcon name="arrow-left--about" />
		</button>
		<button class="slider-arrow slider-arrow-next" ref="sliderArrowNext">
			<SvgIcon name="arrow-right--about" />
		</button>
	</div>
</template>

<script>
export default {
	emits: {
		mounted: null,
	},
	mounted() {
		const { sliderArrowPrev, sliderArrowNext } = this.$refs;
		this.$emit('mounted', { sliderArrowPrev, sliderArrowNext });
	},
};
</script>

<style lang="scss" scoped>
.controlls {
	--ratio: 48px;
	--offset: 24px;

	position: absolute;
	z-index: 1;
	top: 50%;
	left: calc((var(--ratio) + var(--offset)) * -1);
	transform: translateY(-50%);
	width: calc(100% + (var(--ratio) + var(--offset)) * 2);
	pointer-events: none;
	transition: opacity 0.3s ease, visibility 0.3s ease;

	@media (max-width: $tablet-xl) {
		--ratio: 32px;
	}

	opacity: 1;
	visibility: visible;

	.controllsHidden & {
		opacity: 0;
		visibility: hidden;
	}

	display: flex;
	align-items: center;
	justify-content: space-between;
}

.slider-arrow {
	display: flex;
	pointer-events: auto;
	overflow: hidden;

	&:hover {
		svg {
			transform: scale(1.6);

			@media (max-width: $tablet-xl) {
				transform: scale(2);
			}
		}
	}

	svg {
		width: var(--ratio);
		aspect-ratio: 1;
		transition: transform 0.3s ease;

		@media (max-width: $tablet-xl) {
			transform: scale(1.4);
		}
	}
}
</style>
