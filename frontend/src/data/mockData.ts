// // ===== 仮のユーザーデータベース =====
// export const userDatabase: { [key: string]: { name: string; image: string } } = {
//     "player-a-id": { name: "K.K.", image: "https://via.placeholder.com/150/FFC107/000000?Text=A" },
//     "player-b-id": { name: "Isabelle", image: "https://via.placeholder.com/150/03A9F4/FFFFFF?Text=B" },
//     "player-c-id": { name: "Tom Nook", image: "https://via.placeholder.com/150/4CAF50/FFFFFF?Text=C" },
// };

// export const MY_USERNAME = "enoch";
// export const MY_USER_ID = "player-a-id";

//   // --- 2人用トーナメント ---
// export const tournament2P_before = {
//     id: "9fd411f6-3ee4-4fc2-9cef-0ee952dc236e", owner_id: "player-a-id", name: "2-Player Tournament (Before)", description: "A small tournament for two", max_participants: 2,  state: "open", champion_id: "",
//     participants: [
//       { id: "player-a-id", status: 'pending' },
//       { id: "player-b-id", status: 'pending' }
//     ], histories: []
//   };
// export const tournament2P_after = {
//     id: "9fd411f6-3ee4-4fc2-9cef-0ee952dc236e", name: "2-Player Tournament (After)", state: "close", champion_id: "player-b-id",
//     participants: ["player-a-id", "player-b-id"],
//     histories: [{
//       winner: { id: "player-b-id", score: 10 },
//       loser: { id: "player-a-id", score: 8 },
//     }]
//   };
  
// export const tournament3P_before = {
//     id: "031b1b96-4309-465d-915f-d43bdf22a955", owner_id: "player-a-id", name: "3-Player Tournament (Before)", description: "A small tournament for three", max_participants: 3, state: "open", champion_id: "",
//     participants: [
//       { id: "player-a-id", status: 'pending' },
//       { id: "player-b-id", status: 'pending' },
//       { id: "player-c-id", status: 'pending' }
//     ], histories: []
//   };
// export const tournament3P_after = {
//       id: "031b1b96-4309-465d-915f-d43bdf22a955", name: "3-Player Tournament (After)", state: "close", champion_id: "player-b-id",
//       participants: ["player-a-id", "player-b-id", "player-c-id"],
//       histories: [
//           { winner: { id: "player-b-id", score: 10 }, loser: { id: "player-a-id", score: 5 } },
//           { winner: { id: "player-b-id", score: 10 }, loser: { id: "player-c-id", score: 7 } }
//       ]
//   };
  
//   // --- 他の画面用のモックデータ ---
// export const gameState = { state: { paddle1Y: 250, paddle2Y: 350, ballX: 130, ballY: 30, score1: 2, score2: 5 } };
// export const gameEndState = { winner: "yui", loser: "kotaro", winner_score: 5, loser_score: 2, winner_image: "https://via.placeholder.com/150/0000FF/FFFFFF?Text=Yui", loser_image: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Kotaro" };

export const userDatabase: { [key: string]: { name: string; image: string } } = {
    "player-a-id": { name: "K.K.", image: "https://via.placeholder.com/150/FFC107/000000?Text=A" },
    "player-b-id": { name: "Isabelle", image: "https://via.placeholder.com/150/03A9F4/FFFFFF?Text=B" },
    "player-c-id": { name: "Tom Nook", image: "https://via.placeholder.com/150/4CAF50/FFFFFF?Text=C" },
};

export const MY_USER_ID = "player-a-id";
export const MY_USERNAME = "enoch";

// --- トーナメント一覧データ (GET /api/tournament) ---
export const tournamentsList = [
    { id: "tour-1-reception", name: "Beginner's Cup", description: "参加者受付中です！お気軽にご参加ください。", state: "reception" },
    { id: "tour-2-open", name: "Weekly Open", description: "試合の準備をしてください！", state: "open" },
    { id: "tour-3-close", name: "The Legend Tournament", description: "終了したトーナメントです。", state: "close" },
];

export const tournamentReception = {
  id: "tour-1-reception", owner_id: "player-a-id", name: "Beginner's Cup", description: "参加者受付中です！", max_participants: 8,  state: "reception", champion_id: "",
  participants: [ { id: "player-a-id" }, { id: "player-b-id" } ], histories: []
};

export const tournamentOpen = {
  id: "tour-2-open", owner_id: "player-a-id", name: "Weekly Open", description: "A small tournament for two", max_participants: 2,  state: "open", champion_id: "",
  participants: [ { id: "player-a-id", status: 'pending' }, { id: "player-b-id", status: 'pending' } ], histories: []
};

export const tournamentClose = {
  id: "tour-3-close", owner_id: "player-a-id", name: "The Legend Tournament", description: "終了したトーナメントです。", state: "close", champion_id: "player-b-id",
  participants: ["player-a-id", "player-b-id", "player-c-id"],
  histories: [
      { winner: { id: "player-b-id", score: 10 }, loser: { id: "player-a-id", score: 5 } },
      { winner: { id: "player-b-id", score: 10 }, loser: { id: "player-c-id", score: 7 } }
  ]
};

export const gameState = { state: { paddle1Y: 250, paddle2Y: 350, ballX: 130, ballY: 30, score1: 2, score2: 5 } };
export const gameEndState = { winner: "yui", loser: "kotaro", winner_score: 5, loser_score: 2, winner_image: "https://via.placeholder.com/150/0000FF/FFFFFF?Text=Yui", loser_image: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Kotaro" };