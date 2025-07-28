import { WebSocketServer, WebSocket } from "ws";
import url from "url";
import { GameRoom } from "../../domain/GameRoom";

export class GameGateway {
  private rooms: { [roomId: string]: GameRoom } = {};
  private wss: WebSocketServer;

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });
    this.setup();
  }

  getRooms() {
    return this.rooms;
  }

  createRoom(body: any): GameRoom {
    const room = new GameRoom(body);
    this.rooms[room.room_id] = room;
    return room;
  }

  private setup() {
    this.wss.on("connection", (ws, req) => {
      const parsedUrl = url.parse(req.url || "", true);
      const match = parsedUrl.pathname?.match(/^\/game\/([a-zA-Z0-9\-]+)/);
      const roomId = match ? match[1] : null;
      const query = parsedUrl.query;
      const user_id = query.user_id as string | undefined; 

      if (!roomId) {
        console.log("roomId not found");
        ws.close();
        return;
      }
      if (!this.rooms[roomId]) {
        console.log("room not found");
        ws.close();
        return;
      }
      if (!user_id) {
        console.log("Token not provided, closing connection.");
        ws.close();
        return ;
      }
      const room = this.rooms[roomId];
      room.assignPlayer(ws, user_id);
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
            errorMessage,
            ws,
            room.player1,
            room.player2
          );
        }
      });
      ws.on("close", () => {
        room.removeClient(ws);
        room.gameState.handleClose(ws, room.player1, room.player2);
      });
    });

    // ゲームループ
    setInterval(() => {
      for (const roomId in this.rooms) {
        const room = this.rooms[roomId];
        const gameState = room.gameState;
        gameState.update();
        // プレイヤー・観戦者全員に送信
        [room.player1, room.player2, ...room.watchers].forEach((client) => {
          if (client && client.readyState === 1) {
            if (gameState.ifEnd()) {
              client.send(
                JSON.stringify({
                  type: "gameEnd",
                  state: gameState.endState(client == room.player2),
                })
              )
            }
            else {
              client.send(
                JSON.stringify({
                  type: "gameState",
                  state: gameState.getState(client == room.player2),
                })
              );
            }
          }
        });
        if (gameState.ifEnd()) {
          delete this.rooms[roomId];
        }
      }
    }, 1000 / 60);
  }
}
