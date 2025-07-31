import { Engine } from "@babylonjs/core";
import { PongBuilder } from "./src/3Dpong/PongBuilder";
import { PongGame } from "./src/3Dpong/PongGame";
import { PongGUI } from "./src/gui/PongGUI";
import { ScoreBoardGUI } from "./src/gui/ScoreBoardGUI";

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
		const onStart = () => {
			canvas.focus();
			button.disabled = true;
		}
		const onEnd = () => {
			button.disabled = false;
		}
		const pongGame = new PongGame({
			pong,
			pongGui,
			scoreboard,
		})
		pongGame.createAiGame({
			aiLevel: 0,
			userName: userName,
			onEnd: onEnd,
			onStart: onStart,
		})
	});

	// ウィンドウのリサイズイベントを監視して、エンジンをリサイズ
	window.addEventListener("resize", function () {
		engine.resize();
	});

})();
