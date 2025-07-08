import axios from "axios";
import WebSocket from "ws";

describe("Pong Game Integration: Room + WebSocket", () => {
  let roomId: string;
  let ws1: WebSocket, ws2: WebSocket, ws3: WebSocket;
  let messages1: any[] = [],
    messages2: any[] = [],
    messages3: any[] = [];

  beforeAll(async () => {
    // 1. ルーム作成
    const res = await axios.post("http://localhost:4000/room", {});
    roomId = res.data.room_id;
    expect(roomId).toBeDefined();
  });

  afterAll(() => {
    ws1 && ws1.close();
    ws2 && ws2.close();
    ws3 && ws3.close();
  });

  it("3クライアントがWebSocketで接続し、ゲーム状態を受信できる", (done) => {
    let readyCount = 0;
    function checkReady() {
      readyCount++;
      if (readyCount === 3) {
        // 1つ目のクライアントでキーイベント送信
        ws1.send(JSON.stringify({ type: "keyEvent", key: "w", pressed: true }));
        // 2つ目のクライアントでキーイベント送信
        ws2.send(JSON.stringify({ type: "keyEvent", key: "s", pressed: true }));
        // 1秒後に全員がゲーム状態を受信していることを確認
        setTimeout(() => {
          expect(messages1.length).toBeGreaterThan(0);
          expect(messages2.length).toBeGreaterThan(0);
          expect(messages3.length).toBeGreaterThan(0);
          // ゲーム状態の内容も確認
          const state1 = messages1.find((m) => m.type === "gameState");
          const state2 = messages2.find((m) => m.type === "gameState");
          const state3 = messages3.find((m) => m.type === "gameState");
          expect(state1).toBeDefined();
          expect(state2).toBeDefined();
          expect(state3).toBeDefined();
          done();
        }, 1000);
      }
    }
    // 2. 3クライアントでWebSocket接続
    ws1 = new WebSocket(`ws://localhost:4000/game/${roomId}`);
    ws2 = new WebSocket(`ws://localhost:4000/game/${roomId}`);
    ws3 = new WebSocket(`ws://localhost:4000/game/${roomId}`);
    ws1.on("message", (data) => {
      messages1.push(JSON.parse(data.toString()));
    });
    ws2.on("message", (data) => {
      messages2.push(JSON.parse(data.toString()));
    });
    ws3.on("message", (data) => {
      messages3.push(JSON.parse(data.toString()));
    });
    ws1.on("open", checkReady);
    ws2.on("open", checkReady);
    ws3.on("open", checkReady);
  });
});
