import { Color3, CreateBox, CreateCylinder, Engine, FreeCamera, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { GradientMaterial, GridMaterial, SkyMaterial } from "@babylonjs/materials";
import { Pong } from "./Pong";

export class PongBuilder
{
	public static CreatePong(engine: Engine, canvas: HTMLCanvasElement): Pong {
		const scene = new Scene(engine);

		const camera = this.CreateCamera(canvas, scene);
		const light = this.CreateLight(scene);
		const pack = this.CreatePack(scene);
		const bottomBar = this.CreateBottomBar(scene);
		const topBar = this.CreateTopBar(scene);
		const ground = this.CreateGround(scene);

		const pong = new Pong({
			scene,
			camera,
			light,
			pack,
			bottomBar,
			topBar,
			ground,
		});

		return pong;
	}

	// This creates and positions a free camera (non-mesh)
	public static CreateCamera(canvas: HTMLCanvasElement, scene?: Scene) {
		const camera = new FreeCamera("camera1", new Vector3(0, 5, -25), scene);

		camera.setTarget(Vector3.Zero());

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

	public static CreateLight(scene?: Scene) {
		const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

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

	public static CreateGround(scene?: Scene) {
		const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 30 }, scene);


		const material = new GridMaterial("ground-material", scene);
		material.mainColor = Color3.Black();
		material.lineColor = Color3.White();
		material.gridRatio = 20;
		ground.material = material;

		return ground;
	}
}
