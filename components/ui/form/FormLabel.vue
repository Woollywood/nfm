<script lang="ts" setup>
import { useAttrs } from 'vue';
import { Label, type LabelProps } from 'radix-vue';
import { useFormField } from './useFormField';
import { cn } from '@/lib/utils';

defineOptions({
	inheritAttrs: false,
});

interface IProps extends LabelProps {
	type?: string;
}

const props = defineProps<IProps>();

const { error, formItemId } = useFormField();
const { class: className, ...rest } = useAttrs();
</script>

<template>
	<Label
		class="label-control"
		:class="
			cn('block text-left', type === 'careers' ? 'careers' : '', error && 'text-destructive', className ?? '')
		"
		:for="formItemId"
		v-bind="rest">
		<slot />
	</Label>
</template>

<style lang="scss" scoped>
.label-control {
	font-family: SFPro, sans-serif;
	font-size: rem(20);
	letter-spacing: rem(-0.2);
	color: color('blue-3');
	line-height: 100%;

	&.careers {
		color: color('purple-1');
	}

	@media (max-width: $tablet-xl) {
		font-size: rem(13);
	}

	@media (max-width: $mobile) {
		letter-spacing: rem(-0.13);
	}
}
</style>
