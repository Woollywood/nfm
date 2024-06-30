<script lang="ts" setup>
import { ErrorMessage } from 'vee-validate';
import { toValue } from 'vue';
import { useFormField } from './useFormField';

const { name, formMessageId } = useFormField();
</script>

<template>
	<ErrorMessage class="message-control text-destructive" :id="formMessageId" as="p" :name="toValue(name)" />
</template>

<style lang="scss" scoped>
.message-control {
	font-family: SFPro, sans-serif;
	@include adaptiveValue('font-size', 20, 13, 0, 1440, 375);
	@include adaptiveValue('letter-spacing', -0.2, -0.13, 0, 1440, 375);
}
</style>
