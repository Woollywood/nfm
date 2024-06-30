<template>
	<Offcanvas
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@close="RouterBack(animationStore)"
		@loaded="loaded"
		class="canvas-photos"
		data-canvas-layout
		:style="{ overflow: hasNestedRoutes() ? 'hidden' : 'auto' }"
		ref="canvasRef">
		<template #default="{ layoutConfigData }">
			<div class="layer-content">
				<div class="photos container container--photos fade-up fade-up--layout">
					<div class="photos__content">
						<div
							class="photos__row"
							v-for="(photoRow, index) in photosRows"
							:key="index"
							:class="{
								multi: photoRow.type === 'mixed',
								tight: photoRow.type === 'tight',
								wide: photoRow.type === 'wide',
							}">
							<div class="photos__row-multi-wrapper" v-if="photoRow.type === 'mixed'">
								<div
									class="photos__row-multi"
									v-for="(photoRowMulti, index) in photoRow.rows"
									:key="index"
									:data-types-sequence="getMixedTypes(photoRowMulti)">
									<div
										class="photos__col"
										v-for="(photoColMulti, index) in photoRowMulti.columns"
										:key="index"
										:class="{
											tight: photoColMulti.type === 'tight',
											wide: photoColMulti.type === 'wide',
										}">
										<NuxtLink
											class="photo"
											v-for="photo in photoColMulti.images"
											:to="`/photos/gallery/${photo.id}`"
											:key="photo.id"
											:data-detail-photo-from="photo.id"
											@click="photoClick">
											<div class="photo__img ibg">
												<CustomImg :src="photo.imagePath" />
											</div>
										</NuxtLink>
									</div>
								</div>
								<div class="photos__row-multi-center-wrapper" v-if="isMobile">
									<div
										class="photos__row-multi-center"
										v-for="(photoRowMulti, index) in photoRow.rows"
										:key="index"
										:data-types-sequence="getMixedTypes(photoRowMulti)">
										<div
											class="photos__col"
											v-for="(photoColMulti, index) in photoRowMulti.columns"
											:key="index"
											:class="{
												tight: photoColMulti.type === 'tight',
												wide: photoColMulti.type === 'wide',
											}">
											<div
												class="photo-wrapper"
												v-for="photo in photoColMulti.images"
												:key="photo.id">
												<NuxtLink
													class="photo"
													v-if="photoColMulti.type === 'wide'"
													:to="`/photos/gallery/${photo.id}`"
													:data-detail-photo-from="photo.id"
													@click="photoClick">
													<div class="photo__img ibg">
														<CustomImg :src="photo.imagePath" />
													</div>
												</NuxtLink>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								v-else
								class="photos__col"
								v-for="(photoCol, index) in photoRow.columns"
								:key="index"
								:class="{ tight: photoCol.type === 'tight', wide: photoCol.type === 'wide' }">
								<NuxtLink
									class="photo"
									v-for="photo in photoCol.images"
									:key="photo.id"
									:to="`/photos/gallery/${photo.id}`"
									:data-detail-photo-from="photo.id"
									@click="photoClick">
									<div class="photo__img ibg">
										<CustomImg :src="photo.imagePath" />
									</div>
								</NuxtLink>
							</div>
						</div>
					</div>
				</div>
			</div>
			<CustomArrowNavigate
				v-if="layoutConfigData.arrowNavName"
				class="layer-arrow-navigate"
				:name="layoutConfigData.arrowNavName" />
		</template>
		<template #nested>
			<slot />
		</template>
	</Offcanvas>
</template>

