<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { cn } from '@/lib/utils';

const props = defineProps<{
	defaultValue?: string | number;
	modelValue?: string | number;
}>();

const emits = defineEmits<{
	(e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
	passive: true,
	defaultValue: props.defaultValue,
});
</script>

<template>
	<textarea class="textarea-control" v-model="modelValue" :class="cn($attrs.class ?? '')" />
</template>

<style lang="scss" scoped>
.textarea-control {
	resize: none;
	@include adaptiveValue('height', 128, 80, 0, 1440, 375);
	@include adaptiveValue('border-radius', 8, 4, 0, 1440, 375);
	background-color: color('white');

	@include adaptiveValue('padding-top', 16, 12, 0, 1440, 375);
	@include adaptiveValue('padding-bottom', 16, 12, 0, 1440, 375);
	@include adaptiveValue('padding-left', 16, 12, 0, 1440, 375);
	@include adaptiveValue('padding-right', 16, 12, 0, 1440, 375);

	color: color('black');
	@include adaptiveValue('font-size', 18, 14, 0, 1440, 375);
	font-weight: 500;
	line-height: 120%;
}
</style>
