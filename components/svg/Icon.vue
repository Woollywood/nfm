<template>
	<svg>
		<use :xlink:href="getName"></use>
	</svg>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			required: true,
		},
	},
	computed: {
		getName() {
			return `#${this.name}`;
		},
	},
};
</script>
