import WebSocket from "ws";

export function startAiClient(roomId: string) {
  let preX = 400;
  let preY: number = 300;
  const paddleLeft: number = 60;
  const paddleRight: number = 800;
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

    if (ballX == preX) return -1;
    if (ballX < preX) time = (ballX - paddleLeft) / (preX - ballX);
    else time = (2 * paddleRight - ballX - paddleLeft) / (ballX - preX);

    finalY = ballY + (ballY - preY) * time;
    if (finalY < 0) finalY = -finalY;

    if (Math.floor(finalY / topEnd) % 2) return topEnd - finalY % topEnd;
    return finalY % topEnd;
  }

  const ws = new WebSocket("ws://localhost:4000/game/" + roomId);

  function sendKeyEvent(key: string, pressed: boolean) {
    ws.send(
      JSON.stringify({
        type: "keyEvent",
        key: key,
        pressed: pressed,
      })
    )
  }

  function move(goal: number): void {
    if (gameState.paddle1Y + paddleSize - 5 < goal) {
      if (moveDown) {
        sendKeyEvent("w", false);
        moveDown = false;
      }
      if (!moveUp) {
        sendKeyEvent("s", true);
        moveUp = true;
      }
    }
    else if (goal < gameState.paddle1Y + 5) {
      if (!moveDown) {
        sendKeyEvent("w", true);
        moveDown = true;
      }
      if (moveUp) {
        sendKeyEvent("s", false);
        moveUp = false;
      }
    }
    else {
      if (moveDown) {
          sendKeyEvent("w", false);
          moveDown = false;
      }
      if (moveUp) {
          sendKeyEvent("s", false);
          moveUp = false;
      }
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