<script>
	import { ref } from 'vue';
	import { PURPLE_BACKGROUND_INDEX } from '@/utils/config';
	import { TRANSPARENT_BACKGROUND_INDEX } from '@/utils/config';

	import { RouterBack, fromHomeAnimation } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { BASE_URL } from '@/constants/api';

	export default {
		async setup() {
			const { isMobile } = useDevice();
			const headerConfig = ref(defineHeaderConfig(PURPLE_BACKGROUND_INDEX));
			const animationStore = useAnimationStore();
			const layoutConfig = ref(defineLayoutConfig(PURPLE_BACKGROUND_INDEX));

			headerConfig.value.filter = true;

			const { data: rows } = await useFetch('api/v1/photos/rows', {
				baseURL: BASE_URL,
			});

			const photosRows = computed(() => {
				let mixedDirectionTights = 'left';
				let currentId = 0;

				return rows.value.map((row) => {
					const tightLength = row.tight_photos.length;
					const wideLength = row.wide_photos.length;

					if (tightLength === 0) {
						return {
							type: 'wide',
							columns: [
								{
									type: 'wide',
									images: [
										{
											id: currentId++,
											imagePath: row.wide_photos[0].photo,
										},
									],
								},
								{
									type: 'wide',
									images: [
										{
											id: currentId++,
											imagePath: row.wide_photos[1].photo,
										},
									],
								},
							],
						};
					} else if (wideLength === 0) {
						return {
							type: 'tight',
							columns: [
								{
									type: 'tight',
									images: [
										{
											id: currentId++,
											imagePath: row.tight_photos[0].photo,
										},
										{
											id: currentId++,
											imagePath: row.tight_photos[1].photo,
										},
									],
								},
								{
									type: 'tight',
									images: [
										{
											id: currentId++,
											imagePath: row.tight_photos[2].photo,
										},
										{
											id: currentId++,
											imagePath: row.tight_photos[3].photo,
										},
									],
								},
							],
						};
					} else {
						switch (mixedDirectionTights) {
							case 'left':
								mixedDirectionTights = 'right';

								return {
									type: 'mixed',
									rows: [
										{
											columns: [
												{
													type: 'tight',
													images: [
														{
															id: currentId++,
															imagePath: row.tight_photos[0].photo,
														},
														{
															id: currentId++,
															imagePath: row.tight_photos[1].photo,
														},
													],
												},
												{
													type: 'wide',
													images: [
														{
															id: currentId++,
															imagePath: row.wide_photos[0].photo,
														},
													],
												},
											],
										},
										{
											columns: [
												{
													type: 'tight',
													images: [
														{
															id: currentId++,
															imagePath: row.tight_photos[2].photo,
														},
														{
															id: currentId++,
															imagePath: row.tight_photos[3].photo,
														},
													],
												},
												{
													type: 'wide',
													images: [
														{
															id: currentId++,
															imagePath: row.wide_photos[1].photo,
														},
													],
												},
											],
										},
									],
								};
							case 'right':
								mixedDirectionTights = 'left';

								return {
									type: 'mixed',
									rows: [
										{
											columns: [
												{
													type: 'wide',
													images: [
														{
															id: currentId++,
															imagePath: row.wide_photos[0].photo,
														},
													],
												},
												{
													type: 'tight',
													images: [
														{
															id: currentId++,
															imagePath: row.tight_photos[0].photo,
														},
														{
															id: currentId++,
															imagePath: row.tight_photos[1].photo,
														},
													],
												},
											],
										},
										{
											columns: [
												{
													type: 'wide',
													images: [
														{
															id: currentId++,
															imagePath: row.wide_photos[1].photo,
														},
													],
												},
												{
													type: 'tight',
													images: [
														{
															id: currentId++,
															imagePath: row.tight_photos[2].photo,
														},
														{
															id: currentId++,
															imagePath: row.tight_photos[3].photo,
														},
													],
												},
											],
										},
									],
								};
						}
					}
				});
			});

			return { photosRows, headerConfig, layoutConfig, isMobile, animationStore, RouterBack };
		},
		methods: {
			getMixedTypes(row) {
				return row.columns.map((r) => r.type).join(' ');
			},
			loaded() {
				const { canvasRef } = this.$refs;

				setTimeout(() => {
					const canvas = canvasRef.$el;
					this.animationStore.setPageLayout(canvas);

					fromHomeAnimation(this.animationStore, null);
				}, 0);
			},
			photoClick(event) {
				this.animationStore.setPageCard(event.target.closest('[data-detail-photo-from]'));
			},
		},
		watch: {
			$route(to, from) {
				if (hasNestedRoutes()) {
					this.headerConfig.backgroundStyles =
						defineHeaderConfig(TRANSPARENT_BACKGROUND_INDEX).backgroundStyles;
				} else {
					this.headerConfig.backgroundStyles = defineHeaderConfig(PURPLE_BACKGROUND_INDEX).backgroundStyles;
				}
			},
		},
		mounted() {
			window.addEventListener(
				'fromDetail',
				() => {
					this.headerConfig.backgroundStyles = defineHeaderConfig().backgroundStyles;
				},
				{ once: true }
			);
		},
	};
