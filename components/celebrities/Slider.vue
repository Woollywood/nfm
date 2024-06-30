<script setup>
	const props = defineProps({
		slideIndex: {
			type: Number,
			default: 0,
		},
		slides: {
			type: Array,
			required: true,
		},
	});

	const computedSlides = computed(() =>
		props.slides.map((slide) => ({
			...slide,
			signature: slide.autograph,
		}))
	);

	const emits = defineEmits({
		'update:slideIndex': null,
	});

	function slideChangeHandler(event) {
		emits('update:slideIndex', event);
	}
</script>

<template>
	<CustomSliderHorizontal
		:slideIndex="slideIndex"
		:slides="computedSlides"
		class="cels-slider"
		@slideChange="slideChangeHandler">
		<template #slideBackground="{ slide }">
			<div class="slide-background" :style="{ background: slide.css }"></div>
		</template>
		<template #sliderCard="{ slide }">
			<CelebritiesSliderCard :slide="slide" />
		</template>
	</CustomSliderHorizontal>
</template>

<style lang="scss" scoped>
	.slide-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
