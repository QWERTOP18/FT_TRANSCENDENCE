import { Pong } from "./Pong";
import { PongGUI } from "./PongGUI";
import { ScoreBoardGUI } from "./ScoreBoardGUI";

export type PongUpdaterProps = {
	pong: Pong;
	pongGui: PongGUI;
	scoreboard: ScoreBoardGUI;
	ws: WebSocket;
	onEnd: () => void;
}

export class PongUpdater {

	static setEvents(props: PongUpdaterProps) {
		props.ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log("Received data:", data);
			if (data.type == 'gameState') {
				props.pong.setPosition({
					packPosition: { x: data.ballX, z: data.ballY },
					bottomBarPosition: { x: data.paddle1Y, z: props.pong.props.bottomBar.position.z },
					topBarPosition: { x: data.paddle2Y, z: props.pong.props.topBar.position.z },
				});
				const newPlayerScore = data.score1;
				const newOpponentScore = data.score2;
				props.pongGui.setScore(newPlayerScore, newOpponentScore)
				props.scoreboard.setScore(newPlayerScore, newOpponentScore)
			}
			else if (data.type == 'gameEnd') {
				const newPlayerScore = data.score1;
				const newOpponentScore = data.score2;
				props.pongGui.setScore(newPlayerScore, newOpponentScore)
				props.scoreboard.setScore(newPlayerScore, newOpponentScore)
				props.scoreboard.animateScore(props.pong.props.scene);
				props.onEnd();
			}
		}
		props.ws.onclose = () => {
			props.onEnd();
		}
		props.ws.onerror = (error) => {
			console.error("WebSocket error:", error);
			props.onEnd();
		}
	}
}
