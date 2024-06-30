import { smooth, quad, scrollTop } from '@/animations/scroll';

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive('scroll-top', {
		mounted(el) {
			el.addEventListener('click', (e) => {
				const scrollWrapper = el.closest('[data-scroll-wrapper]');

				const scrollFrom = scrollWrapper.scrollTop;
				const scrollTo = 0;

				smooth({
					duration: 600,
					timing: (timeFraction) => quad(timeFraction),
					scrollFunc: (progress) => {
						const options = {
							scrollFrom,
							scrollTo,
							progress,
						};

						return scrollTop(scrollWrapper, options);
					},
				});
			});
		},
	});
});
