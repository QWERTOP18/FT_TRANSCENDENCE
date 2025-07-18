import { WebSocketServer } from "ws"

export class LobbyGateway {
  private wss: WebSocketServer;

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });
    this.setup();
  }

  private setup() {
    this.wss.on("connection", (ws, req) => {
      
    })
  }
}