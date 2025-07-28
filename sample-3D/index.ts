import { Engine } from "@babylonjs/core";
import { PongBuilder } from "./PongBuilder";
import { PongGUI } from "./PongGUI";
import { ScoreBoardGUI } from "./ScoreBoardGUI";
import { PongSender } from "./PongSender";
import { PongUpdater } from "./PongUpdater";

(async () => {
	// Canvasエレメントを取得
	const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement | null; // Get the canvas element
	if (!canvas) {
		throw new Error("Canvasエレメントが見つかりませんでした。");
	}
	// Engineを生成
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

	const button = document.createElement("button");
	button.style.position = "absolute";
	button.style.top = "10px";
	button.style.left = "10px";
	button.textContent = "Battle AI";
	document.body.appendChild(button);
	button.addEventListener("click", async () => {
		const userName = prompt("Enter your name:");
		if (!userName) {
			alert("Name is required to create a room.");
			return;
		}
		const createRoomResponse = await fetch("http://localhost:4000/play-ai", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"aiLevel": 0,
				"user_id": userName
			}),
		});
		const createRoomResponseJson = await createRoomResponse.json()
		const ws = new WebSocket(`ws://localhost:4000/game/${createRoomResponseJson.room_id}?user_id=${userName}`);
		ws.addEventListener("open", () => {
			canvas.focus();
			const pongSender = new PongSender(ws);
			const onPressEventHandler = (event: KeyboardEvent) => {
				pongSender.onPress(event.key);
			}
			const onUpEventHandler = (event: KeyboardEvent) => {
				pongSender.onUp(event.key);
			}
			canvas.addEventListener('keydown', onPressEventHandler)
			canvas.addEventListener('keyup', onUpEventHandler)
			PongUpdater.setEvents({
				pong: pong,
				pongGui: pongGui,
				scoreboard: scoreboard,
				ws: ws,
				onEnd: () => {
					canvas.removeEventListener('keydown', onPressEventHandler);
					canvas.removeEventListener('keyup', onUpEventHandler);
					button.disabled = false;
				}
			});
			button.disabled = true;
		})
	});

	/**
	 * サンプルの操作方法
	 * ↑: パックを前に移動
	 * ↓: パックを後ろに移動
	 * ←: パックを左に移動
	 * →: パックを右に移動
	 * a: プレイヤーを左に移動
	 * d: プレイヤーを右に移動
	 * q: 相手を左に移動
	 * e: 相手を右に移動
	 * r: スコアをリセット
	 * w: 相手のスコアを1点増やす
	 * s: プレイヤーのスコアを1点増やす
	 */
	// canvas.addEventListener("keydown", (event: KeyboardEvent) => {
	// 	// Pack
	// 	if (event.key === "ArrowUp") {
	// 		pong.props.pack.position.z += 0.1;
	// 	} else if (event.key === "ArrowDown") {
	// 		pong.props.pack.position.z -= 0.1;
	// 	} else if (event.key === "ArrowLeft") {
	// 		pong.props.pack.position.x -= 0.1;
	// 	} else if (event.key === "ArrowRight") {
	// 		pong.props.pack.position.x += 0.1;
	// 	}
	// 	// Player
	// 	else if (event.key == "a") {
	// 		pong.props.bottomBar.position.x -= 0.1;
	// 	}
	// 	else if (event.key == "d") {
	// 		pong.props.bottomBar.position.x += 0.1;
	// 	}
	// 	// Opponent
	// 	else if (event.key == "q") {
	// 		pong.props.topBar.position.x -= 0.1;
	// 	}
	// 	else if (event.key == "e") {
	// 		pong.props.topBar.position.x += 0.1;
	// 	}
	// 	// Score
	// 	else if (event.key == "r") {
	// 		pongGui.setScore(0, 0);
	// 		scoreboard.setScore(0, 0);
	// 	}
	// 	else if (event.key == "w") {
	// 		const newOpponentScore = pongGui.opponentScore + 1;
	// 		const newPlayerScore = pongGui.playerScore;
	// 		pongGui.setScore(newPlayerScore, newOpponentScore);
	// 		scoreboard.setScore(newPlayerScore, newOpponentScore);
	// 		scoreboard.animateScore(pong.props.scene);
	// 	} else if (event.key == "s") {
	// 		pongGui.setScore(pongGui.opponentScore, pongGui.playerScore + 1);
	// 		scoreboard.setScore(pongGui.playerScore + 1, pongGui.opponentScore);
	// 	}
	// });

	// ウィンドウのリサイズイベントを監視して、エンジンをリサイズ
	window.addEventListener("resize", function () {
		engine.resize();
	});

})();
