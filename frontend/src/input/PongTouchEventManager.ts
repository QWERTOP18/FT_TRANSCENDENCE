import { Pong } from "../PongGame/Pong";
import { GameSocket } from "../game-API/GameSocket";
import { PongTouchActions } from "./PongTouchActions";

/**
 * タッチイベントを管理するクラス
 */
export class PongTouchEventManager {
	private touchActions: PongTouchActions;
	private isTouchActive = false;
	private currentDirection: 'left' | 'right' | null = null;
	private touchStartX = 0;
	private touchStartY = 0;
	private readonly SWIPE_THRESHOLD = 30; // スワイプ判定の閾値
	private readonly TOUCH_TIMEOUT = 100; // タッチタイムアウト

	constructor(ws: GameSocket) {
		this.touchActions = new PongTouchActions(ws);
	}

	/**
	 * タッチイベントリスナーを追加
	 */
	public addTouchEvents(pong: Pong) {
		console.log("Adding touch event listeners to canvas");
		const canvas = pong.props.canvas;

		// タッチ開始
		canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
		// タッチ移動
		canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
		// タッチ終了
		canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
		// タッチキャンセル
		canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });
	}

	/**
	 * タッチイベントリスナーを削除
	 */
	public removeTouchEvents(pong: Pong) {
		const canvas = pong.props.canvas;
		canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
		canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
		canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
		canvas.removeEventListener('touchcancel', this.handleTouchEnd.bind(this));
	}

	/**
	 * タッチ開始イベントの処理
	 */
	private handleTouchStart(event: TouchEvent) {
		event.preventDefault();
		if (event.touches.length === 1) {
			this.isTouchActive = true;
			this.touchStartX = event.touches[0].clientX;
			this.touchStartY = event.touches[0].clientY;
			this.currentDirection = null;
		}
	}

	/**
	 * タッチ移動イベントの処理
	 */
	private handleTouchMove(event: TouchEvent) {
		event.preventDefault();
		if (!this.isTouchActive || event.touches.length !== 1) return;

		const touch = event.touches[0];
		const deltaX = touch.clientX - this.touchStartX;
		const deltaY = touch.clientY - this.touchStartY;

		// 水平方向の移動が垂直方向より大きい場合のみ処理
		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			const newDirection = deltaX > 0 ? 'right' : 'left';
			
			// 方向が変わった場合のみアクションを実行
			if (this.currentDirection !== newDirection) {
				// 前の方向の移動を停止
				if (this.currentDirection === 'left') {
					this.touchActions.stopToLeftAction();
				} else if (this.currentDirection === 'right') {
					this.touchActions.stopToRightAction();
				}

				// 新しい方向の移動を開始
				if (newDirection === 'left') {
					this.touchActions.moveToLeftAction();
				} else if (newDirection === 'right') {
					this.touchActions.moveToRightAction();
				}

				this.currentDirection = newDirection;
			}
		}
	}

	/**
	 * タッチ終了イベントの処理
	 */
	private handleTouchEnd(event: TouchEvent) {
		event.preventDefault();
		this.isTouchActive = false;
		
		// 現在の移動を停止
		if (this.currentDirection === 'left') {
			this.touchActions.stopToLeftAction();
		} else if (this.currentDirection === 'right') {
			this.touchActions.stopToRightAction();
		}
		
		this.currentDirection = null;
	}

	/**
	 * 静的ファクトリーメソッド
	 */
	public static createTouchEventManager(props: { ws: GameSocket }): PongTouchEventManager {
		return new PongTouchEventManager(props.ws);
	}
} 
