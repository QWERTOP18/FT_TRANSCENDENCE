import * as api from './services/api';
import * as auth from './services/auth';
import * as gameViews from './views/gameViews';
import * as tournamentViews from './views/tournamentIndex';
import * as authView from './views/authView';

export class AppRouter {
    private appElement: HTMLElement;

    private currentTournamentData: any = null;

    constructor() {
        this.appElement = document.getElementById('app')!;
        window.addEventListener('popstate', () => this.handleLocation());
    }
    
    public async init() {
        this.handleLocation(); // 最初の画面描画
    }

    /**
     * 指定されたパスに画面を遷移させる
     */
    public navigateTo(path: string) {
        if (window.location.pathname === path) return;
        history.pushState({}, '', path);
        this.handleLocation();
    }

    /**
     * 現在のURLに基づいて、適切な画面を描画する
     */
    public async handleLocation() {
        const path = window.location.pathname;
        const loggedIn = !!auth.getUserId();

        // ログインしていない場合、ほとんどのページでログイン画面にリダイレクト
        if (!loggedIn && path !== '/signup' && path !== '/login') {
            this.navigateTo('/login');
            return;
        }

        try {
            switch (true) {
                case path === '/signup':
                    authView.renderSignupScreen(this.appElement);
                    break;
                case path === '/login':
                    authView.renderLoginScreen(this.appElement);
                    break;
                case path === '/tournaments/new':
                    tournamentViews.renderCreateTournamentScreen(this.appElement);
                    break;
                case path === '/tournaments':
                    const tournaments = await api.getTournaments();
                    console.log(tournaments);
                    tournamentViews.renderTournamentListScreen(this.appElement, tournaments, auth.getUserId());
                    break;
                case path.startsWith('/tournament/detail/'):
                    const detailId = path.split('/')[3];
                    const detailData = await api.getTournamentById(detailId);
                    const participants = await api.getTournamentParticipants(detailId);
                    console.log(detailData);
                    console.log(participants);
                    this.currentTournamentData = detailData;
                    tournamentViews.renderTournamentScreen(this.appElement, detailData, auth.getUserId(), participants);
                    break;
                case path.startsWith('/tournament/admin/'):
                    const adminId = path.split('/')[3];
                    if (!adminId) { this.navigateTo('/tournaments'); return; }
                    const adminData = await api.getTournamentById(adminId);
                    console.log(adminData);
                    this.currentTournamentData = adminData;
                    tournamentViews.renderAdminScreen(this.appElement, adminData, auth.getUserId());
                    break;
                case path.startsWith('/tournament/edit/'):
                    const editId = path.split('/')[3];
                    if (!editId) { this.navigateTo('/tournaments'); return; }
                    const editData = await api.getTournamentById(editId);
                    console.log(editData);
                    this.currentTournamentData = editData;
                    tournamentViews.renderEditTournamentScreen(this.appElement, editData, auth.getUserId());
                    break;

                default:
                    this.navigateTo(loggedIn ? '/tournaments' : '/login');
                    break;
            }
        } catch (error) {
            console.error("Routing failed:", error);
            gameViews.renderErrorScreen(this.appElement);
        }
    }

    // --- インタラクティブな操作を処理するメソッド群 ---

    public async handleSignup(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const name = formData.get('name') as string;
        if (!name) { alert('名前を入力してください。'); return; }
        try {
            await api.signup(name);
            alert(`ユーザー「${name}」を作成しました。ログインしてください。`);
            this.navigateTo('/login');
        } catch (error) {
            alert('サインアップに失敗しました。');
        }
    }
    
    public async handleLogin(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const name = formData.get('name') as string;
        if (!name) { alert('名前を入力してください。'); return; }
        try {
            await api.authenticate(name);
            alert(`ようこそ、${name}さん！`);
            this.navigateTo('/tournaments');
        } catch (error) {
            alert('ログインに失敗しました。');
        }
    }

