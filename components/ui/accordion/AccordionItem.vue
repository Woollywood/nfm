<script setup lang="ts">
import { AccordionItem, type AccordionItemProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<AccordionItemProps & { class?: string }>();
</script>

<template>
	<AccordionItem class="accordion-item" v-bind="props" :class="cn('border-b', props.class ?? '')">
		<slot />
	</AccordionItem>
</template>

<style lang="scss" scoped>
.accordion-item {
	display: flex;
	flex-direction: column;

	padding-bottom: rem(25);
	border-bottom: rem(2) solid color('purple-1');

	@media (max-width: $tablet-xl) {
		padding-bottom: rem(15);
	}

	&:not(:last-child) {
		margin-bottom: rem(26);

		@media (max-width: $tablet-xl) {
			margin-bottom: rem(14);
		}
	}
}
</style>
