import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

export function sliderContentInit({ slider, sliderArrowPrev, sliderArrowNext }) {
	new Swiper(slider, {
		modules: [Navigation],
		loop: true,

		navigation: {
			nextEl: sliderArrowNext,
			prevEl: sliderArrowPrev,
		},

		breakpoints: {
			320: {
				slidesPerView: 2.4,
				spaceBetween: 12,
			},
			420: {
				slidesPerView: 3,
				spaceBetween: 16,
			},
			556: {
				slidesPerView: 4,
				spaceBetween: 16,
			},
			868: {
				slidesPerView: 5,
				spaceBetween: 16,
			},
			1440: {
				slidesPerView: 6,
				spaceBetween: 24,
			},
		},
	});
}

export function sliderLogosInit({ slider, sliderArrowPrev, sliderArrowNext }) {
	new Swiper(slider, {
		slidesPerView: 'auto',

		modules: [Navigation],
		loop: true,

		navigation: {
			nextEl: sliderArrowNext,
			prevEl: sliderArrowPrev,
		},

		breakpoints: {
			320: {
				spaceBetween: 8,
			},
			768: {
				spaceBetween: 16,
			},
		},
	});
}
