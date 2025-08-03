import { GameSocket } from "../game-API/GameSocket";

/**
 * Pongゲームで使用できるタッチアクション
 */
export class PongTouchActions {
	
	constructor(private ws: GameSocket) {}

	/**
	 * 左方向への移動を開始
	 */
	moveToLeftAction() {
		this.ws.pressLeftKey(true);
	}

	/**
	 * 右方向への移動を開始
	 */
	moveToRightAction() {
		this.ws.pressRightKey(true);
	}

	/**
	 * 左方向への移動を停止
	 */
	stopToLeftAction() {
		this.ws.pressLeftKey(false);
	}

	/**
	 * 右方向への移動を停止
	 */
	stopToRightAction() {
		this.ws.pressRightKey(false);
	}

	/**
	 * 全ての移動を停止
	 */
	stopAllMovement() {
		this.ws.pressLeftKey(false);
		this.ws.pressRightKey(false);
	}
} 
