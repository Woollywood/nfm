import { gsap } from 'gsap';
import { useVideoModalStore } from '@/store/videoModal';
import { useVideoModalWorkStore } from '@/store/workVideo';

const fromHomeEvent = new Event('fromHomeStart');
const fromHomeEventEnd = new Event('fromHomeEnd');
const fromDetailEvent = new Event('fromDetail');

function progressHandler(duration, callback) {
	let progress = 0;
	const progressTimer = setInterval(() => {
		callback(progress, progressTimer);
		progress++;

		if (progress >= 100) {
			clearInterval(progressTimer);
		}
	}, duration / 100);
}

function readRoute() {
	const route = useRoute();
	const path = route.name;

	let parts = path.slice(0).split('-');
	let pathTo = '/';

	const indexOfId = parts.indexOf('id');
	const indexOfSlug = parts.indexOf('slug');

	const indexPage = indexOfId !== -1 ? indexOfId : indexOfSlug ? indexOfSlug : null;

	if (indexPage !== -1) {
		parts = parts.slice(0, indexPage);
	}

	if (parts.length > 1) {
		pathTo += parts.slice(0, -1).join('/');
	}

	return pathTo;
}

function scrollToPhoto(animationStore) {
	const pageLayout = animationStore.getPageLayout;
	const detailPageLayout = animationStore.getDetailPageLayout;

	const slider = detailPageLayout.querySelector('[data-slider-preview]').querySelectorAll('.swiper-slide');
	const activeIndex = Array.from(slider).findIndex((slider) => slider.classList.contains('swiper-slide-active'));
	const photoLink = pageLayout.querySelectorAll('[data-detail-photo-from]')[activeIndex];

	pageLayout.scrollTop = photoLink.offsetTop - window.innerHeight / 2 + photoLink.offsetHeight / 2;
}

function toPhotosPage(animationStore, path) {
	const router = useRouter();
	const DURATION = 0.6;

	scrollToPhoto(animationStore);
	sliderThumbsAnimation();
	document.addEventListener(
		'thumbsAnimationBackStart',
		(e) => {
			sliderPreviewAnimation();
		},
		{ once: true }
	);

	async function sliderThumbsAnimation() {
		const event = new Event('thumbsAnimationBackStart');

		const pageLayout = animationStore.getPageLayout;
		const detailPageLayout = animationStore.getDetailPageLayout;

		const photosTo = detailPageLayout.querySelectorAll('[data-detail-photo-to].swiper-slide-fully-visible');
		const viewportIndexes = Array.from(photosTo).map((photo) => +photo.dataset.detailPhotoTo);
		const photosFrom = Array.from(pageLayout.querySelectorAll('[data-detail-photo-from]')).filter((photo) =>
			viewportIndexes.includes(+photo.dataset.detailPhotoFrom)
		);
		const photosFromAll = pageLayout.querySelectorAll('[data-detail-photo-from]');
		const copyList = Array.from(photosTo).map((photo) => photo.cloneNode(true));

		gsap.set(copyList, {
			position: 'absolute',
			zIndex: 201,
			opacity: '0',
			visibility: 'hidden',
			onComplete: () => {
				for (const copy of copyList) {
					document.body.append(copy);
				}
			},
		});

		await getReadyPhotos(copyList);

		gsap.set([photosFrom, photosTo], {
			opacity: '0',
			visibility: 'hidden',
		});

		gsap.set(copyList, {
			opacity: '',
			visibility: '',
		});

		copyList.forEach((copy, index) => {
			const fromBox = photosFrom[index].getBoundingClientRect();
			const toBox = photosTo[index].getBoundingClientRect();

			gsap.fromTo(
				copy,
				{
					left: toBox.left,
					top: toBox.top,
					width: toBox.width,
					height: toBox.height,
				},
				{
					left: fromBox.left,
					top: fromBox.top,
					width: fromBox.width,
					height: fromBox.height,

					ease: 'power3.out',
					duration: DURATION,

					onStart: () => {
						document.dispatchEvent(event);
						copy.querySelector('.slider-thumbs__image-wrapper').style.width = '100%';
						animationStore.setDetailAnimationEnd(false);
					},

					onComplete: () => {
						animationStore.setDetailAnimationStart(false);
						copy.remove();

						gsap.set([photosFromAll, photosTo], {
							opacity: '',
							visibility: '',
						});

						router.push({ path });
					},
				}
			);
		});
	}

	async function sliderPreviewAnimation() {
		const pageLayout = animationStore.getPageLayout;
		const detailPageLayout = animationStore.getDetailPageLayout;

		const slider = detailPageLayout.querySelector('[data-slider-preview]').querySelectorAll('.swiper-slide');
		const activeIndex = Array.from(slider).findIndex((slider) => slider.classList.contains('swiper-slide-active'));

		const slidePreview = detailPageLayout
			.querySelector('.swiper-slide-active')
			.querySelector('[data-slide-preview]');
		const slidePreviewBox = slidePreview.getBoundingClientRect();
		const slidePreviewCopy = slidePreview.cloneNode(true);

		const photoLink = pageLayout.querySelectorAll('[data-detail-photo-from]')[activeIndex];
		const photoLinkBox = photoLink.getBoundingClientRect();

		gsap.set(slidePreviewCopy, {
			position: 'absolute',
			zIndex: 200,
			opacity: '0',
			visibility: 'hidden',
		});

		document.body.append(slidePreviewCopy);
		await new Promise((resolve) => (slidePreviewCopy.querySelector('img').onload = () => resolve()));

		gsap.set(slidePreview, {
			opacity: '0',
			visibility: 'hidden',
		});

		gsap.set(slidePreviewCopy, {
			opacity: '',
			visibility: '',
		});

		gsap.fromTo(
			slidePreviewCopy,

			{
				left: slidePreviewBox.left,
				top: slidePreviewBox.top,
				width: slidePreviewBox.width,
				height: slidePreviewBox.height,
			},
			{
				left: photoLinkBox.left,
				top: photoLinkBox.top,
				width: photoLinkBox.width,
				height: photoLinkBox.height,

				ease: 'power3.out',
				duration: DURATION,

				onComplete: () => {
					gsap.set(photoLink, {
						opacity: '',
						visibility: '',
					});

					slidePreviewCopy.remove();
				},
			}
		);
	}
}

