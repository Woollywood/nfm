// https://nuxt.com/docs/api/configuration/nuxt-config

const importedScss = [
	'@import "@/assets/styles/mixins.scss";',
	'@import "@/assets/styles/variables.scss";',
	'@import "@/assets/styles/breakpoints.scss";',
].join(' ');

export default defineNuxtConfig({
	// devtools: { enabled: true },

	app: {
		head: {
			viewport: 'width=device-width, initial-scale=1.0, interactive-widget=resizes-content',
			script: [{ src: 'https://polyfill.io/v3/polyfill.min.js?features=default' }],
		},
	},

	pages: true,

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: importedScss,
				},
			},
		},
	},

	modules: ['@nuxt/image', '@vueuse/nuxt', '@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/device', '@pinia/nuxt'],

	device: {
		refreshOnResize: true,
	},

	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: '',
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: './components/ui',
	},
});
