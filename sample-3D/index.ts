import { Camera, Color3, CreateBox, CreateCylinder, Engine, FreeCamera, HemisphericLight, Light, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { GradientMaterial, GridMaterial, SkyMaterial } from "@babylonjs/materials";

type PongProps = {
	scene: Scene,
	camera: Camera,
	light: Light,
	pack: Mesh,
	bottomBar: Mesh,
	topBar: Mesh,
	ground: Mesh,
}

class Playground {

	static instance: Playground | null;

	constructor(public props: PongProps) { }

	public setPosition(props: {
		packPosition?: { x: number, z: number },
		bottomBarPosition?: { x: number, z: number },
		topBarPosition?: { x: number, z: number },
	}) {
		if (props.packPosition) {
			this.props.pack.position.x = props.packPosition.x;
			this.props.pack.position.z = props.packPosition.z;
		}
		if (props.bottomBarPosition) {
			this.props.bottomBar.position.x = props.bottomBarPosition.x;
			this.props.bottomBar.position.z = props.bottomBarPosition.z;
		}
		if (props.topBarPosition) {
			this.props.topBar.position.x = props.topBarPosition.x;
			this.props.topBar.position.z = props.topBarPosition.z;
		}
	}

	public static CreateScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
		// This creates a basic Babylon Scene object (non-mesh)
		const scene = new Scene(engine);

		const camera = this.CreateCamera(canvas, scene);
		const light = this.CreateLight(scene);
		const pack = this.CreatePack(scene);
		const bottomBar = this.CreateBottomBar(scene);
		const topBar = this.CreateTopBar(scene);
		const ground = this.CreateGround(scene);

		Playground.instance = new Playground({
			scene,
			camera,
			light,
			pack,
			bottomBar,
			topBar,
			ground,
		});

		return scene;
	}

	// This creates and positions a free camera (non-mesh)
	public static CreateCamera(canvas: HTMLCanvasElement, scene?: Scene) {
		const camera = new FreeCamera("camera1", new Vector3(0, 5, -25), scene);

		// This targets the camera to scene origin
		camera.setTarget(Vector3.Zero());

		// This attaches the camera to the canvas
		// camera.attachControl(canvas, true);
		return camera;
	}

	public static CreatePack(scene?: Scene) {
		const pack = CreateCylinder("pack", {
			height: 0.5,
			diameter: 1.5,
		}, scene);
		pack.position.y = 0.25;

		const material = new StandardMaterial("pack-material", scene);
		material.diffuseColor = Color3.White();
		pack.material = material;

		return pack;
	}

	// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
	public static CreateLight(scene?: Scene) {
		const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

		// Default intensity is 1. Let's dim the light a small amount
		light.intensity = 1.0;

		return light;
	}

	public static CreateBottomBar(scene?: Scene) {
		const bar = MeshBuilder.CreateBox("bottom-bar", {
			height: 1,
			width: 5,
		}, scene);
		bar.position.y = 0.5;
		bar.position.z = -15;

		const material = new GradientMaterial("bar-material", scene);
		material.topColor = Color3.White();
		material.bottomColor = Color3.White();
		material.bottomColorAlpha = 0.5;
		bar.material = material;

		return bar;
	}

	public static CreateTopBar(scene?: Scene) {
		const bar = CreateBox("top-bar", {
			height: 1,
			width: 5,
		}, scene);
		bar.position.y = 0.5;
		bar.position.z = 15;

		const material = new GradientMaterial("bar-material", scene);
		material.topColor = Color3.White();
		material.bottomColor = Color3.White();
		material.bottomColorAlpha = 0.5;
		bar.material = material;

		return bar;
	}

	public static SkyBox(scene?: Scene) {
		const skyMaterial = new SkyMaterial("skyMaterial", scene);
		skyMaterial.backFaceCulling = false;

		const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
		skybox.material = skyMaterial;
		skyMaterial.inclination = -0.47;
		skyMaterial.luminance = 0;

		return skybox;
	}

	// Our built-in 'ground' shape. Params: name, options, scene
	public static CreateGround(scene?: Scene) {
		const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 30 }, scene);


		const material = new GridMaterial("ground-material", scene);
		// material.diffuseColor = Color3.Black();
		material.mainColor = Color3.Black();
		material.lineColor = Color3.White();
		material.gridRatio = 20;
		ground.material = material;

		return ground;
	}
}

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement | null; // Get the canvas element
if (!canvas) {
	throw new Error("Canvasエレメントが見つかりませんでした。");
}
const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine

// Add your code here matching the playground format

const scene = Playground.CreateScene(engine, canvas); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
	scene.render();
});

canvas.addEventListener("keydown", (event: KeyboardEvent) => {
	if (!Playground.instance) {
		return ;
	}
	if (event.key === "ArrowUp") {
		// Move pack up
		Playground.instance.props.pack.position.z += 0.1;
	} else if (event.key === "ArrowDown") {
		// Move pack down
		Playground.instance.props.pack.position.z -= 0.1;
	} else if (event.key === "ArrowLeft") {
		// Move pack left
		Playground.instance.props.pack.position.x -= 0.1;
	} else if (event.key === "ArrowRight") {
		// Move pack right
		Playground.instance.props.pack.position.x += 0.1;
	}
	else if (event.key == "a") {
		Playground.instance.props.bottomBar.position.x -= 0.1;
	}
	else if (event.key == "d") {
		Playground.instance.props.bottomBar.position.x += 0.1;
	}
	else if (event.key == "q") {
		Playground.instance.props.topBar.position.x -= 0.1;
	}
	else if (event.key == "e") {
		Playground.instance.props.topBar.position.x += 0.1;
	}
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
	engine.resize();
});