    public async handleCreateTournament(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const data = { 
            name: formData.get('name') as string, 
            description: formData.get('description') as string,
            max_num: parseInt(formData.get('max_num') as string, 10),
            rule: formData.get('rule') as string
        };
        try {
            const newTournament = await api.createTournament(data);
            alert('トーナメントを作成しました！');
            this.navigateTo(`/tournament/detail/${newTournament.id}`);
        } catch (error) {
            alert('トーナメントの作成に失敗しました。');
        }
    }

    public async handleOpenTournament() {
        if (!this.currentTournamentData) {
            alert('トーナメント情報が見つかりません。');
            return;
        }
        
        console.log('Current tournament data:', this.currentTournamentData);
        
        // 参加者数をチェック
        if (this.currentTournamentData.participants && this.currentTournamentData.participants.length < 2) {
            alert('トーナメントを開始するには最低2人以上の参加者が必要です。');
            return;
        }
        
        if (confirm('トーナメントを開始しますか？\n開始すると新しい参加者の追加ができなくなります。')) {
            try {
                console.log('Calling openTournament with ID:', this.currentTournamentData.id);
                await api.openTournament(this.currentTournamentData.id);
                alert('トーナメントを開始しました！');
                this.navigateTo(`/tournament/detail/${this.currentTournamentData.id}`);
            } catch (error) {
                console.error('Error opening tournament:', error);
                alert(`トーナメントの開始に失敗しました: ${error}`);
            }
        }
    }

    public async handleJoinTournament(tournamentId: string) {
        try {
            await api.joinTournament(tournamentId);
            alert('トーナメントに参加しました！');
            this.handleLocation();
        } catch (error) {
            alert('参加に失敗しました。');
        }
    }

    public async handleSetReady(tournamentId: string, currentStatus: string) {
        try {
            await api.setParticipantReady(tournamentId);
            this.handleLocation();
        } catch (error) {
            alert('ステータスの変更に失敗しました。');
        }
    }

    public async openTournament() {
        if (!this.currentTournamentData) return;
        if (confirm('トーナメントをオープンしますか？')) {
            try {
                this.currentTournamentData = await api.openTournament(this.currentTournamentData.id);
                alert('トーナメントがオープンされました！');
                tournamentViews.renderAdminScreen(this.appElement, this.currentTournamentData, auth.getUserId());
            } catch (error) {
                alert('トーナメントの開始に失敗しました。');
            }
        }
    }
    
    public async handlePlayAi() {
        try {
            const myUserId = auth.getUserId();
            if (!myUserId) {
                alert("ログインが必要です。");
                return;
            }
            alert("AI対戦用のルームを作成しています...");
            const roomData = await api.createAiRoom();
            
            // ★★★ 新しいゲーム画面描画関数を呼び出す
            gameViews.renderGameScreen(this.appElement, {
                type: 'ai',
                title: 'AI Battle',
                aiLevel: 0, // APIから返ってきたレベルを使うのが理想
                userId: myUserId
            });

        } catch (error) {
            alert('AI対戦の開始に失敗しました。');
            console.error(error);
        }
    }
    


    


    /**
     * トーナメントのWebSocket通信を開始する
     */
    public async handleStartGame(tournamentId: string) {
        try {
            const myUserId = auth.getUserId();
            if (!myUserId) {
                alert("ログインが必要です。");
                return;
            }

            alert("ゲームルームを取得しています...");
            const roomData = await api.getTournamentRoomId(tournamentId);
            
            if (!roomData.room_id) {
                alert("ルームIDが取得できませんでした。対戦相手が準備完了になるまでお待ちください。");
                return;
            }

            // ゲーム画面を描画し、WebSocket通信を開始
            gameViews.renderGameScreen(this.appElement, {
                type: 'room',
                title: `Tournament Match: ${this.currentTournamentData?.name || 'Tournament'}`,
                roomId: roomData.room_id,
                token: myUserId
            });

        } catch (error) {
            alert('ゲームの開始に失敗しました。');
            console.error(error);
        }
    }

    /**
     * ログアウト処理を行う
     * localStorageからユーザーIDを削除し、ログイン画面にリダイレクトする
     */
    public handleLogout(): void {
        auth.logout();
        alert('ログアウトしました。');
        this.navigateTo('/login');
    }
}
