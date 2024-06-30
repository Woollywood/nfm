<script setup>
	import { ref } from 'vue';
	import { RouterBack, fromHomeAnimation } from '@/animations/layouts';
	import { useAnimationStore } from '@/store/home.store';
	import { Service } from '@/api/service';
	const service = new Service();

	const animationStore = useAnimationStore();
	const router = useRouter();

	const headerConfig = ref(defineHeaderConfig());
	const layoutConfig = ref(defineLayoutConfig());
	headerConfig.value.filter = true;

	const canvas = ref(null);
	const gridItems = ref(null);

	const games = await service.getDataFromUrl('games');

	const loaded = () => {
		setTimeout(() => {
			animationStore.setPageLayout(canvas.value.$el);
			fromHomeAnimation(animationStore, null);
		}, 0);
	};

	async function clickLink(id, slug) {
		animationStore.setPageCard(gridItems.value[id]);
		await router.push({ path: `/games/${slug}` });
	}
</script>

<template>
	<Offcanvas
		:headerConfigProp="headerConfig"
		:layoutConfigProp="layoutConfig"
		@close="RouterBack(animationStore)"
		@loaded="loaded"
		ref="canvas"
		class="nested-canvas game-canvas !overflow-hidden">
		<template #default="{ layoutConfigData }">
			<div class="layer-content">
				<div class="flex flex-col items-center fade-up fade-up--layout">
					<div
						class="game w-full flex justify-center items-center px-4"
						v-for="game in games"
						:key="game.id"
						:data-detail-card-from="game.id">
						<div class="preview-wrapper ibg" ref="gridItems" @click="clickLink(game.id, game.slug)">
							<CustomImg :src="game.image" />
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

<style lang="scss" scoped>
	.layer-content {
		padding-top: rem(72);

		@media (max-width: $tablet-xl) {
			padding-top: 0;
		}

		@media (max-width: $mobile) {
			margin-bottom: 0 !important;
			padding-top: rem(12);
		}

		iframe {
			width: 100%;
			height: 100%;
		}
	}

	.game {
		&:not(:last-child) {
			@include adaptiveValue('margin-bottom', 26, 14, 0, 1920, 375);
		}
	}

	.preview-wrapper {
		cursor: pointer;
		max-width: rem(640);
		width: 100%;
		border-radius: rem(24);
		overflow: hidden;
		aspect-ratio: 640 / 334;
	}
</style>
