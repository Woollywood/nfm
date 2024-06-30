<script setup lang="ts">
import { useAttrs } from 'vue';
import { useVModel } from '@vueuse/core';
import { cn } from '@/lib/utils';

defineOptions({
	inheritAttrs: false,
});

const props = defineProps<{
	defaultValue?: string | number;
	modelValue?: string | number;
}>();

const emits = defineEmits<{
	(e: 'update:modelValue', payload: string | number): void;
}>();

const { class: className, ...rest } = useAttrs();

const modelValue = useVModel(props, 'modelValue', emits, {
	passive: true,
	defaultValue: props.defaultValue,
});
</script>

<template>
	<input class="input-control" v-model="modelValue" :class="cn(className ?? '')" v-bind="rest" />
</template>

<style lang="scss" scoped>
.input-control {
	height: rem(56);
	border-radius: rem(8);
	background-color: color('white');

	padding: 0 rem(8);
	@include adaptiveValue('padding-left', 16, 12, 0, 1440, 375);
	@include adaptiveValue('padding-right', 16, 12, 0, 1440, 375);

	color: color('black');
	@include adaptiveValue('font-size', 18, 16, 0, 1440, 375);
	font-weight: 500;
	line-height: 120%;

	@media (max-width: $tablet-xl) {
		height: rem(40);
		border-radius: rem(5.333);
	}

	@media (max-width: $mobile) {
		border-radius: rem(4);
	}
}
</style>
