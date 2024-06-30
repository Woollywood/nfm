export interface IsAdmin {
	is_superuser: boolean;
}

export interface BaseRoomType {
	id: number;
	user: string;
}

export interface ResponseBase {
	total: number;
	page: number;
	size: number;
	pages: number;
}

export interface RoomListItemType {
	id: number;
	user: string;
	messages_count: 3;
	last_message_time: string;
	newMessages?: number;
	status: 'offline' | 'online';
}

export interface MessageItemType {
	chat_room: number | null;
	message: string;
	sender: 'admin' | string;
	time: string;
}

/* ============================================================================================================= */

export interface RoomListResponse extends ResponseBase {
	items: RoomListItemType[];
}

export interface MessageListResponse extends ResponseBase {
	items: MessageItemType[];
}
