<script setup lang="ts">
	import { useChatStore } from './store';
	import { storeToRefs } from 'pinia';
	import dateFormat from 'dateformat';

	type Emits = {
		(e: 'delete', roomId: number | string): void;
		(e: 'nextPage', page: number): void;
		(e: 'prevPage', page: number): void;
		(e: 'click'): void;
	};

	const chatStore = useChatStore();
	const { roomList } = storeToRefs(chatStore);

	const emits = defineEmits<Emits>();

	('ddd mmm dd yyyy HH:MM:ss');

	const DateFormatMask = 'd mmmm yyyy. HH:MM';

	const hasNextPage = computed(() => roomList.value?.page! < roomList.value?.pages!);
	const hasPrevPage = computed(() => roomList.value?.page! > 1);

	const isRoomsEmpty = computed(() => !(roomList.value?.items && roomList.value.items.length));
	const rooms = computed(() =>
		roomList.value?.items
			.slice()
			.sort((a, b) => Number(new Date(a.last_message_time)) - Number(new Date(b.last_message_time)))
	);
</script>

<template>
	<div>
		<ul class="space-y-2" v-if="!isRoomsEmpty">
			<li v-for="room in rooms" :key="room.id">
				<div class="flex items-center gap-2">
					<NuxtLink :to="`/chat/${room.id}`" class="chat-item" @click="emits('click')">
						<div
							class="message-inner-left text-base font-medium leading-[28px] flex items-center gap-2 justify-between w-full">
							<div class="flex items-center gap-2">
								<div
									class="text-green message-inner-item flex items-center gap-2"
									v-if="room.newMessages || room.status === 'online'">
									<span
										v-if="room.status === 'online'"
										class="online-marker w-3 h-3 rounded-full overflow-hidden"></span>
									<span v-if="room.newMessages">{{ room.newMessages }} new</span>
								</div>
								<span class="message-inner-item">{{ room.messages_count }} messages</span>
							</div>
							<span class="message-inner-left__date">{{
								dateFormat(room.last_message_time, DateFormatMask)
							}}</span>
						</div>
					</NuxtLink>
					<button class="chat-item !p-2 !flex-none" @click="emits('delete', room.id)">
						<SvgIcon name="bin" class="w-6 h-6" />
					</button>
				</div>
			</li>
			<button
				v-if="hasPrevPage"
				class="chat-item chat-item__bottom-button w-full"
				@click="emits('prevPage', roomList?.page! - 1)">
				View previous 20
			</button>
			<button
				v-if="hasNextPage"
				class="chat-item chat-item__bottom-button w-full"
				@click="emits('nextPage', roomList?.page! + 1)">
				View 20 more
			</button>
		</ul>
		<h3 v-else class="text-center text-4xl font-medium">No rooms found</h3>
	</div>
</template>

<style lang="scss" scoped>
	.online-marker {
		background-color: rgba(1, 253, 133, 1) !important;
		flex-shrink: 0;
	}
	.text-green {
		color: rgba(1, 253, 133, 1) !important;
	}
	.message-inner-item {
		&:not(&:last-child) {
			padding-right: rem(8);
			border-right: 1px solid rgba(255, 255, 255, 0.16);
		}
	}

	.message-inner-left {
		font-size: rem(16);
		letter-spacing: -1%;

		@media (max-width: $tablet-xl) {
			font-size: rem(14);
		}

		@media (max-width: $mobile) {
			font-size: rem(12);
		}

		&__date {
			@media (max-width: $tablet-xl) {
				font-size: rem(12);
			}
		}
	}

	.chat-item {
		@apply flex items-center justify-center px-3 sm:px-4 py-1.5 flex-auto rounded-lg overflow-hidden transition-colors h-10 lg:h-12;

		background-color: rgb(12, 36, 58);
		border: 1px solid transparent;

		&:hover,
		&.router-link-active {
			background-color: rgb(5, 19, 32);
			border: 1px solid rgb(0, 186, 255);
		}

		&__bottom-button {
			font-size: rem(16);

			@media (max-width: $tablet-xl) {
				font-size: rem(14);
			}

			@media (max-width: $mobile) {
				font-size: rem(12);
			}
		}
	}
</style>
