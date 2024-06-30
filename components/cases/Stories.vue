<template>
	<div class="stories-slider js-stories-slider swiper">
		<div class="swiper-wrapper">
			<div class="stories-slider__slider swiper-slide" v-for="story in stories" :key="story.imagePath">
				<div class="stories-slider__body">
					<div class="stories-slider__image ibg">
						<CustomImg :src="`img/stories/${story.imagePath}`" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Swiper } from 'swiper';
import 'swiper/css';

import { stories } from '~/data/cases/stories.data.js';

export default {
	data() {
		return {
			stories,
		};
	},
	mounted() {
		new Swiper('.js-stories-slider', {
			spaceBetween: 12,
			breakpoints: {
				320: {
					slidesPerView: 5.2,
				},
				720: {
					slidesPerView: 6,
				},
				1280: {
					spaceBetween: 16,
					slidesPerView: 7,
				}
			}
		});
	},
};
</script>

<style lang="scss" scoped>
.stories-slider {
	@media (max-width: $mobileSmall) {
		overflow: visible;
	}

	&__slider {
	}

	&__body {
		width: 100%;
		aspect-ratio: 1;
	}

	&__image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		overflow: hidden;
	}
}
</style>
