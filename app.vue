<script setup>
	import '@/assets/css/tailwind.css';
	import '@/assets/styles/index.scss';

	if (!getSessionId()) {
		generateSessionId();
	}

	useHead({
		meta: [
			{
				name: 'description',
				content:
					'NFM is a full-service marketing and public relations agency that engages through print, digital, experiences, radio, television and social media.',
			},
			{
				name: 'robots',
				content: 'index, follow',
			},
			{
				name: 'googlebot',
				content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
			},
			{
				name: 'bingbot',
				content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
			},
			{
				property: 'og:url',
				content: 'https://nfm.agency/',
			},
			{
				property: 'og:site_name',
				content: 'NFM | Full-service Marketing & Public Relations Agency',
			},
			{
				property: 'og:locale',
				content: 'en_US',
			},
			{
				property: 'og:type',
				content: 'website',
			},
			{
				property: 'og:title',
				content: 'Full-service Marketing & Public Relations Agency | NFM',
			},
			{
				property: 'og:description',
				content:
					'NFM is a full-service marketing and public relations agency that engages through print, digital, experiences, radio, television and social media.',
			},
			{
				property: 'og:image',
				content: 'https://nfm.agency/Frame 90-min.jpg',
			},
			{
				property: 'fb:pages',
				content: '',
			},
			{
				property: 'fb:admins',
				content: '',
			},
			{
				property: 'fb:app_id',
				content: '',
			},
			{
				name: 'twitter:card',
				content: 'summary',
			},
			{
				name: 'twitter:site',
				content: '<meta name="twitter:creator" content="">',
			},
			{
				name: 'twitter:creator',
				content: '',
			},
			{
				name: 'twitter:title',
				content: 'Full-service Marketing & Public Relations Agency | NFM',
			},
			{
				name: 'twitter:description',
				content:
					'NFM is a full-service marketing and public relations agency that engages through print, digital, experiences, radio, television and social media.',
			},
			{
				name: 'msapplication-TileColor',
				content: '#da532c',
			},
			{
				name: 'theme-color',
				content: '#ffffff',
			},
		],
		script: [
			{
				type: 'application/ld+json',
				innerHTML: {
					'@context': 'https:\/\/schema.org',
					'@type': 'WebSite',
					name: 'NFM | Full-service Marketing &amp; Public Relations Agency',
					alternateName: 'NFM | Full-service Marketing &amp; Public Relations Agency',
					description: '',
					url: 'https:\/\/nfmdymun.com',
					potentialAction: {
						'@type': 'SearchAction',
						target: {
							'@type': 'EntryPoint',
							urlTemplate: 'https:\/\/nfmdymun.com\/?s={search_term_string}',
						},
						'query-input': 'required name=search_term_string',
					},
				},
			},
			{
				type: 'application/ld+json',
				innerHTML: {
					'@context': 'https:\/\/schema.org',
					'@type': 'Organization',
					name: 'NFM+DYMUN | Full-service Marketing &amp; Public Relations Agency',
					url: 'https:\/\/nfmdymun.com',
				},
			},
		],
		link: [
			{
				rel: 'apple-touch-icon',
				sizes: '180x180',
				href: '/apple-touch-icon.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				href: '/favicon-32x32.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				href: '/favicon-16x16.png',
			},
			{
				rel: 'manifest',
				href: '/site.webmanifest',
			},
			{
				rel: 'mask-icon',
				href: '/safari-pinned-tab.svg',
				color: '#5bbad5',
			},
			{
				rel: 'canonical',
				href: 'https://nfmdymun.com/',
			},
			{
				rel: 'alternate',
				type: 'application/rss+xml',
				title: 'NFM | Full-service Marketing & Public Relations Agency » Feed',
				href: 'https://nfmdymun.com/feed/',
			},
			{
				rel: 'alternate',
				type: 'application/rss+xml',
				title: 'NFM | Full-service Marketing & Public Relations Agency » Comments Feed',
				href: 'https://nfmdymun.com/comments/feed/',
			},
			{
				rel: 'alternate',
				type: 'application/rss+xml',
				title: 'NFM | Full-service Marketing & Public Relations Agency » Home Comments Feed',
				href: 'https://nfmdymun.com/sample-page/feed/',
			},
		],
	});

	setSeoMeta();
	const currentPage = computed(() => useRoute().name);
	watch(currentPage, setSeoMeta);

	if (process.client) {
		// const runtimeConfig = useRuntimeConfig();
		googleMapsInit('AIzaSyC4kpNht_GDtmooU_k2hqELQSYUJmIDuhg');
	}
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<SvgSprite />
</template>

<style>
	.ps__rail-y {
		z-index: 150;
	}
</style>
