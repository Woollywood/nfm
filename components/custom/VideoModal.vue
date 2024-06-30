<script lang="ts" setup>
	import { useVideoModalStore } from '@/store/videoModal';

	const videoModalStore = useVideoModalStore();

	interface Props {
		src: string;
	}

	const props = defineProps<Props>();
	const modelValue = defineModel<boolean>();

	watch(
		() => modelValue.value,
		() => {
			videoModalStore.isOpened = modelValue.value!;
		}
	);

	watch(
		() => videoModalStore.isOpened,
		() => {
			modelValue.value = videoModalStore.isOpened;
		}
	);
</script>

<template>
	<Transition name="fade-up-modal">
		<div
			class="fixed z-[1000] top-0 left-0 w-full h-full flex justify-center items-center before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black"
			v-if="modelValue">
			<div
				class="flex items-center justify-center relative z-[2] max-h-[calc(100svh-var(--header-height)*2)] aspect-video md:max-w-[calc(min(calc(100vw-32px*4-56px*2),1440px))] px-4 w-full h-auto"
				@click.prevent>
				<CustomLoader class="z-[-1]" />
				<iframe
					:src="props.src"
					class="w-full h-full"
					allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
					frameborder="0"
					allowfullscreen></iframe>
			</div>
		</div>
	</Transition>
</template>

<style lang="scss">
	.fade-up-modal-enter-active,
	.fade-up-modal-leave-active {
		transition: transform 0.3s ease-in-out;
	}

	.fade-up-modal-enter-from,
	.fade-up-modal-leave-to {
		transform: translateY(100%);
	}
</style>
