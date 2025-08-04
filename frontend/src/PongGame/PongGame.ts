import { Engine } from "@babylonjs/core";
import { GameSocket } from "../game-API/GameSocket";
import { PongGameAPI } from "../game-API/PongGameAPI";
import { PongGUI } from "../gui/PongGUI";
import { ScoreBoardGUI } from "../gui/ScoreBoardGUI";
import { TouchControlsGUI } from "../gui/TouchControlsGUI";
import { PongInputEventManager } from "../input/PongInputEventManager";
import { PongTouchEventManager } from "../input/PongTouchEventManager";
import { Pong } from "./Pong";
import { PongBuilder } from "./PongBuilder";
import { PongUpdater } from "./PongUpdater";
import { PongConfigs } from "../PongConfigs";
import { DeviceDetector } from "../utils/DeviceDetector";


export class PongGame {

	constructor(public props: {
		pong: Pong,
		pongGui: PongGUI,
		scoreboard: ScoreBoardGUI,
		touchControls?: TouchControlsGUI,
	}) {

	}

	// PongGameの作成
	public static async bootPongGame(canvas: HTMLCanvasElement) {
		const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine
		// ゲーム画面とGUIの初期化
		const pong = PongBuilder.CreatePong(engine, canvas);
		const pongGui = await PongGUI.createPongGUI(pong.props.scene);
		const scoreboard = await ScoreBoardGUI.createScoreBoardGUI(pong.props.scene);

		// タッチコントロールを常に追加
		let touchControls: TouchControlsGUI | undefined;
		touchControls = await TouchControlsGUI.createTouchControlsGUI(pong.props.scene);

		// 継続的にシーンをレンダリングする
		engine.runRenderLoop(function () {
			pong.props.scene.render();
		});

		// ウィンドウのリサイズイベントを監視して、エンジンをリサイズ
		const resizeHandler = function () {
			engine.resize();
		}
		window.addEventListener("resize", resizeHandler);
		engine.onDisposeObservable.add(() => {
			window.removeEventListener("resize", resizeHandler);
		})

		const pongGame = new PongGame({
			pong,
			pongGui,
			scoreboard,
			touchControls,
		})
		return pongGame;
	}

	dispose() {
		if (this.props.touchControls) {
			this.props.touchControls.dispose();
		}
		this.props.pong.props.engine.dispose();
	}

	// AIとの対戦を開始する
	public async battleAi(props: {
		aiLevel: number,
		userId: string,
		onStart: () => void,
		onEnd: () => void,
	}) {
		if (props.aiLevel < PongConfigs.minAiLevel || props.aiLevel > PongConfigs.maxAiLevel) {
			throw new Error("AI level must be between 0 and 4.");
		}
		const resp = await PongGameAPI.playAiGame({
			aiLevel: props.aiLevel,
			userId: props.userId,
		})
		this.connectRoom({
			roomId: resp.room_id,
			userId: props.userId,
			onConnect: props.onStart,
			onEnd: props.onEnd,
		})
	}

	// 部屋にプレイヤーとして接続する
	public async connectRoom(props: {
		roomId: string,
		userId: string,
		onConnect: () => void,
		onEnd: () => void,
	}) {
		const ws = new GameSocket({
			roomId: props.roomId,
			userId: props.userId,
		})
		ws.addEventListener("open", () => {
			props.onConnect();
			this.attachPlayerPongSocket({
				ws,
				onEnd: props.onEnd
			})
		})
	}

	// プレイヤーのPongのソケットを接続する
	private attachPlayerPongSocket(props: {
		ws: GameSocket,
		onEnd: () => void,
	}) {
		const inputEventManager = PongInputEventManager.createInputEventManager({
			ws: props.ws
		});
		
		// キーボードイベントを追加（デスクトップ用）
		inputEventManager.addKeyBoardEvent(this.props.pong);
		
		// タッチイベントを追加（タッチデバイス用）
		const touchEventManager = PongTouchEventManager.createTouchEventManager({
			ws: props.ws
		});
		touchEventManager.addTouchEvents(this.props.pong);
		
		// タッチコントロールUIを設定
		if (this.props.touchControls) {
			this.props.touchControls.onMoveLeft = (isPressed: boolean) => {
				if (isPressed) {
					props.ws.pressLeftKey(true);
				} else {
					props.ws.pressLeftKey(false);
				}
			};
			
			this.props.touchControls.onMoveRight = (isPressed: boolean) => {
				if (isPressed) {
					props.ws.pressRightKey(true);
				} else {
					props.ws.pressRightKey(false);
				}
			};
			
			this.props.touchControls.show();
		}
		
		this.attachPongSocket({
			ws: props.ws,
			onEnd: () => {
				inputEventManager.removeKeyBoardEvent(this.props.pong);
				touchEventManager.removeTouchEvents(this.props.pong);
				if (this.props.touchControls) {
					this.props.touchControls.hide();
				}
				props.onEnd();
			}
		});
	}

	// ウェブソケットを接続する
	private attachPongSocket(props: {
		ws: WebSocket,
		onEnd: () => void
	}) {
		PongUpdater.setEvents({
			pong: this.props.pong,
			pongGui: this.props.pongGui,
			scoreboard: this.props.scoreboard,
			ws: props.ws,
			onEnd: () => {
				props.onEnd();
			}
		});
	}
}