export async function getReadyPhotos(photos) {
	const result = await Promise.all(
		photos.map(
			(photo) =>
				new Promise((resolve) => {
					photo.querySelector('img').onload = () => resolve();
				})
		)
	);
}

export function RouterBack(animationStore, path = null) {
	const videoModalStore = useVideoModalStore();
	const videoModalStoreWork = useVideoModalWorkStore();

	if (videoModalStoreWork.isOpened) {
		videoModalStoreWork.isOpened = false;
		return;
	}

	if (videoModalStore.isOpened) {
		videoModalStore.isOpened = false;
		return;
	}

	if (!path) {
		path = readRoute();
	}

	if (path.includes('photos')) {
		toPhotosPage(animationStore, path);
	} else {
		if (path === '/') {
			toHomeAnimation(path, animationStore);
		} else {
			fromDetailPage(animationStore, path);
		}
	}
}

export function fromHomeAnimation(animationStore, callback) {
	const homeLayout = animationStore.getHomeLayout;
	const pageLayout = animationStore.getPageLayout;

	const canvasBody = pageLayout.querySelector('[data-canvas-body]');
	const canvasBackground = pageLayout.querySelector('[data-canvas-background]');

	const homeGrid = homeLayout.querySelector('[data-animation-element="grid"]');
	const homePanel = homeLayout.querySelector('[data-animation-element="panel"]');

	gsap.to(canvasBackground, {
		opacity: 1,
		duration: 0.6,
		ease: 'power3.out',
		onStart: () => {
			document.dispatchEvent(fromHomeEvent);
			gsap.set(pageLayout, {
				opacity: 1,
				visibility: 'visible',
			});
			progressHandler(800, (progress, timerId) => {
				if (progress >= 20) {
					clearInterval(timerId);
					gsap.to(canvasBody, {
						display: '',
						opacity: '',
						duration: 0.8,
						ease: 'power3.out',
					});
				}
			});
			pageLayout.classList.add('animation-start');
			animationStore.setLayoutAnimationStart(true);
		},
		onComplete: () => {
			document.dispatchEvent(fromHomeEventEnd);
			pageLayout.classList.add('animation-end');
			animationStore.setLayoutAnimationEnd(true);
			pageLayout.style.width = '';
			pageLayout.style.height = '';
			if (callback) {
				callback();
			}
		},
	});

	gsap.to(homePanel, {
		opacity: 0,
		y: '100%',
		duration: 0.4,
		ease: 'power3.out',
	});

	gsap.to(homeGrid, {
		scale: 0.85,
		opacity: 0,
		duration: 0.6,
		ease: 'power3.out',
	});
}

