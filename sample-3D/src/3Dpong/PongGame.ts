import { Engine } from "@babylonjs/core";
import { GameSocket } from "../gameAPIs/GameSocket";
import { PongGameAPI } from "../gameAPIs/PongGameAPI";
import { PongGUI } from "../gui/PongGUI";
import { ScoreBoardGUI } from "../gui/ScoreBoardGUI";
import { PongInputEventManager } from "../input/PongInputEventManager";
import { Pong } from "./Pong";
import { PongBuilder } from "./PongBuilder";
import { PongUpdater } from "./PongUpdater";


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
		pongGui.setScore(0, 0);
		const scoreboard = await ScoreBoardGUI.createScoreBoardGUI(pong.props.scene);

		// 継続的にシーンをレンダリングする
		engine.runRenderLoop(function () {
			pong.props.scene.render();
		});

		// ウィンドウのリサイズイベントを監視して、エンジンをリサイズ
		window.addEventListener("resize", function () {
			engine.resize();
		});

		const pongGame = new PongGame({
			pong,
			pongGui,
			scoreboard,
		})
		return pongGame;
	}

	// AIとの対戦を開始する
	public async createAiGame(props: {
		aiLevel: number,
		userId: string,
		onStart: () => void,
		onEnd: () => void,
	}) {
		if (props.aiLevel < 0 || props.aiLevel > 4) {
			throw new Error("AI level must be between 0 and 4.");
		}
		const resp = await PongGameAPI.playAiGame({
			aiLevel: props.aiLevel,
			userId: props.userId,
		})
		const ws = new GameSocket({
			roomId: resp.room_id,
			userId: props.userId,
		});
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
