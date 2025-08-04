// nginx経由でのアクセス設定
const BASE_URL = process.env.BASE_URL || 'https://localhost:4430';

export const config = {
  gatewayURL: `${BASE_URL}/api`,
  wssURL: `${BASE_URL.replace('https', 'wss')}/game`,
  keyResetInterval: 100, // ms
} as const; 
