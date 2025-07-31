import { Engine } from "@babylonjs/core";
import { GameSocket } from "../gameAPIs/GameSocket";
import { PongGameAPI } from "../gameAPIs/PongGameAPI";
import { PongGUI } from "../gui/PongGUI";
import { ScoreBoardGUI } from "../gui/ScoreBoardGUI";
import { PongInputEventManager } from "../input/PongInputEventManager";
import { Pong } from "./Pong";
import { PongBuilder } from "./PongBuilder";
import { PongUpdater } from "./PongUpdater";
import { PongConfigs } from "../PongConfigs";


export class PongGame {

	constructor(public props: {
		pong: Pong,
		pongGui: PongGUI,
		scoreboard: ScoreBoardGUI,
	}) {

	}

	// PongGameの作成
	public static async bootPongGame(canvas: HTMLCanvasElement) {
		const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine
		// ゲーム画面とGUIの初期化
		const pong = PongBuilder.CreatePong(engine, canvas);
		const pongGui = await PongGUI.createPongGUI(pong.props.scene);
		const scoreboard = await ScoreBoardGUI.createScoreBoardGUI(pong.props.scene);

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
		})
		return pongGame;
	}

	dispose() {
		this.props.pong.props.engine.dispose();
	}

	// AIとの対戦を開始する
	public async createAiGame(props: {
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
			onStart: props.onStart,
			onEnd: props.onEnd,
		})
	}

	// 部屋にプレイヤーとして接続する
	public async connectRoom(props: {
		roomId: string,
		userId: string,
		onStart: () => void,
		onEnd: () => void,
	}) {
		const ws = new GameSocket({
			roomId: props.roomId,
			userId: props.userId,
		})
		ws.addEventListener("open", () => {
			props.onStart();
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
		inputEventManager.addKeyBoardEvent(this.props.pong);
		this.attachPongSocket({
			ws: props.ws,
			onEnd: () => {
				inputEventManager.removeKeyBoardEvent(this.props.pong);
				props.onEnd();
			}
		})
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
