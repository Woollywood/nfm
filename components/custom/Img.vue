<script setup>
const props = defineProps({
	src: {
		type: String,
		required: true,
	},
	loading: {
		type: String,
		default: 'lazy',
	},
});
</script>

<template>
	<img :src="src" :loading="loading" alt="" />
</template>

<style lang="scss" scoped>
.dummy {
}
</style>
