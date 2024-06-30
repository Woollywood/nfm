<script setup lang="ts">
	import { getMessageList } from './api';
	import { useChatStore } from './store';
	import { storeToRefs } from 'pinia';
	import { Chat } from '@/api/chat';
	import { getType, scrollBottom, observe } from './utils';

	const chatStore = useChatStore();
	const { isAdmin } = storeToRefs(chatStore);

	const route = useRoute();
	const roomId = +route.params.id;
	const isLoading = ref(false);
	const { data: messageListResponse } = await getMessageList(roomId);

	const { isMobile } = useDevice();
	const board = ref<HTMLElement | null>(null);
	const boardWrapper = ref<HTMLElement | null>(null);
	const boardTop = ref<HTMLElement | null>(null);

	const placeholderDesktop = ref('Type your message here...');
	const placeholderMobile = ref('Your Message');
	const message = ref('');

	const chatInstance = new Chat(
		isAdmin.value ? { sessionId: getSessionId()! } : { roomId, sessionId: getSessionId()! }
	);

	chatInstance.getCallbacks().push(async (e) => {
		if (!('status' in e)) {
			const pushMessage = () => {
				messageListResponse.value?.items.unshift({
					chat_room: roomId,
					message: e.message,
					sender: e.sender,
					time: new Date().toDateString(),
				});
			};

			if (isAdmin.value) {
				roomId === e.room_id ? pushMessage() : null;
			} else {
				pushMessage();
			}

			if (Math.abs(board.value?.scrollTop! - (board.value?.scrollHeight! - board.value?.clientHeight!)) <= 10) {
				await nextTick();
				scrollBottom(board.value!);
			}
		}
	});

	const messages = computed(() =>
		messageListResponse.value?.items
			.map((msg) => ({
				...msg,
				type: getType(isAdmin.value!, msg.sender),
			}))
			.slice()
			.reverse()
	);

	const currentPage = ref(messageListResponse.value?.page);
	const pages = computed(() => messageListResponse.value?.pages);

	async function sendMessage() {
		if (!message.value.length) {
			return;
		}

		const newMessage = {
			sender: isAdmin.value ? 'admin' : getSessionId()!,
			chat_room: roomId,
			message: message.value,
			time: `${new Date().getHours()}:${new Date().getMinutes()}`,
		};

		isAdmin.value
			? chatInstance.sendMessage({
					message: newMessage.message,
					room_id: newMessage.chat_room,
					time: newMessage.time,
			  })
			: chatInstance.sendMessage({
					message: newMessage.message,
					time: newMessage.time,
			  });

		messageListResponse.value?.items.unshift(newMessage);
		message.value = '';

		await nextTick();
		scrollBottom(board.value!);
	}

	async function loadMoreMessages() {
		if (currentPage.value! < pages.value! && !isLoading.value) {
			isLoading.value = true;

			const { data } = await getMessageList(roomId, ++currentPage.value!);

			if (messageListResponse.value) {
				messageListResponse.value.page = currentPage.value!;
				messageListResponse.value.items = messageListResponse.value.items.concat(
					data.value?.items.slice().reverse()!
				);
			}

			let scrollDiff = 0;

			const scrollStart = board.value?.scrollHeight;
			await nextTick();
			const scrollEnd = board.value?.scrollHeight;
			scrollDiff = scrollEnd! - scrollStart!;
			board.value?.scrollTo(0, board.value.scrollTop + scrollDiff);

			isLoading.value = false;
		}
	}

	onMounted(() => {
		scrollBottom(board.value!);

		observe(board.value!, boardTop.value!, async () => {
			await loadMoreMessages();
		});

		if (!isAdmin.value) {
			chatInstance.closeOnUnmounted();
		}
	});
</script>

