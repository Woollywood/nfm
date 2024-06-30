const purpleBackgroundStyles = `
	background-color:hsla(224,100%,14%,1);
	background-image:
	radial-gradient(at 63% 44%, hsla(289,100%,27%,0.59) 0px, transparent 50%),
	radial-gradient(at 26% 90%, hsla(240,75%,30%,0.31) 0px, transparent 50%),
	radial-gradient(at 7% 11%, hsla(240,100%,2%,1) 0px, transparent 50%);
`;

const greenBackgroundStyles = `
	background-color:hsla(77,100%,4%,1);
	background-image:
	radial-gradient(at 81% 13%, hsla(83,49%,1%,1) 0px, transparent 50%),
	radial-gradient(at 11% 36%, hsla(120,100%,0%,1) 0px, transparent 50%),
	radial-gradient(at 50% 47%, hsla(120,83%,32%,0.44) 0px, transparent 50%),
	radial-gradient(at 71% 69%, hsla(130,83%,16%,0.48) 0px, transparent 50%);
`;

const blueBackgroundStyles = `
	background-color:hsla(227,47%,2%,1);
	background-image:
	radial-gradient(at 84% 79%, hsla(206,100%,11%,1) 0px, transparent 50%),
	radial-gradient(at 78% 32%, hsla(227,54%,10%,0.6) 0px, transparent 50%),
	radial-gradient(at 36% 34%, hsla(212,98%,47%,0.46) 0px, transparent 50%),
	radial-gradient(at 34% 75%, hsla(206,69%,7%,1) 0px, transparent 50%),
	radial-gradient(at 58% 64%, hsla(166,100%,40%,0.57) 0px, transparent 50%);
`;

const defaultBackgroundStyles = `
	background-color: #000;
`;

const transparentBackgroundStyles = `
	background-color: transparent;
`;

const feedbackBackgroundStyles = `
	background-color: #051421;
`;

const blurBackgroundStyles = `
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(32px);
`;

const blurDarkBackgroundStyles = `
	background: rgba(0, 0, 0, 0.86);
	backdrop-filter: blur(32px);
`;

export const DEFAULT_BACKGROUND_INDEX = 0;
export const TRANSPARENT_BACKGROUND_INDEX = 1;
export const PURPLE_BACKGROUND_INDEX = 2;
export const GREEN_BACKGROUND_INDEX = 3;
export const BLUE_BACKGROUND_INDEX = 4;
export const FEEDBACK_BACKGROUND_INDEX = 5;
export const BLUR_BACKGROUND_INDEX = 6;
export const BLUR_DARK_BACKGROUND_INDEX = 7;

export const backgroundStyles = [
	defaultBackgroundStyles,
	transparentBackgroundStyles,
	purpleBackgroundStyles,
	greenBackgroundStyles,
	blueBackgroundStyles,
	feedbackBackgroundStyles,
	blurBackgroundStyles,
	blurDarkBackgroundStyles,
];

export function defineHeaderConfig(backgroundIndex, transparency = 0.72) {
	const pageName = getPageName();

	if (backgroundIndex === undefined) {
		backgroundIndex = DEFAULT_BACKGROUND_INDEX;
	}

	const background = backgroundStyles[backgroundIndex];

	return {
		logoPath: `/header/desktop/header-${pageName}-main-logo-desktop.svg`,
		logoPathLaptop: `/header/laptop/header-${pageName}-main-logo-laptop.svg`,
		logoPathMobile: `/header/mobile/header-${pageName}-main-logo-mobile.svg`,
		titlePath: `/header/desktop/header-${pageName}-title-desktop.svg`,
		titlePathLaptop: `/header/laptop/header-${pageName}-title-laptop.svg`,
		titlePathMobile: `/header/mobile/header-${pageName}-title-mobile.svg`,
		closeIconName: `close--${pageName}`,
		transparency,
		absolute: false,
		filter: false,
		backgroundStyles: background,
		styles: {},

		modalCelebritiesMobile: false,
	};
}

export function defineLayoutConfig(backgroundIndex) {
	const pageName = getPageName();

	if (backgroundIndex === undefined) {
		backgroundIndex = DEFAULT_BACKGROUND_INDEX;
	}

	const background = backgroundStyles[backgroundIndex];

	return {
		backgroundStyles: background,
		arrowNavName: `arrow-top--${pageName}`,
		footer: true,
		header: true,
	};
}

export function getScrollbarWidth(element) {
	return window.innerWidth - element.clientWidth;
}

export function getPageName() {
	const route = useRoute();
	return route.name;
}

export function hasNestedRoutes() {
	return useRoute().name.split('-').length === 1 ? false : true;
}

export function getPageNameDir() {
	const route = useRoute().name.split('-');

	if (route.length === 1) {
		return useRoute().name.split('-')[0];
	} else {
		const name = useRoute().name;

		if (name.includes('id')) {
			const nameArr = name.split('-');
			return nameArr.slice(0, -1).join('/');
		}

		return route.reduce((result, currentDir, index) => {
			if (index < route.length - 1) {
				return (result += `${currentDir}/`);
			} else {
				return (result += currentDir);
			}
		}, '');
	}
}

export function checkConfigData(configProp, defineFunc) {
	if (configProp) {
		return configProp;
	} else {
		return defineFunc();
	}
}

function getSeoMeta() {
	const SEO_META_DEFAULT_PHRASE = 'Full-service Marketing & Public Relations Agency | NFM';
	const page = getPageName();

	if (page === 'index') {
		return SEO_META_DEFAULT_PHRASE;
	} else {
		return `${getPageName()} | ${SEO_META_DEFAULT_PHRASE}`;
	}
}

export function setSeoMeta() {
	useSeoMeta({
		title: getSeoMeta(),
	});
}

export async function googleMapsInit(apiKey) {
	const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&v=weekly`;
	window.initMap = Function.prototype;

	const fetchData = await fetch(scriptUrl);
	const textData = await fetchData.text();
	eval(textData);
}
