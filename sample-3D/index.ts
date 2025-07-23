import { Engine } from "@babylonjs/core";
import { PongGUI } from "./PongGUI";
import { Pong } from "./Pong";


const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement | null; // Get the canvas element
if (!canvas) {
	throw new Error("Canvasエレメントが見つかりませんでした。");
}
const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine

// Add your code here matching the playground format

const scene = Pong.CreateScene(engine, canvas); //Call the createScene function
PongGUI.loadGUI(scene).then(() => {
	PongGUI.setScore(0, 0);
});

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
	scene.render();
});

canvas.addEventListener("keydown", (event: KeyboardEvent) => {
	if (!Pong.instance) {
		return ;
	}
	// Pack
	if (event.key === "ArrowUp") {
		Pong.instance.props.pack.position.z += 0.1;
	} else if (event.key === "ArrowDown") {
		Pong.instance.props.pack.position.z -= 0.1;
	} else if (event.key === "ArrowLeft") {
		Pong.instance.props.pack.position.x -= 0.1;
	} else if (event.key === "ArrowRight") {
		Pong.instance.props.pack.position.x += 0.1;
	}
	// Player
	else if (event.key == "a") {
		Pong.instance.props.bottomBar.position.x -= 0.1;
	}
	else if (event.key == "d") {
		Pong.instance.props.bottomBar.position.x += 0.1;
	}
	// Opponent
	else if (event.key == "q") {
		Pong.instance.props.topBar.position.x -= 0.1;
	}
	else if (event.key == "e") {
		Pong.instance.props.topBar.position.x += 0.1;
	}
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
	engine.resize();
});
