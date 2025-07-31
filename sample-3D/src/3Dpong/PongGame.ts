import { PongGUI } from "../gui/PongGUI";
import { ScoreBoardGUI } from "../gui/ScoreBoardGUI";
import { Pong } from "./Pong";
import { PongSender } from "./PongSender";
import { PongUpdater } from "./PongUpdater";


export class PongGame {

	constructor(public props: {
		pong: Pong,
		pongGui: PongGUI,
		scoreboard: ScoreBoardGUI,
	}) {

	}

	public async createAiGame(props: {
		aiLevel: number,
		userName: string,
		onStart: () => void,
		onEnd: () => void,
	}) {
		if (props.aiLevel < 0 || props.aiLevel > 4) {
			throw new Error("AI level must be between 0 and 4.");
		}
		const createRoomResponse = await fetch("http://localhost:4000/play-ai", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"aiLevel": props.aiLevel,
				"user_id": props.userName
			}),
		});
		const createRoomResponseJson = await createRoomResponse.json()
		const ws = new WebSocket(`ws://localhost:4000/game/${createRoomResponseJson.room_id}?user_id=${props.userName}`);
		ws.addEventListener("open", () => {
			this.startPongGame({
				ws,
				onEnd: props.onEnd
			})
		})
		props.onStart();
	}

	public startPongGame(props: {
		ws: WebSocket,
		onEnd: () => void
	}) {
		const pongSender = new PongSender(props.ws);
		const onPressEventHandler = (event: KeyboardEvent) => {
			pongSender.onPress(event.key);
		}
		const onUpEventHandler = (event: KeyboardEvent) => {
			pongSender.onUp(event.key);
		}
		const pong = this.props.pong;
		
		pong.props.canvas.addEventListener('keydown', onPressEventHandler)
		pong.props.canvas.addEventListener('keyup', onUpEventHandler)
		PongUpdater.setEvents({
			pong: this.props.pong,
			pongGui: this.props.pongGui,
			scoreboard: this.props.scoreboard,
			ws: props.ws,
			onEnd: () => {
				pong.props.canvas.removeEventListener('keydown', onPressEventHandler);
				pong.props.canvas.removeEventListener('keyup', onUpEventHandler);
				props.onEnd();
			}
		});
	}
}
