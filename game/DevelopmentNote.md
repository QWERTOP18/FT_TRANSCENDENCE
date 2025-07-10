# fastify setup

https://fastify.dev/docs/latest/Guides/Getting-Started/

```sh
npm init -y
npm i fastify
npm i -D typescript @types/node


npm install fastify @fastify/websocket ws
```

## Domain層とPresentation層の分離(Application層も作るかも)

Domain層は、ゲームのロジック計算などを純粋に実装する。何にも依存しないで実行できる
Presentation層は、外部に公開するAPI routeやjson形式を定義する
