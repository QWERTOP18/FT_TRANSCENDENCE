import { Pong } from "./Pong";
import { PongGUI } from "./PongGUI";
import { ScoreBoardGUI } from "./ScoreBoardGUI";
import { ServerToPongMapper } from "./ServerToPongMapper";

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
			if (data.type == 'gameState') {
				const state = data.state;
				const centerX = ServerToPongMapper.y2xMap(ServerToPongMapper.width_server / 2);
				const centerZ = ServerToPongMapper.x2zMap(ServerToPongMapper.height_server / 2);
				props.pong.setPosition({
					packPosition: {
						x: ServerToPongMapper.y2xMap(state.ballY) - centerX,
						z: ServerToPongMapper.x2zMap(state.ballX) - centerZ,
					},
					bottomBarPosition: {
						x: ServerToPongMapper.y2xMap(state.paddle1Y - ServerToPongMapper.paddleWidth_server / 2) - centerX,
						z: props.pong.props.bottomBar.position.z
					},
					topBarPosition: {
						x: ServerToPongMapper.y2xMap(state.paddle2Y - ServerToPongMapper.paddleWidth_server / 2) - centerX,
						z: props.pong.props.topBar.position.z
					},
				});
				const newPlayerScore = state.score1;
				const newOpponentScore = state.score2;
				props.pongGui.setScore(newPlayerScore, newOpponentScore)
				props.scoreboard.setScore(newPlayerScore, newOpponentScore)
			}
			else if (data.type == 'gameEnd') {
				const state = data.state;
				const newPlayerScore = state.score1;
				const newOpponentScore = state.score2;
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
