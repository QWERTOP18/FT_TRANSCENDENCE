import WebSocket from "ws";
import { wssURL } from "../../config";

export async function startAiClient(roomId: string, aiLevel: number) {
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

  // AIクライアント用のuser_idを設定
  const aiUserId = "ai_player";
  const ws = new WebSocket(`${wssURL}/game/${roomId}?user_id=${aiUserId}`);

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
    // AIレベルによる制限を緩和
    if (Math.random() * 10 < aiLevel) return;
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
    // AIレベルによる制限を緩和
    if (Math.random() * 10 < aiLevel) return;
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
    // AIレベルによる制限を緩和
    if (Math.random() * 10 < aiLevel) return;
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
    console.log("現在のパドル位置:", gameState.paddle2Y, "目標位置:", goal);
    
    // パドルの中心位置を計算（AIはplayer2なのでpaddle2Yを使用）
    const paddleCenter = gameState.paddle2Y + paddleSize / 2;
    const tolerance = 20; // 許容誤差
    
    if (paddleCenter < goal - tolerance && gameState.paddle2Y < topEnd - paddleSize) {
      console.log("上に移動");
      sendMoveUp();
    }
    else if (goal + tolerance < paddleCenter && 0 < gameState.paddle2Y) {
      console.log("下に移動");
      sendMoveDown();
    }
    else {
      console.log("停止");
      sendStop();
    }
  }

  ws.on("open", () => {
    console.log("AI WebSocket connected to room:", roomId, "as user_id:", aiUserId);
  });

  ws.on('message', (message) => {
      const data = JSON.parse(message.toString());
      if (data.type === "gameState") {
        gameState = data.state;
        const goal = predictPosition();
        preX = gameState.ballX;
        preY = gameState.ballY;
        move(goal);
        // console.log("目標の座標:", goal);
        // console.log("今の座標:", gameState.paddle2Y);
      }
  })

  ws.on("error", (err) => {
    console.error("AI WebSocket error:", err);
  });
}
