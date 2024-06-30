<script setup>
	import { useForm } from 'vee-validate';
	import { toTypedSchema } from '@vee-validate/zod';
	import * as z from 'zod';
	import { BASE_URL } from '@/constants/api';

	const { data } = await useFetch('api/v1/pages/contact', {
		baseURL: BASE_URL,
	});

	const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);

	const formSchema = toTypedSchema(
		z.object({
			companyName: z.string().min(2).max(50),
			phoneNumber: z.string().regex(phoneRegex, 'Invalid Number!'),
			email: z.string().email(),
			description: z.string().optional(),
		})
	);

	const form = useForm({
		validationSchema: formSchema,
	});

	const onSubmit = form.handleSubmit((values) => {
		console.log('Form submitted!', values);
	});
</script>

<template>
	<FeedbackContent>
		<template #titles>
			<div class="text-wrapper">
				<h1 class="title">
					<span>Wish you</span>
					<span>were here<span class="colored">!</span></span>
				</h1>
				<div class="text" v-html="data.description"></div>
			</div>
		</template>
		<template #form>
			<form class="form-element" @submit="onSubmit">
				<div class="form-element__fields">
					<FormField v-slot="{ componentField }" name="companyName">
						<FormItem>
							<FormLabel>Business/Company</FormLabel>
							<FormControl>
								<Input type="text" placeholder="" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="phoneNumber">
						<FormItem>
							<FormLabel>Phone number:</FormLabel>
							<FormControl>
								<Input type="text" placeholder="" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="email">
						<FormItem>
							<FormLabel>E-mail:</FormLabel>
							<FormControl>
								<Input type="text" placeholder="" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="description">
						<FormItem>
							<FormLabel>Brief Description:</FormLabel>
							<FormControl>
								<Textarea type="text" placeholder="" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
				</div>
				<div class="form-actions">
					<CustomSendButton class="send-button" type="submit">
						<template #default> Submit </template>
						<template #icon>
							<SvgIcon class="send-button__icon" name="airplane" />
						</template>
					</CustomSendButton>
				</div>
			</form>
		</template>
	</FeedbackContent>
</template>

<style lang="scss" scoped>
	.text-wrapper {
	}

	.title {
		display: flex;
		flex-direction: column;
		align-items: center;

		font-family: MuseoSlab, sans-serif;
		font-size: rem(96);
		line-height: 84%;
		@include adaptiveValue('letter-spacing', -1.92, -0.8, 0, 1440, 375);

		@media (max-width: $tablet-xl) {
			font-size: rem(64);
		}

		@media (max-width: $mobile) {
			line-height: 100%;
			font-size: rem(40);
		}

		@media (min-width: $mobile) and (max-width: $tablet) {
			font-size: rem(42);
		}

		&:not(:last-child) {
			@include adaptiveValue('margin-bottom', 16, 4, 0, 1440, 375);
		}

		.colored {
			color: color('blue-3');
		}
	}

	.text {
		font-family: SFPro, sans-serif;
		text-align: center;
		font-size: rem(20);
		line-height: 120%;
		@include adaptiveValue('letter-spacing', -0.2, -0.13);
		max-width: 56%;
		margin: 0 auto;

		@media (max-width: $tablet-xl) {
			font-size: rem(13);
		}

		@media (max-width: $mobile) {
			max-width: 86%;
			line-height: 124%;
		}
	}

	.form-element {
		width: 100%;

		@media (max-width: $tablet-xl) and (min-width: $mobile) {
			padding-right: rem(152);
		}

		&__fields {
			display: flex;
			flex-direction: column;
			gap: rem(22);

			@media (max-width: $tablet-xl) {
				gap: rem(12);
			}

			@media (max-width: $mobile) {
				gap: rem(20);
			}

			&:not(:last-child) {
				margin-bottom: rem(32);

				@media (max-width: $mobile) {
					margin-bottom: rem(16);
				}
			}
		}
	}

	.form-actions {
		display: flex;
		justify-content: center;
	}
	.send-button {
		width: rem(192);

		@media (max-width: $tablet-xl) {
			width: rem(128);
		}

		&__icon {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translate(50%, -50%);
			width: rem(36);
			height: rem(24);

			@media (max-width: $tablet-xl) {
				width: rem(24);
				height: rem(16);
			}
		}
	}
</style>
