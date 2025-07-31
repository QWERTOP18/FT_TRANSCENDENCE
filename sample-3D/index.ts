import { PongGame } from "./src/PongGame/PongGame";

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
		onClick: async () => {
			const userName = prompt("Enter your name:");
			if (!userName) {
				alert("Name is required to create a room.");
				return;
			}
			game.createAiGame({
				aiLevel: 0,
				userId: userName,
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
	addUIContainer(button);

	const disposeButton = createDisposeButton({
		onClick: () => {
			game.dispose();
			alert("Game disposed.");
		}
	});
	addUIContainer(disposeButton);
}

function createBattleAiButton(props: {
	onClick: () => void | Promise<void>,
}) {
	const button = document.createElement("button");
	button.textContent = "Battle AI";
	button.addEventListener("click", props.onClick);
	return button;
}

function createDisposeButton(props: {
	onClick: () => void | Promise<void>,
}) {
	const button = document.createElement("button");
	button.textContent = "Dispose Game";
	button.addEventListener("click", props.onClick);
	return button;
}

function addUIContainer(element: HTMLElement) {
	const container = (() => {
		const container = document.getElementById("uiContainer");
		if (container) 
			return container;
		const newContainer = document.createElement("div");
		newContainer.id = "uiContainer";
		newContainer.style.position = "absolute";
		newContainer.style.display = "flex";
		newContainer.style.top = "0";
		newContainer.style.left = "0";
		newContainer.style.padding = "10px";
		document.body.appendChild(newContainer);
		return newContainer;
	})();
	container.appendChild(element);
}
