import { WebSocket } from "ws";
import { config } from "../../config/config";

export class GameWebSocket extends WebSocket {
	constructor(roomId: string, userId: string) {
		const wsUrl = `${config.wssURL}/game/${roomId}?user_id=${userId}`;
		super(wsUrl, {
			rejectUnauthorized: false
		});
	}

	// ゲーム状態のコールバックを設定
	onGameState(callback: (state: GameStateData['state']) => void): void {
		this.onMessage((data) => {
			if (data.type === 'gameState') {
				callback(data.state);
			}
		});
	}

	// ゲーム終了時のコールバックを設定
	onEnd(callback: (state: GameEndData['state']) => void): void {
		this.onMessage((data) => {
			if (data.type === 'gameEnd') {
				callback(data.state);
			}
		});
	}

	// キーを送信
	sendKeyboardInput(input: 'up' | 'down', pressed: boolean): void {
		const real_key = input === 'up' ? 'w' : 's';
		const message = JSON.stringify({
			type: 'keyEvent',
			input: real_key,
			pressed
		});
		this.send(message);
	}

	private onMessage(callback: (data: GameMessage) => void): void {
		this.on('message', (message: string) => {
			const data: GameMessage = JSON.parse(message);
			callback(data);
		});
	}
}

export type GameMessage =
	GameStateData
	| GameEndData;

export type GameStateData = {
	type: 'gameState';
	state: {
		ballX: number;
		ballY: number;
		paddle1Y: number;
		paddle2Y: number;
		score1: number;
		score2: number;
	}
}

export type GameEndData = {
	type: 'gameEnd';
	state: {
		score1: number;
		score2: number;
	}
}
