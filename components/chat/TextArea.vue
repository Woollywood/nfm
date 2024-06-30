<script lang="ts" setup>
	type Emits = {
		(e: 'send', message: string): void;
	};

	const emits = defineEmits<Emits>();

	const modelValue = defineModel<string>();

	function sendMessage() {
		emits('send', modelValue.value!);
	}
</script>

<template>
	<div class="general-wrapper">
		<textarea
			class="resize-none input bg-transparent w-full rounded-[24px] z-10 border border-solid border-[var(--ui-color-blue-4)] relative flex"
			v-model="modelValue" />
		<!-- <div class="textarea-wrapper">
			<div class="input-wrapper">
				<div class="input">
					<div
						class="input-field"
						tabindex="0"
						contenteditable
						@input.prevent="input"
						@keydown.enter.prevent="sendMessage"
						v-html="modelValue"
						@focus="focus"
						@blur="blur"
						ref="inputElement"></div>
					{{ modelValue }}
				</div>
				<span v-show="!isFocused && !modelValue?.length" class="placeholder">{{ placeholder }}</span>
			</div>
		</div> -->
		<button class="button z-20 flex-shrink-0" @click.prevent="sendMessage">
			<SvgIcon name="send" />
		</button>
	</div>
</template>

<style lang="scss" scoped>
	.general-wrapper {
		width: 100%;

		@media (max-width: $mobile) {
			display: flex;
			align-items: center;
			gap: rem(8);
		}
	}

	.input-field {
		width: 100%;
		height: 100%;
	}

	.textarea-wrapper {
		flex: 1 1 auto;
		width: 100%;
		display: grid;
		overflow: hidden;

		@media (max-width: $mobile) {
			padding: rem(12) 0;
		}
	}

	.input-wrapper {
		position: relative;
		display: flex;
		overflow: hidden;

		border-radius: rem(24);
		border: rem(1) solid color('blue-4');
	}

	.button {
		&:hover {
			transform: scale(1.1);
		}

		width: rem(64);
		height: rem(64);
		border-radius: 50%;
		background-color: color('blue-5');
		transition: transform 0.3s ease-in-out;

		display: flex;
		justify-content: center;
		align-items: center;

		@media (min-width: $mobile) {
			position: absolute;
			right: rem(24);
			bottom: rem(16);
		}

		@media (max-width: $tablet-xl) {
			width: rem(40);
			height: rem(40);
		}

		svg {
			width: rem(28);
			height: rem(28);
			fill: color('white');
			transform: translateX(10%);

			@media (max-width: $tablet-xl) {
				width: rem(16);
				height: rem(16);
			}
		}
	}

	.placeholder {
		position: absolute;
		top: rem(24);
		left: rem(24);

		@media (max-width: $mobile) {
			top: 50%;
			transform: translateY(-50%);
			left: rem(12);
		}

		font-family: SFPro, sans-serif;
		color: color('blue-5');
		font-size: rem(26);
		line-height: 124%;
		letter-spacing: rem(-0.13);

		@media (max-width: $tablet-xl) {
			font-size: rem(15);
			letter-spacing: rem(-0.15);
		}

		@media (max-width: $mobile) {
			font-size: rem(13);
			letter-spacing: rem(-0.13);
		}
	}

	.input {
		padding: rem(24) rem(24);
		padding-right: calc(rem(96));
		background-color: transparent;
		overflow: auto;
		width: 100%;
		max-width: 100%;
		display: flex;

		min-height: rem(160);
		max-height: rem(180);

		@media (max-width: $tablet-xl) {
			min-height: rem(104);
			max-height: rem(124);
		}

		@media (max-width: $mobile) {
			align-items: center;
			min-height: rem(40);
			max-height: rem(96);
		}

		&::-webkit-scrollbar {
			width: 0;
		}

		&::-webkit-scrollbar-track {
			background-color: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background-color: transparent;
			border: none;
		}

		font-family: SFPro, sans-serif;
		color: color('white');
		font-size: rem(24);
		line-height: 124%;
		letter-spacing: rem(-0.13);
		word-break: break-all;

		@media (max-width: $tablet-xl) {
			padding-right: calc(rem(72));
			font-size: rem(16);
			letter-spacing: rem(-0.15);
		}

		@media (max-width: $mobile) {
			padding: rem(8) rem(12);
			letter-spacing: rem(-0.13);
		}

		@media (max-width: $mobileSmall) {
			align-items: center;
		}
	}
</style>
