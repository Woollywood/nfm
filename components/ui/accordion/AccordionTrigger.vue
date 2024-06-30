<script setup lang="ts">
import { AccordionHeader, AccordionTrigger, type AccordionTriggerProps } from 'radix-vue';
import { ChevronDown } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps<AccordionTriggerProps & { class?: string }>();
</script>

<template>
	<AccordionHeader class="flex accordiont-header" as="div">
		<AccordionTrigger
			v-bind="props"
			class="trigger-wrapper"
			:class="
				cn(
					'flex items-center w-full justify-between transition-all [&[data-state=open]>svg]:rotate-180',
					props.class
				)
			">
			<div class="title">
				<slot />
			</div>
			<SvgIcon class="icon closed" name="accordion-plus" />
			<SvgIcon class="icon opened" name="accordion-minus" />
		</AccordionTrigger>
	</AccordionHeader>
</template>

<style lang="scss" scoped>
.trigger-wrapper {
	&:hover {
		.title {
			color: color('purple-1');
		}
	}
}
.title {
	font-family: MuseoSlab, sans-serif;
	font-size: rem(28);
	line-height: 100%;
	transition: color 0.3s ease;

	@media (max-width: $tablet-xl) {
		font-size: rem(18);
	}
}

.icon {
	width: rem(24);
	aspect-ratio: 1;
	transition: opacity 0.3s ease;

	@media (max-width: $tablet-xl) {
		width: rem(16);
	}

	@media (max-width: $mobile) {
		width: rem(14);
	}

	[data-state='closed'] & {
		&.opened {
			opacity: 0;
			visibility: hidden;
			position: absolute;
		}
	}

	[data-state='open'] & {
		&.closed {
			opacity: 0;
			visibility: hidden;
			position: absolute;
		}
	}
}
</style>
