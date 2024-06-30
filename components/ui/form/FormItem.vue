<script lang="ts">
import { type InjectionKey } from 'vue';

export const FORM_ITEM_INJECTION_KEY = Symbol() as InjectionKey<string>;
</script>

<script lang="ts" setup>
import { provide, useAttrs } from 'vue';
import { useId } from 'radix-vue';
import { cn } from '@/lib/utils';

defineOptions({
	inheritAttrs: false,
});

const id = useId();
provide(FORM_ITEM_INJECTION_KEY, id);

const { class: className, ...rest } = useAttrs();
</script>

<template>
	<div class="form-item" :class="cn(className ?? '')" v-bind="rest">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.form-item {
	display: flex;
	flex-direction: column;
	@include adaptiveValue('gap', 12, 4, 0, 1440, 375);
}
</style>
