import { WebSocket } from "ws";

const centerX: number = 400;
const centerY: number = 300;
const paddleCenter: number = 250;

// ゲームの状態を管理するクラス
export class GameState {
  private winningScore: number;
  private paddle1Y: number = 250;
  private paddle2Y: number = 250;
  private ballX: number = 400;
  private ballY: number = 300;
  private ballSpeedX: number = 10;
  private ballSpeedY: number = 10;
  private score1: number = 0;
  private score2: number = 0;
  private paddleSpeed: number = 10;
  private keys1: { [key: string]: boolean } = {};
  private keys2: { [key: string]: boolean } = {};
  private winner: number = 0;
  private started: boolean = false;

  constructor(winningScore: number) {
    this.ballSpeedX = Math.random() > 0.5 ? 5 : -5;
    this.ballSpeedY = Math.random() > 0.5 ? 5 : -5;
    this.winningScore = winningScore;
  }

  private bound(paddleY: number) {
    this.ballSpeedY = (this.ballY - paddleY) / 4 - 12.5;
  }

  update() {
    if (this.started) return;
    this.updatePaddlePositions();
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;
    if (this.ballY <= 0 || this.ballY >= 600) {
      this.ballSpeedY = -this.ballSpeedY;
    }
    if (
      this.ballX >= 50 &&
      this.ballX <= 60 &&
      this.ballSpeedX < 0 &&
      this.ballY >= this.paddle1Y &&
      this.ballY <= this.paddle1Y + 100
    ) {
      this.ballSpeedX = -this.ballSpeedX;
      this.bound(this.paddle1Y);
    }
    if (
      this.ballX >= 740 &&
      this.ballX <= 750 &&
      this.ballSpeedX > 0 &&
      this.ballY >= this.paddle2Y &&
      this.ballY <= this.paddle2Y + 100
    ) {
      this.ballSpeedX = -this.ballSpeedX;
      this.bound(this.paddle2Y);
    }
    if (this.ballX <= 0) {
      this.score2++;
      this.resetBall();
      if (this.score2 == this.winningScore) {
        console.log("プレイヤー2が勝利しました！");
        this.winner = 2;
      }
    }
    if (this.ballX >= 800) {
      this.score1++;
      this.resetBall();
      if (this.score1 == this.winningScore) {
        console.log("プレイヤー1が勝利しました！");
        this.winner = 1;
      }
    }
  }

  private updatePaddlePositions() {
    if ((this.keys1["w"] || this.keys1["ArrowUp"]) && this.paddle1Y > 0) {
      this.paddle1Y -= this.paddleSpeed;
    }
    if ((this.keys1["s"] || this.keys1["ArrowDown"]) && this.paddle1Y < 500) {
      this.paddle1Y += this.paddleSpeed;
    }
    if ((this.keys2["w"] || this.keys2["ArrowUp"]) && this.paddle2Y < 500) {
        this.paddle2Y += this.paddleSpeed;
      }
      if ((this.keys2["s"] || this.keys2["ArrowDown"]) && 0 < this.paddle2Y) {
        this.paddle2Y -= this.paddleSpeed;
      }
  }

  private resetBall() {
    console.log({resetBall: "resetBall", score1: this.score1, score2: this.score2});
    this.ballX = centerX;
    this.ballY = centerY;
    this.ballSpeedX = Math.random() > 0.5 ? 5 : -5;
    this.ballSpeedY = Math.random() > 0.5 ? 5 : -5;
  }

  handleKeyEvent(key: string, pressed: boolean, ws: WebSocket, player1: WebSocket | null, player2: WebSocket | null) {
    if (ws === player1) {
        this.keys1[key] = pressed;
        console.log("プレイヤー1のキーイベント")
    }
    else if (ws === player2) {
        this.keys2[key] = pressed;
        console.log("プレイヤー2のキーイベント")
    }
    else {
        console.log("それ以外のキーイベント")
    }
  }

  handleError(error: string, ws: WebSocket, player1: WebSocket | null, player2: WebSocket | null) {
    console.error("Error parsing message:", error);
    if (ws === player1) {
        this.winner = 2;
    }
    else if (ws === player2) {
        this.winner = 1;
    }
  }

  handleClose(ws: WebSocket, player1: WebSocket | null, player2: WebSocket | null) {
    if (ws == player1) {
        console.log("プレイヤー1が切断しました。");
        this.winner = 2;
    }
    else if (ws == player2) {
        console.log("プレイヤー2が切断しました。");
        this.winner = 1;
    }
  }

  startGame() {
    this.started = true;
  }

  ifEnd() {
    return (this.winner !== 0);
  }

  getState(rotate: boolean) {
    if (rotate) {
        return {
            paddle1Y: paddleCenter * 2 - this.paddle2Y,
            paddle2Y: paddleCenter * 2 - this.paddle1Y,
            ballX: centerX * 2 - this.ballX,
            ballY: centerY * 2 - this.ballY,
            score1: this.score2,
            score2: this.score1,
        };
    }
    return {
        paddle1Y: this.paddle1Y,
        paddle2Y: this.paddle2Y,
        ballX: this.ballX,
        ballY: this.ballY,
        score1: this.score1,
        score2: this.score2,
    }
  }

  endState(ifPlayer2: boolean) {
    if (ifPlayer2) {
      return {
        score1: this.score2,
        score2: this.score1,
        winner: 2 - this.winner,
      }
    }
    return {
        score1: this.score1,
        score2: this.score2,
        winner: this.winner,
    }
  }
}
