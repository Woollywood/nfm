<script setup>
	import { useForm } from 'vee-validate';
	import { toTypedSchema } from '@vee-validate/zod';
	import * as z from 'zod';
	import { Service } from '@/api/service';
	import { BASE_URL } from '@/constants/api';

	const { data } = await useFetch('api/v1/pages/careers', {
		baseURL: BASE_URL,
	});

	const service = new Service();

	const accordions = await service.getDataFromUrl('careers/positions');
	const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);

	const formSchema = toTypedSchema(
		z.object({
			firstName: z.string().min(2).max(50),
			lastName: z.string().min(2).max(50),
			email: z.string().email(),
			phone: z.string().regex(phoneRegex, 'Invalid Number!'),
			city: z.string().min(2).max(50),
			state: z.string().min(2).max(50),
			zip: z.string().min(2).max(50),
			portfolio: z.string().optional(),
			linkedIn: z.string().optional(),
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
			<div class="content-wrapper">
				<div class="text-wrapper">
					<h1 class="title">
						<span>Wish you</span>
						<span>were here<span class="colored">?</span></span>
					</h1>
					<div class="text" v-html="data.description"></div>
				</div>
				<transition name="slide-fade">
					<button class="button button--back" v-if="isApplied" @click="back">Back to all jobs</button>
				</transition>
			</div>
		</template>
		<template #form>
			<transition @leave="fadeOut" @enter="fadeIn" :css="false">
				<Accordion v-if="!isApplied" class="careers__accordion" type="multiple" collapsible>
					<AccordionItem v-for="accordion in accordions" :key="accordion.id" :value="`item-${accordion.id}`">
						<AccordionTrigger>{{ accordion.name }}</AccordionTrigger>
						<AccordionContent @apply="apply(accordion.id)">
							<div class="content-container" v-html="accordion.description"></div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</transition>
			<transition @enter="fadeIn" @leave="fadeOut" :css="false">
				<form v-if="isApplied" class="form-element careers__accordion" @submit="onSubmit">
					<div class="form-element__fields">
						<FormField v-slot="{ componentField }" name="firstName">
							<FormItem>
								<FormLabel type="careers">First name:</FormLabel>
								<FormControl>
									<Input type="text" placeholder="" v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
						<FormField v-slot="{ componentField }" name="lastName">
							<FormItem>
								<FormLabel type="careers">Last name:</FormLabel>
								<FormControl>
									<Input type="text" placeholder="" v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
						<FormField v-slot="{ componentField }" name="email">
							<FormItem>
								<FormLabel type="careers">E-mail:</FormLabel>
								<FormControl>
									<Input type="text" placeholder="" v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
						<FormField v-slot="{ componentField }" name="phone">
							<FormItem>
								<FormLabel type="careers">Phone:</FormLabel>
								<FormControl>
									<Input type="text" placeholder="" v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
						<FormField v-slot="{ componentField }" name="city">
							<FormItem>
								<FormLabel type="careers">City:</FormLabel>
								<FormControl>
									<Input type="text" placeholder="" v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
						<FormField v-slot="{ componentField }" name="state">
							<FormItem>
								<FormLabel type="careers">State:</FormLabel>
								<FormControl>
									<Input type="text" placeholder="" v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
						<FormField v-slot="{ componentField }" name="zip">
							<FormItem>
								<FormLabel type="careers">ZIP:</FormLabel>
								<FormControl>
									<Input type="text" placeholder="" v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
						<FormField v-slot="{ componentField }" name="desiredPay">
							<FormItem>
								<FormLabel type="careers">Desired Pay:</FormLabel>
								<FormControl>
									<Input type="text" placeholder="" v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
						<FormField v-slot="{ componentField }" name="portfolio">
							<FormItem>
								<FormLabel type="careers">Website, Blog, or Portfolio:</FormLabel>
								<FormControl>
									<Input type="text" placeholder="" v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
						<FormField v-slot="{ componentField }" name="linkedIn">
							<FormItem>
								<FormLabel type="careers">LinkedIn Profile URL:</FormLabel>
								<FormControl>
									<Input type="text" placeholder="" v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
					<div class="form-actions">
						<button class="button">Submit</button>
					</div>
				</form>
			</transition>
		</template>
	</FeedbackContent>
</template>

<script>
	import { gsap } from 'gsap';

	export default {
		data() {
			return { isApplied: false };
		},
		methods: {
			apply(index) {
				this.isApplied = true;
			},

			fadeOut(el, done) {
				const feedbackTop = document.querySelector('[data-feedback-top]');
				const feedbackHeight = feedbackTop.offsetHeight;
				feedbackTop.style.height = feedbackHeight + 'px';

				gsap.set(el, {
					position: 'absolute',
					width: el.offsetWidth,
					height: el.offsetHeight,
				});

				gsap.to(el, {
					x: '-100%',
					duration: 0.6,
					onComplete: done,
					ease: 'power3.out',
				});
			},

			fadeIn(el) {
				gsap.from(el, {
					x: '100%',
					ease: 'power3.out',

					onComplete: () => {
						const feedbackTop = document.querySelector('[data-feedback-top]');
						const feedbackHeight = feedbackTop.offsetHeight;
						feedbackTop.style.height = feedbackHeight + 'px';

						feedbackTop.style.height = '';
						const feedbackRealHeight = feedbackTop.offsetHeight;
						gsap.fromTo(
							feedbackTop,
							{
								height: feedbackHeight,
							},
							{
								height: feedbackRealHeight,
								onComplete: () => {
									feedbackTop.style.height = '';
								},
							}
						);
					},
				});
			},

			back() {
				this.isApplied = false;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.content-wrapper {
		display: flex;
		flex-direction: column;
		gap: rem(32);
	}

	.content-container {
		::v-deep(> *) {
			&:not(:last-child) {
				margin-bottom: rem(20);

				@media (max-width: $mobile) {
					margin-bottom: rem(16);
				}
			}
		}

		::v-deep(h3) {
			color: color('white');
			font-size: rem(16);
			font-weight: 700;
			line-height: 125%;
			letter-spacing: rem(-0.16);
			margin-bottom: rem(20);

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
				line-height: 133%;
				letter-spacing: rem(-0.15);
			}

			@media (max-width: $mobile) {
				font-size: rem(13);
				line-height: 124%;
				letter-spacing: rem(-0.13);

				margin-bottom: rem(16);
			}
		}

		::v-deep(p) {
			padding-right: rem(48);
			color: color('white');
			font-size: rem(16);
			line-height: 125%;
			letter-spacing: rem(-0.16);

			@media (max-width: $tablet-xl) {
				padding-right: rem(56);
				font-size: rem(15);
				line-height: 133%;
				letter-spacing: rem(-0.15);
			}

			@media (max-width: $mobile) {
				padding-right: 0;
				font-size: rem(13);
				line-height: 124%;
				letter-spacing: rem(-0.13);
			}
		}

		::v-deep(li) {
			display: flex;
			align-items: center;
			gap: rem(16);
			padding-left: rem(10);

			color: color('white');
			font-size: rem(16);
			line-height: 125%;
			letter-spacing: rem(-0.16);

			@media (max-width: $tablet-xl) {
				font-size: rem(15);
				line-height: 133%;
				letter-spacing: rem(-0.15);
			}

			@media (max-width: $mobile) {
				gap: rem(8);
				padding-left: rem(8);
				font-size: rem(13);
				line-height: 124%;
				letter-spacing: rem(-0.13);
			}

			&::before {
				content: '';
				background-color: color('purple-1');
				flex: 0 0 rem(6);
				aspect-ratio: 1;
				border-radius: 50%;
				align-self: flex-start;
				margin-top: calc((em(16) / 2));

				@media (max-width: $tablet-xl) {
					margin-top: calc((em(15, 16) / 2));
				}

				@media (max-width: $mobile) {
					margin-top: calc((em(13, 16) / 2));
					flex: 0 0 rem(4);
				}
			}
		}
	}

	.text-wrapper {
	}

	.slide-fade-enter-active {
		transition: all 0.3s ease-out;
	}

	.slide-fade-leave-active {
		transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
	}

	.slide-fade-enter-from,
	.slide-fade-leave-to {
		transform: translateX(20px);
		opacity: 0;
	}

	.button {
		width: 100%;

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

		&--back {
			background-color: transparent;
			border: rem(2) solid color('purple-1');
			transition: all 0.3s ease-in-out;

			&:hover {
				background-color: color('purple-1');
			}
		}
	}

	.careers {
		&__accordion {
			max-width: rem(608);
			width: 100%;

			@media (min-width: $mobile) {
				padding-right: rem(80);
			}

			@media (max-width: $tablet-xl) {
				max-width: rem(560);
			}

			@media (max-width: $mobile) {
				max-width: unset;
			}
		}
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
			@include adaptiveValue('margin-bottom', 16, 6, 0, 1440, 375);
		}

		.colored {
			color: color('purple-1');
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

		&__fields {
			display: flex;
			flex-direction: column;
			@include adaptiveValue('gap', 22, 20, 0, 1440, 375);

			&:not(:last-child) {
				@include adaptiveValue('margin-bottom', 32, 16, 0, 1440, 375);
			}
		}
	}

	.form-actions {
	}
	.send-button {
		@include adaptiveValue('width', 192, 128, 0, 1440, 375);

		&__icon {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translate(50%, -50%);

			@include adaptiveValue('width', 36, 24, 0, 1440, 375);
			@include adaptiveValue('height', 24, 16, 0, 1440, 375);
		}
	}
</style>