<template>
	<div class="chat__inner w-full">
		<div class="message-board" ref="board">
			<div class="message-board__wrapper" ref="boardWrapper">
				<div ref="boardTop"></div>
				<div class="flex items-center">
					<CustomLoader v-if="isLoading" class="!relative w-full pb-4" />
				</div>
				<div class="message-board-inner">
					<div class="message" v-for="message in messages" :class="`message--${message.type}`">
						<div class="message__text">
							<p>{{ message.message }}</p>
							<SvgIcon :name="`message-tail--${message.type}`" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="chat__footer">
			<form class="chat__form">
				<ChatTextArea
					class="chat__textarea"
					v-model="message"
					:placeholder="isMobile ? placeholderMobile : placeholderDesktop"
					@send="sendMessage" />
			</form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.chat {
		&__inner {
			position: relative;
			height: 100%;
			display: grid;
			grid-template-rows: 1fr auto;
			overflow: hidden;

			&::before {
				content: '';
				position: absolute;
				z-index: 2;
				top: calc(var(--header-height) / 4 * -1);
				left: 0;
				width: 100%;
				height: rem(56);
				background-color: color('black-2');
				box-shadow: 0 rem(12) rem(20) 0 color('black-2');
				filter: blur(12px);

				@media (max-width: $mobile) {
					height: rem(40);
				}
			}
		}

		&__footer {
		}

		&__form {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			margin: 0 rem(40);

			&::before {
				content: '';
				position: absolute;
				z-index: 2;
				top: rem(-64);
				left: -10%;
				width: 120%;
				height: rem(48);
				background-color: color('black-2');
				box-shadow: 0 rem(12) rem(20) 0 color('black-2');
				filter: blur(8px);

				@media (max-width: $tablet-xl) {
					top: rem(-56);
				}

				@media (max-width: $mobile) {
					height: rem(24);
					top: rem(-28);
				}
			}

			@media (min-width: $mobile) {
				@include adaptiveValue('margin-bottom', 48, 32, 0, 1440, 768);
			}

			@media (max-width: $mobile) {
				margin: 0;
			}
		}

		&__textarea-wrapper {
		}

		&__textarea {
		}

		&__button {
		}
	}
	.message-board {
		position: relative;
		padding: rem(24) rem(40);
		overflow-y: auto;
		overflow-x: hidden;
		margin-bottom: rem(48);
		display: grid;

		@media (max-width: $tablet-xl) {
			margin-bottom: rem(40);
		}

		@media (max-width: $mobile) {
			margin: 0 rem(-10);
			padding: rem(16) rem(10);
			margin-bottom: rem(12);
		}

		@media (min-width: $mobile) {
			&::-webkit-scrollbar {
				width: 4px;
			}

			&::-webkit-scrollbar-thumb {
				border-radius: 12px;
				border: 3px solid color('blue-4');
			}
		}

		&__wrapper {
			overflow: visible;
			align-self: flex-end;

			@media (min-width: $mobile) {
				align-items: flex-end;
				justify-content: flex-end;
			}
		}
	}

	.message-board-inner {
		max-height: 100%;
		overflow: visible;
	}

	.message {
		position: relative;
		display: grid;

		&:not(:last-child) {
			margin-bottom: rem(24);

			@media (max-width: $tablet-xl) {
				margin-bottom: rem(12);
			}

			@media (max-width: $mobile) {
				margin-bottom: rem(4);
			}
		}

		&--receiver {
			.message__text {
				justify-self: flex-start;

				p {
					background: color('black-3');
				}

				svg {
					left: rem(16);
					transform: translateX(-46%);
				}
			}
		}

		&--sender {
			.message__text {
				justify-self: flex-end;

				p {
					background: color('blue-5');
				}

				svg {
					right: rem(16);
					transform: translateX(50%);
				}
			}
		}

		&__time {
			display: flex;
			justify-content: center;
			font-family: SFPro, sans-serif;
			color: color('blue-4');
			font-size: rem(18);
			line-height: 150%;
			letter-spacing: rem(-0.16);

			@media (max-width: $tablet-xl) {
				font-size: rem(12);
				letter-spacing: rem(-0.12);
			}

			@media (max-width: $mobile) {
				line-height: 134%;
			}

			&:not(:last-child) {
				margin-bottom: rem(8);

				@media (max-width: $tablet-xl) {
					margin-bottom: rem(12);
				}

				@media (max-width: $mobile) {
					margin-bottom: rem(4);
				}
			}
		}

		&__text {
			position: relative;
			max-width: 55%;
			word-wrap: break-word;
			overflow: hidden;

			margin: 0 rem(-16);
			padding: 0 rem(16);

			@media (max-width: $tablet-xl) {
				max-width: 57.8%;
			}

			@media (max-width: $mobile) {
				max-width: 70%;
			}

			font-family: SFPro, sans-serif;
			color: color('white');
			font-size: rem(24);
			line-height: 116%;
			letter-spacing: rem(-0.24);

			@media (max-width: $tablet-xl) {
				font-size: rem(16);
				letter-spacing: rem(-0.16);
			}

			@media (max-width: $mobile) {
				line-height: 124%;
				letter-spacing: rem(-0.13);
			}

			p {
				position: relative;
				z-index: 1;
				padding: rem(25) rem(24) rem(27) rem(36);
				border-radius: rem(32);

				@media (max-width: $tablet-xl) {
					padding: rem(16) rem(24);
					border-radius: rem(22);
				}

				@media (max-width: $mobile) {
					padding: rem(12) rem(16) rem(12) rem(16);
					border-radius: rem(16);
				}
			}

			svg {
				position: absolute;
				bottom: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				width: rem(28);
				height: rem(20);

				@media (max-width: $tablet-xl) {
					width: rem(18);
					height: rem(13);
				}

				@media (max-width: $mobile) {
					width: rem(14);
					height: rem(10);
				}
			}
		}

		&__background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			svg {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				object-fit: fill;
			}
		}
	}
	.message--receiver {
	}
</style>
