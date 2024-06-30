<script lang="ts" setup>
	import { gsap } from 'gsap';
	import { useVideoModalWorkStore } from '@/store/workVideo';

	const videoModal = useVideoModalWorkStore();
	const modelValue = defineModel<boolean>();
	const realModelValue = ref(false);

	const root = ref();
	const background = ref();
	const content = ref();

	watch(
		() => modelValue.value,
		() => {
			videoModal.isOpened = modelValue.value!;
		}
	);

	watch(
		() => videoModal.isOpened,
		() => {
			modelValue.value = videoModal.isOpened;
		}
	);

	watch(
		() => modelValue.value,
		async () => {
			if (modelValue.value) {
				realModelValue.value = true;
				await nextTick();

				gsap.fromTo(
					background.value,
					{
						opacity: 0,
					},
					{
						opacity: 1,
						duration: 0.6,
						ease: 'power3.out',
					}
				);

				gsap.fromTo(
					content.value,
					{
						y: '100%',
					},
					{
						y: 0,
						duration: 0.6,
						ease: 'power3.out',
					}
				);
			} else {
				await nextTick();

				gsap.fromTo(
					background.value,
					{
						opacity: 1,
					},
					{
						opacity: 0,
						duration: 0.6,
						ease: 'power3.out',
					}
				);

				gsap.fromTo(
					content.value,
					{
						y: 0,
					},
					{
						y: '100%',
						duration: 0.6,
						ease: 'power3.out',

						onComplete: () => {
							realModelValue.value = false;
						},
					}
				);
			}
		},
		{
			immediate: true,
		}
	);
</script>

<template>
	<div
		class="fixed z-[1000] top-0 left-0 w-full h-full flex items-center justify-center"
		v-if="realModelValue"
		ref="root">
		<div class="absolute top-0 left-0 w-full h-full bg-black z-0" @click.stop ref="background"></div>
		<div
			class="flex items-center justify-center relative z-[2] aspect-video max-w-[calc(1440px+32px)] max-h-[calc(100svh-var(--header-height)-6svh)] px-4 w-full h-auto"
			ref="content">
			<slot></slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.dummy {
	}
</style>
