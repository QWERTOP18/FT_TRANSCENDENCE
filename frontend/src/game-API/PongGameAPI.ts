
/**
 * Game API のアダプター
 */
export class PongGameAPI {
	
	public static createPongGameSocket(props: {
		roomId: string,
		userId: string,
	}) {
		// nginx経由でWebSocket接続
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl = `${protocol}//${window.location.host}/game/${props.roomId}?user_id=${props.userId}`;
		console.log('🔌 WebSocket接続を開始:', wsUrl);
		
		const ws = new WebSocket(wsUrl);
		
		ws.onopen = () => {
			console.log('✅ WebSocket接続が確立されました');
		};
		
		ws.onerror = (error) => {
			console.error('❌ WebSocketエラー:', error);
		};
		
		ws.onclose = (event) => {
			console.log('🔌 WebSocket接続が閉じられました:', event.code, event.reason);
		};
		
		return ws;
	}

	public static async playAiGame(body: {
		aiLevel: number,
		userId: string,
	}) {
		const playAiResponse = await fetch("/game/play-ai", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"aiLevel": body.aiLevel,
				"user_id": body.userId
			}),
		});
		return await playAiResponse.json();
	}

	public static async authenticate(props: {
		name: string,
	}) {
		const response = await fetch("/api/auth/authenticate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: props.name
			}),
		});
		return await response.json();
	}

	public static async createUser(props: {
		name: string,
	}) {
		const response = await fetch("/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: props.name
			}),
		});
		return await response.json();
	}
}
