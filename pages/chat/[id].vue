<script lang="ts" setup>
	import { type RoomListItemType } from '@/components/chat/chat.interface';
	import { useChatStore } from '@/components/chat/store';
	import { storeToRefs } from 'pinia';
	import { Chat } from '@/api/chat';

	const chatStore = useChatStore();
	const { isAdmin, roomList } = storeToRefs(chatStore);

	const route = useRoute();
	const roomId = Number(route.params.id as string);

	isAdmin.value ? (roomList.value.items.find((r) => r.id === roomId).newMessages = null) : null;
</script>

<template>
	<ChatInner />
</template>

<style>
	.dummy {
	}
</style>
