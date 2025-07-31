import { Camera, GroundMesh, Light, Mesh, Scene } from "@babylonjs/core";

type PongProps = {
	canvas: HTMLCanvasElement
	scene: Scene,
	camera: Camera,
	light: Light,
	pack: Mesh,
	bottomBar: Mesh,
	topBar: Mesh,
	ground: GroundMesh,
}

export class Pong {

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
}
