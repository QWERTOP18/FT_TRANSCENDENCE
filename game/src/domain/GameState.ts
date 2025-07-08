import { WebSocket } from "ws";

export const WINNING_SCORE = 10;

export class GameState {
  private paddle1Y: number = 250;
  private paddle2Y: number = 250;
  private ballX: number = 400;
  private ballY: number = 300;
  private ballSpeedX: number = 5;
  private ballSpeedY: number = 5;
  private score1: number = 0;
  private score2: number = 0;
  private paddleSpeed: number = 10;
  private keys1: { [key: string]: boolean } = {};
  private keys2: { [key: string]: boolean } = {};
  private end: boolean = false;
  private error: number = 0;

  constructor() {
    this.ballSpeedX = Math.random() > 0.5 ? 5 : -5;
    this.ballSpeedY = Math.random() > 0.5 ? 5 : -5;
  }

  update() {
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
    }
    if (
      this.ballX >= 740 &&
      this.ballX <= 750 &&
      this.ballSpeedX > 0 &&
      this.ballY >= this.paddle2Y &&
      this.ballY <= this.paddle2Y + 100
    ) {
      this.ballSpeedX = -this.ballSpeedX;
    }
    if (this.ballX <= 0) {
      this.score2++;
      this.resetBall();
      if (this.score2 == WINNING_SCORE) {
        this.end = false;
      }
    }
    if (this.ballX >= 800) {
      this.score1++;
      this.resetBall();
      if (this.score1 == WINNING_SCORE) {
        this.end = true;
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
    if ((this.keys2["w"] || this.keys2["ArrowUp"]) && this.paddle2Y > 0) {
      this.paddle2Y -= this.paddleSpeed;
    }
    if ((this.keys2["s"] || this.keys2["ArrowDown"]) && this.paddle2Y < 500) {
      this.paddle2Y += this.paddleSpeed;
    }
  }

  private resetBall() {
    this.ballX = 400;
    this.ballY = 300;
    this.ballSpeedX = Math.random() > 0.5 ? 5 : -5;
    this.ballSpeedY = Math.random() > 0.5 ? 5 : -5;
  }

  handleKeyEvent(
    key: string,
    pressed: boolean,
    player: WebSocket,
    player1: WebSocket | null,
    player2: WebSocket | null
  ) {
    if (player === player1) {
      this.keys1[key] = pressed;
    } else if (player === player2) {
      this.keys2[key] = pressed;
    }
  }

  handleError(
    ws: WebSocket,
    error: string,
    player1: WebSocket | null,
    player2: WebSocket | null
  ) {
    if (ws === player1) {
      this.error = 1;
      this.end = true;
    } else if (ws === player2) {
      this.error = 2;
      this.end = true;
    }
  }

  handleClose(
    ws: WebSocket,
    player1: WebSocket | null,
    player2: WebSocket | null
  ) {
    if (ws === player1) {
      this.end = true;
      this.error = 1;
    } else if (ws === player2) {
      this.end = true;
      this.error = 2;
    }
  }

  getState() {
    return {
      paddle1Y: this.paddle1Y,
      paddle2Y: this.paddle2Y,
      ballX: this.ballX,
      ballY: this.ballY,
      score1: this.score1,
      score2: this.score2,
      end: this.end,
      error: this.error,
    };
  }
}
