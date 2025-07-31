import { Engine } from "@babylonjs/core";
import { PongGUI } from "../gui/PongGUI";
import { ScoreBoardGUI } from "../gui/ScoreBoardGUI";
import { Pong } from "./Pong";
import { PongSender } from "./PongSender";
import { PongUpdater } from "./PongUpdater";
import { PongBuilder } from "./PongBuilder";


export class PongGame {

	constructor(public props: {
		pong: Pong,
		pongGui: PongGUI,
		scoreboard: ScoreBoardGUI,
	}) {

	}

	// PongGameの作成
	public static async bootPongGame(canvas: HTMLCanvasElement)
	{
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

	public async createAiGame(props: {
		aiLevel: number,
		userName: string,
		onStart: () => void,
		onEnd: () => void,
	}) {
		if (props.aiLevel < 0 || props.aiLevel > 4) {
			throw new Error("AI level must be between 0 and 4.");
		}
		const createRoomResponse = await fetch("http://localhost:4000/play-ai", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"aiLevel": props.aiLevel,
				"user_id": props.userName
			}),
		});
		const createRoomResponseJson = await createRoomResponse.json()
		const ws = new WebSocket(`ws://localhost:4000/game/${createRoomResponseJson.room_id}?user_id=${props.userName}`);
		ws.addEventListener("open", () => {
			this.startPongGame({
				ws,
				onEnd: props.onEnd
			})
		})
		props.onStart();
	}

	public startPongGame(props: {
		ws: WebSocket,
		onEnd: () => void
	}) {
		const pongSender = new PongSender(props.ws);
		const onPressEventHandler = (event: KeyboardEvent) => {
			pongSender.onPress(event.key);
		}
		const onUpEventHandler = (event: KeyboardEvent) => {
			pongSender.onUp(event.key);
		}
		const pong = this.props.pong;
		
		pong.props.canvas.addEventListener('keydown', onPressEventHandler)
		pong.props.canvas.addEventListener('keyup', onUpEventHandler)
		PongUpdater.setEvents({
			pong: this.props.pong,
			pongGui: this.props.pongGui,
			scoreboard: this.props.scoreboard,
			ws: props.ws,
			onEnd: () => {
				pong.props.canvas.removeEventListener('keydown', onPressEventHandler);
				pong.props.canvas.removeEventListener('keyup', onUpEventHandler);
				props.onEnd();
			}
		});
	}
}