export function toHomeAnimation(path, animationStore) {
	const router = useRouter();

	const homeLayout = animationStore.getHomeLayout;
	const pageLayout = animationStore.getPageLayout;

	const canvasBackground = pageLayout.querySelector('[data-canvas-background]');

	const homeGrid = homeLayout.querySelector('[data-animation-element="grid"]');
	const homePanel = homeLayout.querySelector('[data-animation-element="panel"]');
	const fadeElements = pageLayout.querySelectorAll('.fade-up');
	const header = pageLayout.querySelector('[data-app-header]');

	gsap.set(homePanel, {
		opacity: 0,
	});

	gsap.set(homeGrid, {
		opacity: 0,
	});

	gsap.to(canvasBackground, {
		opacity: 0,
		visibility: 'hidden',
		duration: 0.6,
		ease: 'power3.out',

		onStart: () => {
			gsap.to(header, {
				y: '-100%',
				duration: 0.6,
				ease: 'power3.out',
			});

			fadeElements.forEach((element) => {
				gsap.to(element, {
					overflow: 'hidden',
					y: `${pageLayout.scrollTop + window.innerHeight}`,
					duration: 0.6,
					ease: 'power3.out',
				});
			});
		},

		onComplete: () => {
			gsap.set(homePanel, {
				opacity: 1,
			});

			gsap.set(homeGrid, {
				scale: 1.15,
				opacity: 1,
			});

			gsap.to(homePanel, {
				y: 0,
				duration: 0.4,
				ease: 'power3.out',
			});

			gsap.to(homeGrid, {
				scale: 1,
				opacity: 1,
				duration: 0.6,
				ease: 'power3.out',
			});

			animationStore.setLayoutAnimationEnd(false);
			animationStore.setLayoutAnimationStart(false);
			router.push({ path });
		},
	});
}

export function toDetailPage(animationStore) {
	const detailPageLayout = animationStore.getDetailPageLayout;
	const layoutBackground = detailPageLayout.querySelector('[data-canvas-background]');
	const canvasContentWrapper = detailPageLayout.querySelector('[data-canvas-content-wrapper]');

	gsap.set(layoutBackground, {
		opacity: 0,

		onStart: () => {
			animationStore.setDetailAnimationStart(true);
		},
	});

	gsap.set(canvasContentWrapper, {
		y: '100%',
	});

	gsap.to(layoutBackground, {
		opacity: 1,
		duration: 0.6,
		ease: 'power3.out',

		onStart: () => {
			gsap.set(detailPageLayout, {
				opacity: 1,
				visibility: 'visible',
			});
		},
		onComplete: () => {
			animationStore.setDetailAnimationEnd(true);
		},
	});

	gsap.to(canvasContentWrapper, {
		y: 0,
		duration: 0.6,
		ease: 'power3.out',
	});
}

export function fromDetailPage(animationStore, path, callback) {
	const router = useRouter();
	const pageLayout = animationStore.getPageLayout;
	const detailPageLayout = animationStore.getDetailPageLayout;
	const layoutBackground = detailPageLayout.querySelector('[data-canvas-background]');
	const canvasContentWrapper = detailPageLayout.querySelector('[data-canvas-content-wrapper]');
	const header = pageLayout.querySelector('[data-app-header]');

	gsap.to(layoutBackground, {
		opacity: 0,
		duration: 0.6,
		ease: 'power3.out',
	});

	gsap.to(canvasContentWrapper, {
		y: '100%',
		duration: 0.6,
		ease: 'power3.out',

		onStart: () => {
			window.dispatchEvent(fromDetailEvent);
			animationStore.setDetailAnimationEnd(false);
			header.classList.remove('nested');
		},
		onComplete: () => {
			animationStore.setDetailAnimationStart(false);
			if (callback) {
				callback();
			}
			router.push({ path });
		},
	});
}
