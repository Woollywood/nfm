<script lang="ts" setup>
	import { useElementSize } from '@vueuse/core';

	const content = ref<HTMLElement>();
	const left = ref<HTMLElement>();
	const { width: contentWidth, height: contentHeight } = useElementSize(content);
	const { width: leftWidth, height: leftHeight } = useElementSize(left);

	function getContentHeight() {
		content.value!.style.cssText += `--content-height: ${contentHeight}px`;
	}

	function getTitleHeight() {
		content.value!.style.cssText += `--title-height: ${leftHeight}px`;
	}

	function getCssVariables() {
		getContentHeight();
		getTitleHeight();
		window.addEventListener('resize', getContentHeight);
		window.addEventListener('resize', getTitleHeight);

		left.value!.classList.add('aligned');
	}

	onMounted(() => document.addEventListener('fromHomeEnd', getCssVariables, { once: true }));
	onUnmounted(() => {
		window.removeEventListener('resize', getContentHeight);
		window.removeEventListener('resize', getTitleHeight);
	});
</script>

<template>
	<div class="feedback-content" ref="content">
		<div class="feedback-content__left" ref="left">
			<slot name="titles" />
		</div>
		<div class="feedback-content__right">
			<slot name="form" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.feedback-content {
		gap: rem(32);
		margin-bottom: rem(82);

		@media (max-width: $tablet-xl) {
			margin-bottom: rem(48);
		}

		@media (min-width: $mobile) {
			min-height: 32svh;
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: rem(64);
		}

		@media (min-width: $mobile) and (max-width: $tablet-xl) {
			gap: 0;
		}

		@media (max-width: $mobile) {
			display: flex;
			flex-direction: column;
			margin-bottom: rem(64);
		}

		&__left {
			@media (min-width: $mobile) {
				opacity: 0;
				visibility: hidden;
				margin-top: calc(var(--content-height) / 2);
				transform: translateY(calc(var(--title-height) / 2 * -1 + 100%));
				transition: transform 0.3s ease;

				&.aligned {
					opacity: 1;
					visibility: visible;
					transform: translateY(calc(var(--title-height) / 2 * -1));
				}

				padding: 0 rem(32);
				justify-self: center;
				align-self: center;
			}
		}

		&__right {
			position: relative;
			width: 100%;
			justify-self: flex-start;
			display: flex;
			align-items: center;
			overflow: hidden;

			@media (min-width: $tablet-xl) {
				max-width: rem(608);
			}
		}
	}
</style>
