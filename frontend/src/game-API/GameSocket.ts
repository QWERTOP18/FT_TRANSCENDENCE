

export class GameSocket extends WebSocket {

	constructor(props: {
		roomId: string,
		userId: string,
	}) {
		super(`ws://localhost:4000/game/${props.roomId}?user_id=${props.userId}`);
	}

	/**
	 * 左キーを押す/離す
	 * @param pressed - true: キーを押す, false: キーを離す default: true
	 */
	pressLeftKey(pressed?: boolean) {
		const leftKey = "w";
		this.sendKeyEvent({
			key: leftKey,
			pressed: pressed ?? true
		})
	}

	/**
	 * 右キーを押す/離す
	 * @param pressed - true: キーを押す, false: キーを離す default: true
	 */
	pressRightKey(pressed?: boolean) {
		const rightKey = "s";
		this.sendKeyEvent({
			key: rightKey,
			pressed: pressed ?? true
		})
	}

	private sendKeyEvent(props: {
		key: string,
		pressed: boolean,
	}) {
		const message = JSON.stringify({
			type: 'keyEvent',
			key: props.key,
			pressed: props.pressed,
		})
		this.send(message);
	}
}
