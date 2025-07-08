// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html", // index.htmlを監視対象に追加
    "./src/**/*.ts" // TypeScriptファイル内のHTML文字列を監視対象に追加
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
