// ===== 仮のユーザーデータベース =====
const userDatabase: { [key: string]: { name: string; image: string } } = {
    "player-a-id": { name: "K.K.", image: "https://via.placeholder.com/150/FFC107/000000?Text=A" },
    "player-b-id": { name: "Isabelle", image: "https://via.placeholder.com/150/03A9F4/FFFFFF?Text=B" },
    "player-c-id": { name: "Tom Nook", image: "https://via.placeholder.com/150/4CAF50/FFFFFF?Text=C" },
};

  const MY_USERNAME = "enoch";
  const MY_USER_ID = "player-a-id";
  
  // --- 2人用トーナメント ---
  const tournament2P_before = {
    id: "9fd411f6-3ee4-4fc2-9cef-0ee952dc236e", owner_id: "player-a-id", name: "2-Player Tournament (Before)", state: "open", champion_id: "",
    participants: [
      { id: "player-a-id", status: 'pending' },
      { id: "player-b-id", status: 'pending' }
    ], histories: []
  };
  const tournament2P_after = {
    id: "9fd411f6-3ee4-4fc2-9cef-0ee952dc236e", name: "2-Player Tournament (After)", state: "close", champion_id: "player-b-id",
    participants: ["player-a-id", "player-b-id"],
    histories: [{
      winner: { id: "player-b-id", score: 10 },
      loser: { id: "player-a-id", score: 8 },
    }]
  };
  
  // --- 3人用トーナメント ---
  const tournament3P_before = {
    id: "031b1b96-4309-465d-915f-d43bdf22a955", owner_id: "player-a-id", name: "3-Player Tournament (Before)", state: "open", champion_id: "",
    participants: [
      { id: "player-a-id", status: 'pending' },
      { id: "player-b-id", status: 'pending' },
      { id: "player-c-id", status: 'pending' }
    ], histories: []
  };
  const tournament3P_after = {
      id: "031b1b96-4309-465d-915f-d43bdf22a955", name: "3-Player Tournament (After)", state: "close", champion_id: "player-b-id",
      participants: ["player-a-id", "player-b-id", "player-c-id"],
      histories: [
          { winner: { id: "player-b-id", score: 10 }, loser: { id: "player-a-id", score: 5 } },
          { winner: { id: "player-b-id", score: 10 }, loser: { id: "player-c-id", score: 7 } }
      ]
  };
  
  // --- 他の画面用のモックデータ ---
  const gameState = { state: { paddle1Y: 250, paddle2Y: 350, ballX: 130, ballY: 30, score1: 2, score2: 5 } };
  const gameEndState = { winner: "yui", loser: "kotaro", winner_score: 5, loser_score: 2, winner_image: "https://via.placeholder.com/150/0000FF/FFFFFF?Text=Yui", loser_image: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Kotaro" };


  // ===== アプリケーション本体 =====
  class AppRouter {
      private appElement: HTMLElement;
      private currentTournamentData: any = null;
  
      constructor() {
          this.appElement = document.getElementById('app')!;
          window.addEventListener('popstate', () => this.handleLocation());
      }
  
      public navigateTo(path: string) {
          if (window.location.pathname === path) return;
          history.pushState({}, '', path);
          this.handleLocation();
      }
  
      public async handleLocation() {
          const path = window.location.pathname;
  
          if (path.startsWith('/tournament/')) {
              const parts = path.split('/');
              const participantCount = parseInt(parts[2]);
              const state = parts[3] || 'before';
  
              let data;
              if (participantCount === 2) {
                  data = JSON.parse(JSON.stringify(state === 'before' ? tournament2P_before : tournament2P_after));
              } else {
                  data = JSON.parse(JSON.stringify(state === 'before' ? tournament3P_before : tournament3P_after));
              }
  
              this.currentTournamentData = data;
              this.renderTournamentScreen();
  
              if (state === 'before' && participantCount > 0) {
                setTimeout(() => {
                    alert('Readyボタンを押してください');
                }, 100);
              }
          } else {
              switch (path) {
                  case '/game': this.renderGameScreen(); break;
                  case '/win': this.renderResultScreen({ ...gameEndState, winner: MY_USERNAME, loser: 'opponent' }); break;
                  case '/lose': this.renderResultScreen({ ...gameEndState, winner: 'opponent', loser: MY_USERNAME }); break;
                  case '/error': this.renderErrorScreen(); break;
                  default: this.navigateTo('/tournament/3/after'); break;
              }
          }
      }
  
      public togglePlayerStatus(playerId: string) {
          if (!this.currentTournamentData) return;
          const player = this.currentTournamentData.participants.find((p: any) => p.id === playerId);
          if (player) {
              player.status = player.status === 'pending' ? 'ready' : 'pending';
          }
          this.renderTournamentScreen();
          this.checkAllPlayersReady();
      }
  
      private checkAllPlayersReady() {
          if (!this.currentTournamentData || this.currentTournamentData.state !== 'open') return;
          const allReady = this.currentTournamentData.participants.every((p: any) => p.status === 'ready');
          if (allReady) {
              setTimeout(() => {
                  alert('まもなく試合が始まります！');
              }, 100);
          }
      }
  
      private render(content: string) {
          this.appElement.innerHTML = content;
      }

    private renderTournamentScreen() {
        if (!this.currentTournamentData) return;
        const { name, participants: initialParticipants, histories, champion_id, state , owner_id} = this.currentTournamentData;

        let contentHTML;

    // =========================================================================
    //  対戦前 (state: 'open') の場合の描画ロジック
    // =========================================================================
        if (state === 'open') {
            const getPlayerHTML_interactive = (participant: any) => {
                const { id, status } = participant;
                const user = userDatabase[id] || { name: 'Unknown', image: '' };
            
                return `
                    <div class="matchup !flex-row justify-between items-center">
                        <div class="player">
                            <img src="${user.image}" class="player-avatar">
                            <span>${user.name}</span>
                        </div>
                        <div class="flex items-center gap-4 ml-auto">
                            <span class="status ${status === 'ready' ? 'text-green-400' : 'text-red-400'}">
                                ${status === 'ready' ? 'Ready' : 'Pending'}
                            </span>
                            <button class="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 rounded" onclick="router.togglePlayerStatus('${id}')">
                                Toggle
                            </button>
                        </div>
                    </div>
                `;
            };
            const participantsListHTML = initialParticipants.map(getPlayerHTML_interactive).join('');
            // 1. 全員がReadyかチェック
            const allPlayersReady = initialParticipants.every((p: any) => p.status === 'ready');
            // 2. ログインユーザーがオーナーかチェック
            const isOwner = MY_USER_ID === owner_id;

            let startButtonHTML = '';
            // 3. 全員Readyかつ、自分がオーナーの場合のみボタンを描画
            if (allPlayersReady && isOwner) {
                // 以前の「まもなく〜」のアラートは不要になったのでコメントアウト
                // alert('まもなく試合が始まります！');
                startButtonHTML = `
                    <div class="mt-8 text-center animate-pulse">
                        <button
                            class="px-8 py-4 text-xl font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
                            onclick="router.startTournament()"
                        >
                            試合開始
                        </button>
                    </div>
                `;
            }
            contentHTML = `
                <div class="w-full max-w-md mx-auto">
                    ${participantsListHTML}
                    ${startButtonHTML}
                </div>
            `;
    
    // =========================================================================
    //  対戦後 (state: 'close') の場合の描画ロジック
    // =========================================================================
        } else {
        // ステップ1: 参加者リストを準備する (不戦勝 'Bye' の対応)
            const numParticipants = initialParticipants.length;
            let bracketSize = 2;
            while (bracketSize < numParticipants) {
                bracketSize *= 2;
            }
            const players = [...initialParticipants.map((p: any) => (typeof p === 'object' ? p.id : p))];
            while (players.length < bracketSize) {
                players.push(null); // 'null'を不戦勝(Bye)として扱う
            }

        // ステップ2: ラウンドと対戦の骨格を生成する
            const rounds: any[] = [];
            let currentRoundPlayers = [...players];
            let roundIndex = 0;
            while (currentRoundPlayers.length > 1) {
                const round = { index: roundIndex, matches: [] as any[] };
                for (let i = 0; i < currentRoundPlayers.length; i += 2) {
                    round.matches.push({
                        player1: currentRoundPlayers[i],
                        player2: currentRoundPlayers[i + 1],
                        winner: null, score1: null, score2: null,
                    });
                }
                rounds.push(round);
                currentRoundPlayers = new Array(currentRoundPlayers.length / 2).fill(null);
                roundIndex++;
            }
        
        // ステップ3: 対戦履歴を反映させ、勝者を進める
            rounds.forEach((round, rIndex) => {
                round.matches.forEach((match: any, mIndex: number) => {
                    if (match.player1 && !match.player2) match.winner = match.player1;
                    if (!match.player1 && match.player2) match.winner = match.player2;

                    const history = histories.find((h: any) => 
                        (h.winner.id === match.player1 && h.loser.id === match.player2) ||
                        (h.winner.id === match.player2 && h.loser.id === match.player1)
                    );

                    if (history) {
                        match.winner = history.winner.id;
                        if (history.winner.id === match.player1) {
                            match.score1 = history.winner.score;
                            match.score2 = history.loser.score;
                        } else {
                            match.score1 = history.loser.score;
                            match.score2 = history.winner.score;
                        }
                    }
                
                    if (match.winner && rounds[rIndex + 1]) {
                        const nextMatchIndex = Math.floor(mIndex / 2);
                        const playerSlot = mIndex % 2 === 0 ? 'player1' : 'player2';
                        rounds[rIndex + 1].matches[nextMatchIndex][playerSlot] = match.winner;
                    }
                });
            });

        // ステップ4: HTMLをレンダリングする (トーナメント表用)
            const getPlayerHTML_bracket = (playerId: string | null, score: number | null = null, isWinner = false) => {
                if (!playerId) return `<div class="player text-gray-500">-- Bye --</div>`;
                const user = userDatabase[playerId] || { name: 'Unknown', image: '' };
                return `
                    <div class="player ${isWinner ? 'font-bold text-yellow-300' : ''}">
                        <img src="${user.image}" class="player-avatar">
                        <span>${user.name}</span>
                    </div>
                    <div class="score ${isWinner ? 'font-bold text-yellow-300' : ''}">${score ?? ''}</div>
                `;
            };

            const roundsHTML = rounds.map(round => `
                <div class="round">
                    ${round.matches.map((match: any) => `
                        <div class="matchup">
                            ${getPlayerHTML_bracket(match.player1, match.score1, match.winner === match.player1)}
                            ${getPlayerHTML_bracket(match.player2, match.score2, match.winner === match.player2)}
                        </div>
                    `).join('')}
                </div>
            `).join('');

            const championHTML = champion_id ? `
                <div class="round">
                    <div class="champion">
                        <span class="text-yellow-400 text-2xl">🏆 CHAMPION 🏆</span>
                        ${getPlayerHTML_bracket(champion_id, null, true)}
                    </div>
                </div>
            ` : '';
            
            contentHTML = `<div class="tournament-bracket">${roundsHTML}${championHTML}</div>`;
        }

    // 最終的なHTMLを描画
        this.render(`
            <div class="bg-gray-800 bg-opacity-80 p-6 rounded-lg text-white">
                <h2 class="text-3xl font-bold text-center mb-6">${name}</h2>
                ${contentHTML}
            </div>
        `);
    }

    // --- 各画面の描画メソッド（Tailwind CSS版） ---

    private renderGameScreen() {
        const canvasWidth = 500
        const canvasHeight = 700
        
        // Tailwindのクラスを使って中央寄せ
        this.render(`
            <div class="flex justify-center items-center bg-white border-2 border-gray-800 shadow-lg rounded-lg">
                <canvas id="game-canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
            </div>
        `);
        
        const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!;
        this.drawGame(ctx, canvasWidth, canvasHeight);
    }

    private drawGame(ctx: CanvasRenderingContext2D, width: number, height: number) {
        const state = gameState.state;
        const paddleWidth = 100;
        const paddleHeight = 20;
        const ballRadius = 10;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.font = '32px sans-serif';
        ctx.fillText(state.score1.toString(), 30, 50);
        ctx.fillText(state.score2.toString(), width - 50, height - 30);
        ctx.fillRect(state.paddle1Y - paddleWidth / 2, 20, paddleWidth, paddleHeight);
        ctx.fillRect(state.paddle2Y - paddleWidth / 2, height - 40, paddleWidth, paddleHeight);
        ctx.beginPath();
        ctx.arc(state.ballX, state.ballY, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    private renderResultScreen(result: typeof gameEndState) {
        const isWin = result.winner === MY_USERNAME;
        
        const winnerCard = `
            <div class="flex flex-col items-center transform scale-110 font-bold">
                <img src="${result.winner_image}" alt="${result.winner}" class="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover shadow-lg">
                <h3 class="text-2xl mt-4 mb-1">${result.winner}</h3>
                <p class="text-4xl">${result.winner_score}</p>
            </div>
        `;
        const loserCard = `
            <div class="flex flex-col items-center opacity-70">
                <img src="${result.loser_image}" alt="${result.loser}" class="w-28 h-28 rounded-full border-4 border-gray-400 object-cover">
                <h3 class="text-xl mt-4 mb-1">${result.loser}</h3>
                <p class="text-3xl">${result.loser_score}</p>
            </div>
        `;

        this.render(`
            <div class="text-center bg-white p-10 rounded-lg shadow-xl">
                <h2 class="text-5xl font-extrabold mb-8 ${isWin ? 'text-green-500' : 'text-red-500'}">
                    ${isWin ? 'YOU WIN!' : 'YOU LOSE...'}
                </h2>
                <div class="flex justify-around items-center gap-10">
                    ${isWin ? winnerCard + loserCard : loserCard + winnerCard}
                </div>
            </div>
        `);
    }

    private renderErrorScreen() {
        this.render(`
            <div class="text-center bg-white p-10 rounded-lg shadow-xl">
                <h2 class="text-5xl font-extrabold text-yellow-500">Error</h2>
                <p class="mt-4 text-lg">An error occurred during the game.</p>
            </div>
        `);
    }
}

const router = new AppRouter();
(window as any).router = router;
router.handleLocation();
