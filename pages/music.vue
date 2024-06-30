<script setup>
	import { GREEN_BACKGROUND_INDEX } from '@/utils/config';
	import { RouterBack, fromHomeAnimation } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { Service } from '@/api/service';
	const service = new Service();

	const animationStore = useAnimationStore();
	const headerConfig = ref(defineHeaderConfig(GREEN_BACKGROUND_INDEX));
	const layoutConfig = ref(defineLayoutConfig(GREEN_BACKGROUND_INDEX));

	const canvasRef = ref(null);

	headerConfig.value.filter = true;

	const playlists = await service.getDataFromUrl('music/playlists');
	const songs = await service.getDataFromUrl('music/songs');

	function loaded() {
		setTimeout(() => {
			const canvas = canvasRef.value.$el;
			animationStore.setPageLayout(canvas);

			fromHomeAnimation(animationStore, null);
		}, 0);
	}

	const picks = computed(() =>
		playlists.map((playlist) => ({
			id: playlist.id,
			title: {
				avatar: playlist.teammate.thumbnail,
				text: `${playlist.teammate.name.split(' ')[0]}'s Top Picks`,
			},
			items: playlist.songs.map((song) => ({
				preview: song.image,
				songName: song.artist.name,
				groupName: song.name,
			})),
		}))
	);

	const slider = computed(() =>
		songs
			.filter((song) => song.show_in_slider)
			.slice(0)
			.sort((a, b) => a.sorting - b.sorting)
			.map((song) => ({
				id: song.id,
				imageName: song.image,
				songName: song.artist.name,
				groupName: song.name,
			}))
	);
</script>

<template>
	<Offcanvas
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@close="RouterBack(animationStore)"
		@loaded="loaded"
		ref="canvasRef">
		<template #default="{ layoutConfigData }">
			<div class="layer-content">
				<div class="picks fade-up fade-up--layout">
					<MusicSlider class="picks__slider" :slides="slider" />
					<div class="picks__top-picks top-picks">
						<MusicPick class="top-picks__pick" v-for="pick in picks" :key="pick.id" :pick="pick" />
					</div>
				</div>
			</div>
			<CustomArrowNavigate
				v-if="layoutConfigData.arrowNavName"
				class="layer-arrow-navigate"
				:name="layoutConfigData.arrowNavName" />
		</template>
	</Offcanvas>
</template>

<script>
	export default {
		data() {
			return {
				picks: null,
				slider: null,
			};
		},
	};
</script>

<style lang="scss" scoped>
	.picks {
		position: relative;
		z-index: 1;

		min-width: 0;
		* {
			min-width: 0;
		}

		padding: rem(8) rem(16) 0;

		@media (min-width: $mobile) {
			padding: rem(8) rem(80) 0;
		}

		@media (min-width: $tablet-xl) {
			padding: rem(8) rem(120) 0;
		}

		&__background {
			position: absolute;
			z-index: 0;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		&__slider {
			&:not(:last-child) {
				margin-bottom: rem(118);

				@media (max-width: $tablet-xl) {
					margin-bottom: rem(68);
				}

				@media (max-width: $mobile) {
					margin-bottom: rem(48);
				}
			}

			@media (max-width: $mobile) {
				@include adaptiveValue('margin-left', -120, -16, 0, 1440, 375);
				@include adaptiveValue('margin-right', -120, -16, 0, 1440, 375);
			}
		}

		&__top-picks {
			&:not(:last-child) {
				@include adaptiveValue('margin-bottom', 76, 100, 0, 1440, 375);
			}
		}
	}

	.top-picks {
		display: grid;
		column-gap: rem(24);
		row-gap: rem(86);

		@media (max-width: $tablet-xl) {
			column-gap: rem(16);
			row-gap: rem(72);
		}

		@media (max-width: $mobile) {
			row-gap: rem(60);
		}

		@media (min-width: $mobileSmall) {
			grid-template-columns: repeat(4, 1fr);

			@media (max-width: $tablet-xl) {
				grid-template-columns: repeat(3, 1fr);
			}

			@media (max-width: $mobile) {
				grid-template-columns: 1fr 1fr;
			}
		}

		&__pick {
		}
	}
</style>
