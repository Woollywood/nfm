import { BASE_WS_URL } from '@/constants/api';

interface MessageWsSendAdmin {
	room_id: number;
	message: string;
	time: string;
}

interface MessageWsSendUser {
	message: string;
	time: string;
}

interface MessageWsResponse {
	room_id: number;
	message: string;
	sender: 'admin' | string;
	time: string;
}

interface UserActions {
	room_id: number;
	status: 'offline' | 'online';
}

interface AdminOptions {
	sessionId: string;
}

interface UserOptions {
	roomId: number;
	sessionId: string;
}

export class Chat {
	private static instance: Chat | null = null;
	private baseUrl = BASE_WS_URL;

	private websocket: WebSocket | null = null;
	private _callbacks: ((event: MessageWsResponse | UserActions) => void)[] = [];

	constructor(options: AdminOptions | UserOptions) {
		if (import.meta.server) return;
		if (Chat.instance) return Chat.instance;

		if ('roomId' in options) {
			this._openWsUser(options);
		} else {
			this._openWsAdmin(options);
		}

		this._chatBaseInit();

		Chat.instance = this;
	}

	private _chatBaseInit() {
		console.log('chat base init');

		this.websocket?.addEventListener('open', (e) => {
			console.log('ws opened');
		});

		this.websocket?.addEventListener('close', (e) => {
			console.log('ws closed');
		});

		this.websocket?.addEventListener('message', (e) => {
			const formatData = (e.data as string).replaceAll('\\', '').slice(1, -1);
			this._callbacks.forEach((cb) => cb(JSON.parse(formatData)));
		});

		this.websocket?.addEventListener('error', (e) => {
			console.log('ws error');
			console.log(e);
		});
	}

	private _openWsUser(options: UserOptions) {
		this.websocket = new WebSocket(
			`${this.baseUrl}/backend/chat/messages/${options.roomId}?sessionid=${options.sessionId}`
		);
	}

	private _openWsAdmin(options: AdminOptions) {
		this.websocket = new WebSocket(`${this.baseUrl}/backend/chat/messages/admin?sessionid=${options.sessionId}`);
	}

	/* ================================================ */

	public sendMessage(message: MessageWsSendAdmin | MessageWsSendUser) {
		console.log('send message');
		this.websocket?.send(JSON.stringify(message));
	}

	public closeOnUnmounted() {
		onUnmounted(() => {
			console.log('close chat');
			this.websocket?.close();
			this._callbacks = [];
			Chat.instance = null;
		});
	}

	public openWs(isAdmin: boolean, options: AdminOptions | UserOptions) {
		if ((this.websocket && !(this.websocket.readyState === this.websocket.CLOSED)) || this.websocket) return;

		if (isAdmin && !('roomId' in options)) {
			this._openWsAdmin(options);
		} else if ('roomId' in options) {
			this._openWsUser(options);
		} else {
			throw new Error('invalid options');
		}
	}

	public getCallbacks() {
		return this._callbacks;
	}
}
