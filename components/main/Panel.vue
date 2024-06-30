<template>
	<div class="app-panel">
		<div class="app-panel__body">
			<NuxtLink
				v-for="item in sortedItems"
				:key="item.id"
				class="app-panel__item"
				:to="item.link"
				:target="item.title.toLowerCase() !== 'chat' ? `_blank` : null"
				@click="clickLink(item, $event)"
				data-link-wrapper
				:data-panel-item="item.title.toLowerCase()">
				<div class="app-panel__img-box">
					<div class="app-panel__img ibg">
						<CustomImg :src="item.image" />
					</div>
				</div>
			</NuxtLink>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			items: {
				type: Array,
				required: true,
			},
		},
		emits: {
			clickLink: null,
		},
		computed: {
			sortedItems() {
				return this.items.slice().sort((a, b) => a.sorting - b.sorting);
			},
		},
		methods: {
			clickLink(link, event) {
				if (link.link.toLowerCase().includes('chat')) this.$emit('clickLink', event);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.app-panel {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: rem(22) rem(32);
		@include adaptiveValue('border-radius', 48, 32, 0, 1440, 375);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 100%);
		overflow: hidden;

		@media (max-width: $mobile) {
			padding: rem(16) rem(24);
		}

		&__body {
			display: flex;
			align-items: center;
			column-gap: var(--ratio);

			@media (max-width: $mobile) {
				column-gap: calc(var(--ratio--mobile) * 0.75);
			}
		}

		&__item {
			&:hover {
				.app-panel__img-box {
					transform: scale(1.1);
				}
			}

			&.tablet {
				@media (max-width: $mobile) {
					display: none;
				}
			}
		}

		&__img-box {
			position: relative;
			width: var(--ratio);
			aspect-ratio: 1;
			transition: transform 0.3s ease-in-out;

			@media (max-width: $mobile) {
				width: var(--ratio--mobile);
			}
		}

		&__img {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border-radius: calc(28 / 128 * 100%);
			overflow: hidden;

			@media (max-width: $mobile) {
				border-radius: calc(12 / 48 * 100%);
			}
		}
	}

	[data-panel-item='chat'] {
		transform: scale(1.3);

		img {
			object-fit: contain;
		}

		@media (max-width: $mobile) {
			display: none;
		}
	}
</style>