</script>

<style lang="scss" scoped>
	.photo {
		display: block;
	}
	.photos {
		@media (min-width: $tablet-xl) {
			padding-top: rem(40);
		}

		&__content {
			display: flex;
			flex-direction: column;
			gap: rem(8);

			@media (min-width: $mobile) {
				gap: rem(16);
			}

			@media (min-width: $tablet) {
				gap: rem(24);
			}

			&:not(:last-child) {
				@include adaptiveValue('margin-bottom', 48, 64, 0, 1440, 375);
			}
		}

		&__row {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: rem(8);

			@media (min-width: $mobile) {
				gap: rem(16);
			}

			@media (min-width: $tablet) {
				gap: rem(24);
			}

			@media (max-width: $mobileSmall) {
				grid-template-columns: 1fr;
			}

			&.multi {
				grid-template-columns: 1fr;
			}

			&.tight {
			}

			&.wide {
				@media (max-width: $mobileSmall) {
					display: grid;
					grid-template-columns: 1fr 1fr;
				}
			}
		}

		&__row-multi-wrapper {
			display: flex;
			flex-direction: column;
			gap: rem(8);

			@media (min-width: $mobile) {
				gap: rem(16);
			}

			@media (min-width: $tablet) {
				gap: rem(24);
			}
		}

		&__row-multi {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: rem(8);

			@media (min-width: $mobile) {
				gap: rem(16);
			}

			@media (min-width: $tablet) {
				gap: rem(24);
			}

			&:nth-child(1) {
				order: 1;
			}

			&:nth-child(2) {
				order: 3;
			}

			@media (max-width: $mobileSmall) {
				.photos__col.wide {
					display: none;
				}

				grid-template-columns: 1fr;
			}
		}

		&__row-multi-center-wrapper {
			order: 2;
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: rem(8);

			@media (min-width: $mobile) {
				gap: rem(16);
			}

			@media (min-width: $tablet) {
				gap: rem(24);
			}

			.photos__row-multi {
				grid-template-columns: 1fr;
			}

			.photos__col.tight {
				display: none;
			}
		}

		&__row-multi-center {
		}

		&__col {
			&.tight {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: rem(8);

				@media (min-width: $mobile) {
					gap: rem(16);
				}

				@media (min-width: $tablet) {
					gap: rem(24);
				}

				.photo {
					aspect-ratio: 302 / 424;
				}
			}

			&.wide {
				.photo {
					aspect-ratio: 628 / 424;

					@media (max-width: $mobileSmall) {
						aspect-ratio: 176 / 120;
					}
				}
			}
		}

		&__actions {
			display: flex;
			justify-content: center;
		}

		&__arrow-top {
			display: flex;
			justify-content: center;
			align-items: center;

			svg {
				@include adaptiveValue('width', 96, 46, 0, 1440, 375);
				aspect-ratio: 1;
			}
		}
	}

	.photo {
		cursor: pointer;
		position: relative;
		@include adaptiveValue('border-radius', 32, 12, 0, 1440, 375);
		overflow: hidden;
		-webkit-mask-image: -webkit-radial-gradient(white, black);
		width: 100%;

		&__img {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			img {
				transition: transform 0.3s ease-in-out;
			}

			&:hover {
				img {
					transform: scale(1.1);
				}
			}
		}
	}
</style>
