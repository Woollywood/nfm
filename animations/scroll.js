export function smooth({ timing, scrollFunc, duration }) {
	let start = performance.now();

	requestAnimationFrame(function smooth(time) {
		let timeFraction = (time - start) / duration;
		if (timeFraction > 1) timeFraction = 1;

		let progress = timing(timeFraction);

		scrollFunc(progress);

		if (timeFraction < 1) {
			requestAnimationFrame(smooth);
		}
	});
}

export function quad(timeFraction) {
	return Math.pow(timeFraction, 2);
}

export function scrollTop(elem, options) {
	const { progress, scrollFrom } = options;
	elem.scrollTop = (1 - progress) * scrollFrom;
}
