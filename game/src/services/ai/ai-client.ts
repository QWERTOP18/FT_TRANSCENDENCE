import WebSocket from "ws";
import { wssURL } from "../../config";

export function startAiClient(roomId: string, aiLevel: number) {
  let preX = 400;
  let preY: number = 300;
  const paddleLeft: number = 60;
  const topEnd: number = 600;
  let moveUp: boolean = false;
  let moveDown: boolean = false;
  const paddleSize: number = 100;

  interface GameState {
    paddle1Y: number;
    paddle2Y: number;
    ballX: number;
    ballY: number;
    score1: number;
    score2: number;
  }

  let gameState: GameState;

  function predictPosition(): number {
    const ballX = gameState.ballX;
    const ballY = gameState.ballY;
    let time: number;
    let finalY: number;

    if (preX <= ballX) return topEnd / 2;
    else time = (ballX - paddleLeft) / (preX - ballX);

    finalY = ballY + (ballY - preY) * time;
    if (finalY < 0) finalY = -finalY;

    if (Math.floor(finalY / topEnd) % 2) return topEnd - finalY % topEnd;
    return finalY % topEnd;
  }

  const ws = new WebSocket(wssURL + "/game/" + roomId);

  function sendKeyEvent(key: string, pressed: boolean) {
    ws.send(
      JSON.stringify({
        type: "keyEvent",
        key: key,
        pressed: pressed,
      })
    )
  }

  function sendMoveUp(): void {
    if (Math.random() * 4 < aiLevel) return;
    if (moveDown) {
      sendKeyEvent("w", false);
      moveDown = false;
    }
    if (!moveUp) {
      sendKeyEvent("s", true);
      moveUp = true;
    }
  }

  function sendMoveDown(): void {
    if (Math.random() * 4 < aiLevel) return;
    if (!moveDown) {
      sendKeyEvent("w", true);
      moveDown = true;
    }
    if (moveUp) {
      sendKeyEvent("s", false);
      moveUp = false;
    }
  }

  function sendStop(): void {
    if (Math.random() * 4 < aiLevel) return;
    if (moveDown) {
      sendKeyEvent("w", false);
      moveDown = false;
  }
  if (moveUp) {
      sendKeyEvent("s", false);
      moveUp = false;
    }
  }

  function move(goal: number): void {
    if (gameState.paddle1Y + paddleSize / 2 < goal && gameState.paddle1Y < topEnd) {
      sendMoveUp();
    }
    else if (goal < gameState.paddle1Y + paddleSize / 2 && 0 < gameState.paddle1Y) {
      sendMoveDown();
    }
    else {
      sendStop();
    }
  }

  ws.on("open", () => {
    console.log("WebSocket connected.");
  });

  ws.on('message', (message) => {
      const data = JSON.parse(message.toString());
      if (data.type === "gameState") {
        gameState = data.state;
        const goal = predictPosition();
        preX = gameState.ballX;
        preY = gameState.ballY;
        move(goal);
        console.log("目標の座標:", goal);
        console.log("今の座標:", gameState.paddle1Y);
      }
  })

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
}
