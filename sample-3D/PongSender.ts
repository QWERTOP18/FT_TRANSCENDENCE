

export class PongSender {
	constructor(private ws: WebSocket) {}

	sendKey(key: string) {
		const message = JSON.stringify({
			type: 'keyEvent',
			key: key,
			pressed: true,
		})
		this.ws.send(message);
	}
}
