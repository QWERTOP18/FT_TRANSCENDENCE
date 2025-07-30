

export class PongSender {
	constructor(private ws: WebSocket) {}

	keyMap(key: string): string {
		const rightKey = "w";
		const leftKey = "s";
		const keyMap: Record<string, string> = {

			"ArrowLeft": rightKey,
			"ArrowRight": leftKey,
			"a": rightKey,
			"d": leftKey,
		}
		return keyMap[key] || key;
	}
	onPress(key: string) {
		const mappedKey = this.keyMap(key);
		const message = JSON.stringify({
			type: 'keyEvent',
			key: mappedKey,
			pressed: true,
		})
		this.ws.send(message);
	}
	onUp(key: string) {
		const mappedKey = this.keyMap(key);
		const message = JSON.stringify({
			type: 'keyEvent',
			key: mappedKey,
			pressed: false,
		})
		this.ws.send(message);
	}
}
