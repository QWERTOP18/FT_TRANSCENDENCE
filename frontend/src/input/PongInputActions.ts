import { GameSocket } from "../game-API/GameSocket";

/**
 * Pongゲームで使用できるアクション
 */
export class PongInputActions {
	
	constructor(private ws: GameSocket) {}

	moveToLeftAction() {
		this.ws.pressLeftKey(true);
	}

	moveToRightAction() {
		this.ws.pressRightKey(true);
	}

	stopToLeftAction() {
		this.ws.pressLeftKey(false);
	}

	stopToRightAction() {
		this.ws.pressRightKey(false);
	}
}
