export const userDatabase: { [key: string]: { name: string; image: string } } = {
    "player-a-id": { name: "K.K.", image: "https://via.placeholder.com/150/FFC107/000000?Text=A" },
    "player-b-id": { name: "Isabelle", image: "https://via.placeholder.com/150/03A9F4/FFFFFF?Text=B" },
    "player-c-id": { name: "Tom Nook", image: "https://via.placeholder.com/150/4CAF50/FFFFFF?Text=C" },
};

export const MY_USER_ID = "player-a-id";
export const MY_USERNAME = "enoch";

export const tournamentsList = [
    { id: "a7b7a8a0-c5e3-4b1d-8f6a-9f0b1c2d3e4f", owner_id: "player-a-id", name: "Beginner's Cup", description: "参加者受付中です！", state: "reception" },
    { id: "b8c8b9b1-d6f4-4c2e-9a7b-af1c2d3e4f5a", owner_id: "player-a-id", name: "Weekly Open", description: "試合の準備をしてください！", state: "open" },
    { id: "c9d9ca92-e7a5-4d3f-a98c-bf2d3e4f5a6b", owner_id: "player-b-id", name: "The Legend Tournament", description: "終了したトーナメントです。", state: "close" },
];

export const tournamentReception = {
  id: "a7b7a8a0-c5e3-4b1d-8f6a-9f0b1c2d3e4f", 
  owner_id: "player-a-id", 
  name: "Beginner's Cup", 
  description: "参加者受付中です！", 
  max_participants: 8,  
  state: "reception", 
  champion_id: "",
  participants: [ 
    { id: "player-a-id" }, 
    { id: "player-b-id" } 
  ], 
  histories: []
};

export const tournamentOpen = {
  id: "b8c8b9b1-d6f4-4c2e-9a7b-af1c2d3e4f5a", 
  owner_id: "player-a-id", 
  name: "Weekly Open", 
  description: "A small tournament for two", 
  max_participants: 2,  
  state: "open", 
  champion_id: "",
  participants: [ 
    { id: "player-a-id", status: 'pending' }, 
    { id: "player-b-id", status: 'pending' } 
  ], 
  histories: []
};

export const tournamentClose = {
  id: "c9d9ca92-e7a5-4d3f-a98c-bf2d3e4f5a6b", 
  owner_id: "player-b-id", 
  name: "The Legend Tournament", 
  description: "終了したトーナメントです。",
  max_participants: 3,
  state: "close", 
  champion_id: "player-b-id",
  participants: ["player-a-id", "player-b-id", "player-c-id"],
  histories: [
      { winner: { id: "player-b-id", score: 10 }, loser: { id: "player-a-id", score: 5 } },
      { winner: { id: "player-b-id", score: 10 }, loser: { id: "player-c-id", score: 7 } }
  ]
};

export const gameState = { state: { paddle1Y: 250, paddle2Y: 350, ballX: 130, ballY: 30, score1: 2, score2: 5 } };
export const gameEndState = { winner: "yui", loser: "kotaro", winner_score: 5, loser_score: 2, winner_image: "https://via.placeholder.com/150/0000FF/FFFFFF?Text=Yui", loser_image: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Kotaro" };