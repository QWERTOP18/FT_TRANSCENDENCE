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
