import * as readline from 'readline';
import WebSocket from 'ws';
import { config } from '../config/config';

export class KeyboardService {
  private keyStates = new Map<string, boolean>();
  private resetInterval: NodeJS.Timeout | null = null;
  private isSetup = false;

  setupKeyboardInput(ws: WebSocket): void {
    if (this.isSetup) {
      return; // 既にセットアップ済みの場合は何もしない
    }

    // 標準入力をrawモードに設定
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume(); // これが重要！
    }

    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        console.log('\nClosing connection...');
        this.cleanup();
        ws.close();
        process.exit(0);
      }

      // キー入力に応じてパドルを制御
      switch (key.name) {
        case 'w':
        case 'up':
          if (!this.keyStates.get('w')) {
            this.sendKeyEvent(ws, 'w', true);
            this.keyStates.set('w', true);
          }
          break;
        case 's':
        case 'down':
          if (!this.keyStates.get('s')) {
            this.sendKeyEvent(ws, 's', true);
            this.keyStates.set('s', true);
          }
          break;
        case 'a':
        case 'left':
          if (!this.keyStates.get('w')) {
            this.sendKeyEvent(ws, 'w', true);
            this.keyStates.set('w', true);
          }
          break;
        case 'd':
        case 'right':
          if (!this.keyStates.get('s')) {
            this.sendKeyEvent(ws, 's', true);
            this.keyStates.set('s', true);
          }
          break;
      }
    });

    // キーを離した時の処理を定期的にチェック
    this.resetInterval = setInterval(() => {
      this.keyStates.forEach((pressed, key) => {
        if (pressed) {
          this.sendKeyEvent(ws, key, false);
          this.keyStates.set(key, false);
        }
      });
    }, config.keyResetInterval);

    // プロセス終了時にキーをリセット
    process.on('SIGINT', () => {
      console.log('\nReceived SIGINT, cleaning up...');
      this.cleanup();
    });

    process.on('SIGTERM', () => {
      console.log('\nReceived SIGTERM, cleaning up...');
      this.cleanup();
    });

    this.isSetup = true;
  }

  private sendKeyEvent(ws: WebSocket, key: string, pressed: boolean): void {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "keyEvent",
            key: key,
            pressed: pressed,
          })
        );
      }
    } catch (error) {
      console.error('Error sending key event:', error);
    }
  }

  public cleanup(): void {
    console.log('Cleaning up keyboard service...');
    
    if (this.resetInterval) {
      clearInterval(this.resetInterval);
      this.resetInterval = null;
    }

    // 標準入力を元に戻す
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
      process.stdin.pause();
    }

    this.isSetup = false;
  }
} 
