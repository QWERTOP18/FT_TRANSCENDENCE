
フロントエンドとpackage.json周りが競合しそうなので一旦別で作成

# 使い方
## 設定値の変更
サーバー側の設定幅は、`PongConfigs.ts`の値をいじることで変更できます。

## コード例

```ts
const canvas = document.createHTMLElement('canvas');
canvas.width = 300;
canvas.height = 400;
document.body.appendChild(canvas);
const game = await PongGame.bootPongGame(canvas);

game.createAiGame({ // AIとの対戦を開始します。
	aiLevel: 0,
	userId: "sample_player",
	onStart: () => {
		canvas.focus();
	},
	onEnd: () => {
		alert('対戦終了');
	}
})
```

# リファレンス

# PongGame

PongGameのメインクラスです。
canvas要素へのPongの表示、AIとの対戦開始、対戦部屋への接続ができます。

使い終わったら、`PongGame.prototype.dispose` を呼び出す必要があります。
呼び出さずに繰り返しJ`bootPongGame`を実行するとメモリリークの可能性があります。

## PongGame.bootPongGame
静的メソッドです。
PongGameインスタンスを作成し、初期画面を描画します。

### 構文
```
PongGame.bootPongGame(canvas)
```

### 引数

`canvas`: HTMLCanvasElement

描画先のcanvas要素

### 返値
PongGame
canvasに表示するPongGameインスタンスを返します。
> 使い終わったら、PongGame.prototype.dispose を使って削除する必要があります。

## PongGame.prototype.battleAi
AIとの対戦を開始します。

### 構文
```ts
battleAi(prop)
```

### 引数
`prop`: object

`prop.aiLevel`: number

AIのレベル

`prop.userId`: string

ユーザーID

`prop.onStart`: () => void

ゲーム開始時のコールバック関数

`prop.onEnd`: () => void

ゲーム終了時のコールバック関数

### 返値

なし

## PongGame.prototype.connectRoom

プレイヤーとしてルームに接続します。

### 構文
```ts
connectRoom(prop)
```

### 引数

`prop.roomId`: string

ルームID

`prop.userId`: string

ユーザーID

`prop.onConnect`: () => void

接続時のコールバック関数

`prop.onEnd`: () => void

接続終了時のコールバック関数

### 返値

なし

## PongGame.prototype.dispose

PongGameインスタンスを破棄します。

### 構文
```ts
dispose()
```

### 引数
なし

### 返値
なし
