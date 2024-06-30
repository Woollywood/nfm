<template>
	<div class="arrow">
		<button v-scroll-top class="arrow__button">
			<SvgIcon class="arrow__icon" :name="name" />
		</button>
	</div>
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				required: true,
			},
		},
	};
</script>

<style lang="scss" scoped>
	.arrow {
		display: flex;
		justify-content: center;
		align-items: center;

		@media (max-width: $mobile) {
			display: none;
		}

		&__button {
			display: flex;

			&:hover {
				.arrow__icon {
					transform: scale(1.4);
				}
			}
		}

		&__icon {
			@include adaptiveValue('width', 96, 56, 0, 1440, 375);
			aspect-ratio: 1;
			transition: transform 0.3s ease;
		}
	}
</style>
