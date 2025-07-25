import { WebSocketServer, WebSocket } from "ws";
import url from "url";
import { GameRoom } from "../../domain/GameRoom";

export class GameGateway {
  private rooms: { [roomId: string]: GameRoom } = {};
  private wss: WebSocketServer;

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });
  }

  getRooms() {
    return this.rooms;
  }

  createRoom(): GameRoom {
    const room = new GameRoom();
    this.rooms[room.room_id] = room;
    return room;
  }

  private setup() {
    this.wss.on("connection", (ws, req) => {
      // URLからroomIdを取得
      const parsedUrl = url.parse(req.url || "", true);
      const match = parsedUrl.pathname?.match(/^\/game\/([a-zA-Z0-9\-]+)/);
      const roomId = match ? match[1] : null;
      if (!roomId) {
        console.log("roomId not found");
        ws.close();
        return;
      }
      // ルームがなければErrorを返す
      if (!this.rooms[roomId]) {
        console.log("room not found");
        ws.close();
        return;
      }
      const room = this.rooms[roomId];
      room.assignPlayer(ws);
      ws.on("message", (message) => {
        try {
          const data = JSON.parse(message.toString());
          if (data.type === "keyEvent") {
            room.gameState.handleKeyEvent(
              data.key,
              data.pressed,
              ws,
              room.player1,
              room.player2
            );
          }
        } catch (error) {
          let errorMessage = "An unknown error occurred";
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === "string") {
            errorMessage = error;
          }
          room.gameState.handleError(
            ws,
            errorMessage,
            room.player1,
            room.player2
          );
        }
      });
      ws.on("close", () => {
        room.removeClient(ws);
        room.gameState.handleClose(ws, room.player1, room.player2);
        // ルームが空になったら削除
        if (room.isEmpty()) {
          delete this.rooms[roomId];
        }
      });
    });

    // ゲームループ
    setInterval(() => {
      for (const roomId in this.rooms) {
        const room = this.rooms[roomId];
        room.gameState.update();
        const state = room.gameState.getState();
        // プレイヤー・観戦者全員に送信
        [room.player1, room.player2, ...room.watchers].forEach((client) => {
          if (client && client.readyState === 1) {
            client.send(
              JSON.stringify({
                type: "gameState",
                state: { ...state, roomId },
              })
            );
          }
        });
      }
    }, 1000 / 60);
  }
}
