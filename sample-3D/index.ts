import { Engine } from "@babylonjs/core";
import { PongBuilder } from "./src/3Dpong/PongBuilder";
import { PongGUI } from "./src/gui/PongGUI";
import { ScoreBoardGUI } from "./src/gui/ScoreBoardGUI";
import { PongSender } from "./src/3Dpong/PongSender";
import { PongUpdater } from "./src/3Dpong/PongUpdater";

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
				"aiLevel": 4,
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

	// ウィンドウのリサイズイベントを監視して、エンジンをリサイズ
	window.addEventListener("resize", function () {
		engine.resize();
	});

})();
