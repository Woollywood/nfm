<script setup lang="ts">
import { AccordionContent, type AccordionContentProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<AccordionContentProps & { class?: string }>();

const emits = defineEmits({
	apply: null,
});
</script>

<template>
	<AccordionContent
		v-bind="props"
		:class="
			cn(
				'overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
				props.class
			)
		">
		<div class="content">
			<div class="text-content">
				<slot />
			</div>
			<button class="button" @click="$emit('apply')">Apply this job</button>
		</div>
	</AccordionContent>
</template>

<style lang="scss" scoped>
.content {
	font-size: rem(16);
	line-height: 124%;
	@include adaptiveValue('letter-spacing', -0.26, -0.13, 0, 1440, 375);
	padding-top: rem(24);
	padding-bottom: rem(47);

	@media (max-width: $tablet-xl) {
		font-size: rem(15);
		line-height: 134%;

		padding-top: rem(20);
		padding-bottom: rem(15);
	}

	@media (min-width: $mobile) {
		font-size: rem(13);
		padding-top: rem(16);
	}
}

.text-content {
	display: flex;
	flex-direction: column;
	@include adaptiveValue('gap', 24, 16, 0, 1440, 375);

	&:not(:last-child) {
		@include adaptiveValue('margin-bottom', 28, 22, 0, 1440, 375);
	}
}

.button {
	justify-self: flex-start;

	@media (max-width: $mobileSmall) {
		width: 100%;
	}

	border-radius: rem(8);
	background-color: color('purple-1');

	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: rem(22) rem(48);

	font-size: rem(20);
	font-weight: 700;
	letter-spacing: rem(-0.2);
	text-transform: uppercase;

	@media (max-width: $tablet-xl) {
		padding: rem(16) rem(32);
		font-size: rem(16);
		letter-spacing: rem(-0.16);
	}

	@media (max-width: $mobile) {
		padding: rem(14) rem(24);
		font-size: rem(13);
		letter-spacing: rem(-0.13);
	}
}
</style>
