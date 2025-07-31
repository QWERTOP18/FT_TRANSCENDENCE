import { PongGUI } from "../gui/PongGUI";
import { ScoreBoardGUI } from "../gui/ScoreBoardGUI";
import { PongConfigs } from "../PongConfigs";
import { ServerToPongMapper } from "./ServerToPongMapper";
import { Pong } from "./Pong";

export type PongUpdaterProps = {
	pong: Pong;
	pongGui: PongGUI;
	scoreboard: ScoreBoardGUI;
	ws: WebSocket;
	onEnd: () => void;
}

type GameData =
	GameStateData
	| GameEndData;

type GameStateData = {
	type: 'gameState';
	state: {
		ballX: number;
		ballY: number;
		paddle1Y: number;
		paddle2Y: number;
		score1: number;
		score2: number;
	}
}

type GameEndData = {
	type: 'gameEnd';
	state: {
		score1: number;
		score2: number;
	}
}

export class PongUpdater {

	static setEvents(props: PongUpdaterProps) {
		props.ws.onmessage = (event) => {
			const data = JSON.parse(event.data) as GameData;
			if (data.type == 'gameState') {
				const state = data.state;
				PongUpdater.setToPongPackPosition(props.pong, {
					ballX: state.ballX,
					ballY: state.ballY,
				});
				PongUpdater.setToPongPaddlePosition(props.pong, {
					paddle1Y: state.paddle1Y,
					paddle2Y: state.paddle2Y,
				})
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

	private static setToPongPackPosition(pong: Pong, props: {
		ballX: number;
		ballY: number;
	}) {
		const centerX = ServerToPongMapper.y2xMap(ServerToPongMapper.width_server / 2);
		const centerZ = ServerToPongMapper.x2zMap(ServerToPongMapper.height_server / 2);
		const packPosition = {
			x: ServerToPongMapper.y2xMap(props.ballY) - centerX,
			z: ServerToPongMapper.x2zMap(props.ballX) - centerZ,
		};
		pong.setPackPosition(packPosition.x, packPosition.z);
	}

	private static setToPongPaddlePosition(pong: Pong, props: {
		paddle1Y: number;
		paddle2Y: number;
	}) {
		const { paddle1Y, paddle2Y } = props;
		const centerX = ServerToPongMapper.y2xMap(ServerToPongMapper.width_server / 2);
		const playerPosition = ServerToPongMapper.y2xMap(paddle1Y) - centerX + ServerToPongMapper.y2xMap(PongConfigs.gameApiPaddleWidth) / 2;
		const opponentPosition = ServerToPongMapper.y2xMap(paddle2Y) - centerX + ServerToPongMapper.y2xMap(PongConfigs.gameApiPaddleWidth) / 2;

		pong.setPlayerPaddlePosition(playerPosition);
		pong.setOpponentPaddlePosition(opponentPosition);
	}
}
