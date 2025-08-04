

export class GameSocket extends WebSocket {

	constructor(props: {
		roomId: string,
		userId: string,
	}) {
		// nginx経由でWebSocket接続
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl = `${protocol}//${window.location.host}/game/${props.roomId}?user_id=${props.userId}`;
		console.log('🔌 GameSocket接続を開始:', wsUrl);
		super(wsUrl);
		
		// デバッグ情報を追加
		this.addEventListener('open', () => {
			console.log('✅ GameSocket接続が確立されました');
		});
		
		this.addEventListener('error', (error) => {
			console.error('❌ GameSocketエラー:', error);
		});
		
		this.addEventListener('close', (event) => {
			console.log('🔌 GameSocket接続が閉じられました:', event.code, event.reason);
		});
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
