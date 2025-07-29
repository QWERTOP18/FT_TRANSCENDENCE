import * as api from './services/api';
import * as auth from './services/auth';
import * as gameViews from './views/gameViews';
import * as tournamentViews from './views/tournamentView';
import * as matchmakingView from './views/matchmakingView';
import * as authView from './views/authView';

export class AppRouter {
    private appElement: HTMLElement;
    private userDatabase: any = {}; // ユーザー情報をここにキャッシュ
    private currentTournamentData: any = null;

    constructor() {
        this.appElement = document.getElementById('app')!;
        window.addEventListener('popstate', () => this.handleLocation());
    }
    
    public async init() {
        // ここでユーザー一覧などを取得してキャッシュするのが理想
        // try {
        //     this.userDatabase = await api.getUsers();
        // } catch (error) {
        //     console.error("Failed to fetch users:", error);
        // }
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
                    tournamentViews.renderTournamentListScreen(this.appElement, tournaments, auth.getUserId(), this.userDatabase);
                    break;
                case path.startsWith('/tournament/detail/'):
                    const detailId = path.split('/')[3];
                    const detailData = await api.getTournamentById(detailId);
                    this.currentTournamentData = detailData;
                    tournamentViews.renderTournamentScreen(this.appElement, detailData, this.userDatabase, auth.getUserId());
                    break;
                case path.startsWith('/tournament/admin/'):
                    const adminId = path.split('/')[3];
                    if (!adminId) { this.navigateTo('/tournaments'); return; }
                    const adminData = await api.getTournamentById(adminId);
                    this.currentTournamentData = adminData;
                    tournamentViews.renderAdminScreen(this.appElement, adminData, auth.getUserId());
                    break;
                case path === '/matchmaking':
                    matchmakingView.renderMatchmakingScreen(this.appElement);
                    break;
                case path === '/game':
                    gameViews.renderGameScreen(this.appElement);
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
        const data = { name: formData.get('name') as string, description: formData.get('description') as string };
        try {
            const newTournament = await api.createTournament(data);
            alert('トーナメントを作成しました！');
            this.navigateTo(`/tournament/detail/${newTournament.id}`);
        } catch (error) {
            alert('トーナメントの作成に失敗しました。');
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
            if (currentStatus === 'pending' || currentStatus === 'accepted') {
                await api.setParticipantReady(tournamentId);
            } else {
                await api.setParticipantCancel(tournamentId);
            }
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
        const responseDisplay = document.getElementById('response-data');
        if (!responseDisplay) return;
        responseDisplay.textContent = 'Creating AI room...';
        try {
            const data = await api.createAiRoom();
            responseDisplay.textContent = JSON.stringify(data, null, 2);
            alert('AI対戦ルームが作成されました！');
            this.navigateTo('/game');
        } catch (error) {
            responseDisplay.textContent = `エラーが発生しました: ${error as string}`;
        }
    }
    
    public async handleCreateRoom() {
        const responseDisplay = document.getElementById('response-data');
        if (!responseDisplay) return;
        responseDisplay.textContent = 'Creating multiplayer room...';
        try {
            const data = await api.createRoom();
            responseDisplay.textContent = JSON.stringify(data, null, 2);
            alert('マルプレイヤー用ルームが作成されました！');
            this.navigateTo('/game');
        } catch (error) {
            responseDisplay.textContent = `エラーが発生しました: ${error as string}`;
        }
    }
}