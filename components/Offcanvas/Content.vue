<template>
	<div class="canvas-content__background-wrapper" data-canvas-background>
		<div class="canvas-content__background" :style="backgroundStyles"></div>
	</div>

	<div class="canvas-content__body" data-canvas-body ref="body" :style="{ '--scroll-top': `${scrollTop}px` }">
		<AppHeader
			v-if="layoutConfig.header"
			class="canvas-content__header"
			@close="$emit('close')"
			:headerConfig="headerConfig"
			:class="{
				absolute: headerConfig.absolute,
				filter: headerConfig.filter,
				scrolled: scrollTop,
				nested: hasNestedRoutes(),
			}"
			ref="header"
			data-canvas-header />

		<div class="canvas-content__content" data-canvas-content-wrapper>
			<slot :layoutConfig="layoutConfig"></slot>
		</div>

		<AppFooter v-if="layoutConfig.footer" class="canvas-content__footer" />
		<slot name="nested" />
	</div>
</template>

<script>
	export default {
		props: {
			headerConfig: {
				type: Object,
				required: false,
			},
			layoutConfig: {
				type: Object,
				required: false,
			},
		},
		data() {
			return { backgroundStyles: null };
		},
		emits: {
			close: null,
		},
		inject: ['loading', 'visible', 'scrollTop'],

		methods: {
			getHeaderHeight() {
				const { body, header } = this.$refs;

				const headerElement = header.$el;
				const height = headerElement.offsetHeight;
				body.style.cssText += `--header-height: ${height}px`;
			},
		},
		created() {
			this.backgroundStyles = this.layoutConfig.backgroundStyles;
		},
		mounted() {
			if (this.layoutConfig.header) {
				this.getHeaderHeight();
				window.addEventListener('resize', this.getHeaderHeight);
			}
		},
		unmounted() {
			if (this.layoutConfig.header) {
				window.removeEventListener('resize', this.getHeaderHeight);
			}
		},
	};
</script>

<style lang="scss" scoped>
	.canvas-content {
		&__body {
			display: flex;
			flex-direction: column;
			min-height: 100svh;
		}

		&__header {
			position: sticky;
			top: 0;
			z-index: 10;

			&.absolute {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
			}
		}

		&__content {
			position: relative;
			flex: 1 1 auto;
			display: grid;
		}

		&__footer {
			position: relative;
			z-index: 2;
		}

		&__background-wrapper {
			position: sticky;
			top: 0;
			opacity: 0;
			transition: opacity 0.3s ease-in-out;

			.layoutAnimationStart & {
				opacity: 1;
			}
		}

		&__background {
			position: absolute;
			z-index: 0;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
		}
	}
</style>
