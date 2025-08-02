
/**
 * Game API のアダプター
 */
export class PongGameAPI {
	
	public static createPongGameSocket(props: {
		roomId: string,
		userId: string,
	}) {
		const ws = new WebSocket(`ws://localhost:4000/game/${props.roomId}?user_id=${props.userId}`);
		return ws;
	}

	public static async playAiGame(body: {
		aiLevel: number,
		userId: string,
	}) {
		const playAiResponse = await fetch("http://localhost:4000/play-ai", {
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
		const response = await fetch("/auth/authenticate", {
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
		const response = await fetch("/auth/signup", {
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
