const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// 1. まず 'dist' フォルダから静的ファイルを提供しようと試みる
// ブラウザが /output.css や /main.js を要求した場合、ここでファイルが見つかり、応答が完了。
app.use(express.static(path.join(__dirname, 'dist')));

// 2. 静的ファイルが見つからなかったリクエストは、すべてここに到達する
// このミドルウェアにはパスが指定されていないため、express.staticで処理されなかったすべてのリクエストを捕捉。
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`サーバーが起動しました。 http://localhost:${port} でアクセスしてください。`);
});