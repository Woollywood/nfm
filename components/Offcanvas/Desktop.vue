<template>
	<div
		class="app-offcanvas"
		:class="{ loading: loading, hasNested: hasNestedRoutes() }"
		data-scroll-wrapper
		@keydown.esc="close"
		@loaded="$emit('loaded')"
		ref="canvas">
		<OffcanvasContent :headerConfig="headerConfigProp" :layoutConfig="layoutConfigProp" @close="close">
			<slot :layoutConfigData="layoutConfigProp" />
			<template #nested>
				<slot name="nested" />
			</template>
		</OffcanvasContent>
	</div>
</template>

<script>
	import PerfectScrollbar from 'perfect-scrollbar';
	import 'perfect-scrollbar/css/perfect-scrollbar.css';

	export default {
		data() {
			return {
				scrollTop: 0,
			};
		},
		props: {
			headerConfigProp: {
				type: Object,
				required: false,
			},
			layoutConfigProp: {
				type: Object,
				required: false,
			},
		},
		emits: {
			close: null,
			loaded: null,
		},

		provide() {
			return {
				loading: computed(() => this.loading),
				visible: computed(() => this.visible),
				scrollTop: computed(() => this.scrollTop),
			};
		},
		methods: {
			close() {
				if (!hasNestedRoutes()) {
					this.visible = false;
				}

				this.$emit('close');
			},

			scroll(e) {
				this.scrollTop = e.target.scrollTop;
			},
		},

		mounted() {
			const { canvas } = this.$refs;
			const ps = new PerfectScrollbar(canvas, {
				suppressScrollX: true,
			});

			canvas.addEventListener('wheel', (e) => {
				if (hasNestedRoutes()) {
					canvas.scrollTop = this.scrollTop;
				}
			});

			canvas.addEventListener('scroll', (e) => {
				this.scrollTop = e.target.scrollTop;
			});

			canvas.addEventListener('resize', (e) => {
				this.scrollTop = e.target.scrollTop;
			});
		},

		setup(props, context) {
			const visible = ref(false);
			const loading = ref(true);

			onMounted(() => {
				setTimeout(() => {
					loading.value = false;
					context.emit('loaded');
					visible.value = true;
				}, 0);
			});

			return { visible, loading };
		},
	};
</script>

<style lang="scss" scoped>
	.app-offcanvas {
		position: absolute;
		z-index: 5;
		top: 0;
		left: 0;
		width: 100%;
		height: 100svh;
		transition: opacity 0.3s ease, transform 0.3s ease;
		opacity: 0;

		overflow: hidden !important;

		&.detailAnimationEnd {
			backdrop-filter: blur(12px);
		}
	}
</style>
