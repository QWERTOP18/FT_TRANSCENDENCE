import { PongGame } from "./src/3Dpong/PongGame";

(async () => {
	// Canvasエレメントを取得
	try {
		await initializeSample3DPong();
	}
	catch (error) {
		console.error("PongGameの初期化中にエラーが発生しました:", error);
		alert("ゲームの初期化に失敗しました。");
		return;
	}
})();

async function initializeSample3DPong() {
	const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement | null; // Get the canvas element
	if (!canvas) {
		throw new Error("Canvasエレメントが見つかりませんでした。");
	}

	const game = await PongGame.bootPongGame(canvas);

	const button = createBattleAiButton({
		game: game,
		onClick: async () => {
			const userName = prompt("Enter your name:");
			if (!userName) {
				alert("Name is required to create a room.");
				return;
			}
			game.createAiGame({
				aiLevel: 0,
				userName: userName,
				onStart: () => {
					canvas.focus();
					button.disabled = true;
				},
				onEnd: () => {
					button.disabled = false;
				},
			})
		}
	})
	document.body.appendChild(button);
}

function createBattleAiButton(props: {
	game: PongGame,
	onClick: () => void | Promise<void>,
}) {
	const button = document.createElement("button");
	button.style.position = "absolute";
	button.style.top = "10px";
	button.style.left = "10px";
	button.textContent = "Battle AI";
	button.addEventListener("click", props.onClick);
	return button;
}
