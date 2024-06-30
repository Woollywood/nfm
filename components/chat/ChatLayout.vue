<script lang="ts" setup>
	import { isAdmin as isAdminCheck } from './utils';
	import { createOrGetRoom, getRoomList, deleteRoom } from './api';
	import { useChatStore } from './store';
	import { storeToRefs } from 'pinia';
	import { Chat } from '@/api/chat';
	import { sortRoomList } from '@/components/chat/utils';
	import { type RoomListItemType } from './chat.interface';
	import { BASE_URL } from '@/constants/api';

	const { isMobile } = useDevice();
	const chatStore = useChatStore();
	const { isAdmin, roomList } = storeToRefs(chatStore);
	const route = useRoute();
	const roomId = Number(route.params.id as string);
	const roomListPage = ref(1);

	await isAdminCheck();
	const { data: roomDataResponse, execute: executeCreateRoom } = await createOrGetRoom();
	const {
		data: roomListResponse,
		error: roomListError,
		execute: executeRoomList,
		refresh,
	} = await getRoomList(roomListPage);

	function execution() {
		const arr: Promise<any>[] = [];

		!isAdmin.value ? arr.push(executeCreateRoom()) : null;
		isAdmin.value ? arr.push(executeRoomList()) : null;

		return arr;
	}

	const data = await Promise.all(execution());

	watch(
		roomListResponse,
		() => {
			if (isAdmin.value) {
				roomList.value = {
					...roomListResponse.value!,
					items: sortRoomList(roomListResponse.value?.items!),
				};
			}
		},
		{ immediate: true }
	);

	const router = useRouter();
	const rooms = computed(() =>
		roomList.value?.items
			.slice()
			.sort((a, b) => Number(new Date(a.last_message_time)) - Number(new Date(b.last_message_time)))
	);

	if (!isAdmin.value) {
		router.push(`/chat/${roomDataResponse.value?.id}`);
	} else {
		router.push(`/chat/${rooms.value![0].id}`);
	}

	function setStatus(room: RoomListItemType, status: 'offline' | 'online') {
		room.status = status;
	}

	if (isAdmin.value) {
		const chatInstance = new Chat({ sessionId: getSessionId()! });

		chatInstance.getCallbacks().push(async (e) => {
			const room = roomListResponse.value?.items.find((r) => r.id === e.room_id);

			if (room) {
				if ('status' in e) {
					setStatus(room!, e.status);
				} else {
					if (room) {
						room.messages_count++;
						room.last_message_time = new Date();
						room.newMessages ? room.newMessages++ : (room.newMessages = 1);
					}
				}
			} else {
				await refresh();
			}
		});

		onMounted(() => chatInstance.closeOnUnmounted());
	}

	const hasPrevPage = computed(() => roomList.value?.page! > 1);

	async function deleteRoomHandler(roomId: string | number) {
		try {
			deleteRoom(roomId);
			const items = roomList.value?.items.filter((room) => room.id !== roomId) || [];
			roomList.value = {
				...roomList.value!,
				pages: Math.floor(items.length / 20),
				items,
			};

			if (!roomList.value.items.length && hasPrevPage.value) {
				prevPageHandler(roomList.value?.page - 1);
				roomList.value = roomListResponse.value;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function nextPageHandler(page: number) {
		roomListPage.value = page;
		await refresh();
		roomList.value = roomListResponse.value;
	}

	async function prevPageHandler(page: number) {
		roomListPage.value = page;
		await refresh();
		roomList.value = roomListResponse.value;
	}

	const isShowBar = ref(false);
	function toggle() {
		isShowBar.value = !isShowBar.value;
	}

	function getMobileChatState() {
		return isShowBar.value ? 'hide' : 'show';
	}
</script>

<template>
	<div class="chat fade-up fade-up--layout px-8 overflow-hidden" :class="[isAdmin ? 'grid-row' : '']">
		<button
			v-if="isAdmin"
			class="lg:hidden flex items-center gap-2"
			:class="[isShowBar ? '!hidden' : '']"
			@click="toggle">
			<ChatArrow :class="[!isShowBar ? 'rotate-180' : '']" class="transition-transform" />
			<p>{{ isShowBar ? `Back to chat` : `View all chats` }}</p>
		</button>
		<div
			v-if="isAdmin"
			class="listbar absolute px-4 sm:px-12 lg:px-0 z-[100] w-full lg:relative top-[var(--header-height)] lg:top-0 left-0 lg:left-0 h-full lg:pr-8 max-h-[calc(100svh-16px-var(--header-height))] overflow-hidden"
			:class="[isShowBar ? 'shown' : '']">
			<div class="scrollbar container-outer overflow-y-auto max-h-[calc(100svh-16px-var(--header-height))]">
				<div class="container-inner h-full overflow-y-auto">
					<ChatRoomList
						@delete="deleteRoomHandler"
						@nextPage="nextPageHandler"
						@prevPage="prevPageHandler"
						@click="isShowBar = false" />
				</div>
			</div>
		</div>

		<div
			class="scrollbar client-chat max-h-[calc(100svh-16px-20px-var(--header-height))] lg:max-h-[calc(100svh-16px-var(--header-height))] h-full !box-border"
			:class="[!isAdmin ? 'chat-container' : '', isMobile ? getMobileChatState() : '']">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.client-chat {
		@apply transition-all;

		&.hide {
			@apply opacity-0 invisible;
		}

		&.show {
			@apply opacity-100 visible;
		}
	}

	.listbar {
		background-color: color('black-2');
		@apply translate-x-[-140%] lg:translate-x-0 transition-all;

		&.shown {
			@apply translate-x-0;
		}

		@media (min-width: 1024px) {
			border-right: 1px solid rgb(12, 36, 58);
		}
	}

	.grid-row {
		@apply lg:grid grid-cols-[calc(445px+32px)_1fr];
	}

	.scrollbar {
		&::-webkit-scrollbar {
			@apply w-2;
		}

		&::-webkit-scrollbar-track {
			@apply bg-primary;
		}

		&::-webkit-scrollbar-thumb {
			@apply bg-secondary/70 rounded-lg overflow-hidden hover:bg-secondary transition-colors;
		}
	}

	.container-inner {
		@apply lg:pr-2;
	}

	.chat-container {
		box-sizing: content-box;
		max-width: rem(976);
		padding: 0 rem(16);
		margin: 0 auto;

		> * {
			box-sizing: border-box;
		}

		@media (max-width: $tablet-xl) {
			max-width: rem(640);
		}

		@media (max-width: $mobile) {
			padding: 0 rem(10);
		}
	}

	.chat {
		background-color: color('black-2');
		padding-top: calc(var(--header-height) + rem(8));
		height: 100dvh;
	}
</style>
