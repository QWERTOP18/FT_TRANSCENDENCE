
/**
 * Game API のアダプター
 */
export class PongGameAPI {

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

	public static createPongGameSocket(props: {
		roomId: string,
		userId: string,
	}) {
		const ws = new WebSocket(`ws://localhost:4000/game/${props.roomId}?user_id=${props.userId}`);
		return ws;
	}
}
