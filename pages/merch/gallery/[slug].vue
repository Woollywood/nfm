<script setup>
	import { gsap } from 'gsap';
	import { ref } from 'vue';
	import { BLUR_DARK_BACKGROUND_INDEX } from '@/utils/config';
	import { toDetailPage, fromDetailPage } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { Service } from '@/api/service';
	const service = new Service();

	const animationStore = useAnimationStore();
	const headerConfig = ref(defineHeaderConfig());
	const layoutConfig = ref(defineLayoutConfig(BLUR_DARK_BACKGROUND_INDEX));

	headerConfig.value.absolute = true;
	headerConfig.value.filter = false;
	layoutConfig.value.footer = false;
	layoutConfig.value.header = false;

	const canvasRef = ref(null);
	const cardRef = ref(null);
	const jokeRef = ref(null);

	const data = await service.getDataFromUrl(`merch`);

	function loaded() {
		setTimeout(() => {
			const canvas = canvasRef.value.$el;
			animationStore.setDetailPageLayout(canvas);

			toDetailPage(animationStore, null);
		}, 0);
	}

	function handleClick() {
		const cardEl = cardRef.value.$el;
		const jokeEl = jokeRef.value.$el;
		gsap.to(cardEl, {
			y: '-20%',
			opacity: '0',
			ease: 'power3.out',
			duration: 0.6,
			onComplete: () => {
				cardEl.style.transform = '';
			},
		});
		gsap.fromTo(
			jokeEl,
			{
				opacity: '0',
				y: '20',
			},
			{
				opacity: '1',
				y: '0',
				ease: 'power3.out',
				duration: 0.6,
				onStart: () => {
					jokeEl.classList.add('animation-start');
				},
				onComplete: () => {
					jokeEl.classList.add('wiggle-animation');
				},
			}
		);
	}
</script>

<template>
	<Offcanvas
		class="nested-canvas"
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@loaded="loaded"
		@close="fromDetailPage(animationStore, '/merch')"
		ref="canvasRef">
		<MerchLayout
			class="merch-card-position real card-animation"
			:data="data"
			@clickCard="handleClick"
			ref="cardRef" />
		<MerchJokeError :imgPath="data[0].error_banner.image" class="merch-card-position joke" ref="jokeRef" />
	</Offcanvas>
</template>

<style lang="scss" scoped>
	.nested-canvas {
		z-index: 4;
		top: var(--scroll-top);
		overflow: hidden;
		transition: opacity 0.6s ease-in-out;

		opacity: 0;
		visibility: hidden;

		&.detail-animation-end {
			opacity: 1;
			visibility: visible;
		}
	}

	.merch-card-position {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		height: 100%;
	}

	.joke {
		opacity: 0;
		visibility: hidden;

		&.animation-start {
			visibility: visible;
		}
	}
</style>
