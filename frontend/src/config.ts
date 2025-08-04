// nginx経由でのアクセス設定
const BASE_URL = window.location.protocol + '//' + window.location.host;

// tournamentサービスのベースURL
export const TOURNAMENT_URL = `${BASE_URL}/tournament`;

// gameサービスのベースURL
export const GAME_URL = `${BASE_URL}/game`;

// gatewayサービスのベースURL
export const SERVERURL = `${BASE_URL}/api`;
