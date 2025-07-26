export const config = {
  port: Number(process.env.PORT) || 8000,
  host: process.env.HOST || "0.0.0.0",
  tournamentURL: process.env.TOURNAMENT_URL || "http://localhost:8080",
  gameURL: process.env.GAME_URL || "http://localhost:4000",
};
