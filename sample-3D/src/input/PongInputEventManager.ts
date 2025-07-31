import { Pong } from "../PongGame/Pong";
import { GameSocket } from "../game-API/GameSocket";
import { PongInputActions } from "./PongInputActions";
import { PongInputHandlerFactory } from "./PongInputHandlerFactory";
import { PongInputMappers } from "./PongInputMappers";


export class PongInputEventManager {

	keydownEventHandler: (this: HTMLCanvasElement, event: KeyboardEvent) => void;
	keyupEventHandler: (this: HTMLCanvasElement, event: KeyboardEvent) => void;

	constructor(inputHandlerFactory: PongInputHandlerFactory) {
		this.keydownEventHandler = inputHandlerFactory.createEventHandler('keydown');
		this.keyupEventHandler = inputHandlerFactory.createEventHandler('keyup');
	}

	public addKeyBoardEvent(pong: Pong) {
		console.log("Adding keyboard event listeners to canvas");
		pong.props.canvas.addEventListener('keydown', this.keydownEventHandler);
		pong.props.canvas.addEventListener('keyup', this.keyupEventHandler);
	}

	public removeKeyBoardEvent(pong: Pong) {
		pong.props.canvas.removeEventListener('keydown', this.keydownEventHandler);
		pong.props.canvas.removeEventListener('keyup', this.keyupEventHandler);
	}

	public static createInputEventManager(props: { ws: GameSocket }): PongInputEventManager {
		const actions = new PongInputActions(props.ws);
		const mappers = new PongInputMappers(actions);
		const factory = new PongInputHandlerFactory(mappers);
		return new PongInputEventManager(factory);
	}
}
