import * as api from './services/api';
import * as gameViews from './views/gameViews';
import * as tournamentViews from './views/tournamentView';
import * as matchmakingView from './views/matchmakingView';
import * as authView from './views/authView';
import { getUserId } from './services/auth';

export class AppRouter {
    private appElement: HTMLElement;
    private userDatabase: any = {}; // ユーザー情報をここにキャッシュ
    private currentTournamentData: any = null;

    constructor() {
        this.appElement = document.getElementById('app')!;
        window.addEventListener('popstate', () => this.handleLocation());
    }
    
    /**
     * アプリケーションの初期化処理
     * 最初に必要なグローバルデータ（ユーザー情報など）をAPIから取得する
     */
    public async init() {
        try {
            // 最初にユーザー情報を取得してキャッシュに保存
            // this.userDatabase = await api.getUsers();
            // 上記APIがまだないため、仮のデータを設定
            this.userDatabase = {
                "player-a-id": { name: "K.K.", image: "https://via.placeholder.com/150/FFC107/000000?Text=A" },
                "player-b-id": { name: "Isabelle", image: "https://via.placeholder.com/150/03A9F4/FFFFFF?Text=B" },
                "player-c-id": { name: "Tom Nook", image: "https://via.placeholder.com/150/4CAF50/FFFFFF?Text=C" },
            };
        } catch (error) {
            console.error("Failed to initialize app with user data:", error);
        }
        // データの準備ができてから最初の画面描画を実行
        this.handleLocation();
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
        try {
            if (path === '/tournaments/new') {
                tournamentViews.renderCreateTournamentScreen(this.appElement);
            } else if (path === '/tournaments') {
                const tournaments = await api.getTournaments();
                const myUserId = getUserId();
                tournamentViews.renderTournamentListScreen(this.appElement, tournaments, myUserId, this.userDatabase);
            } else if (path.startsWith('/tournament/detail/')) {
                const tournamentId = path.split('/')[3];
                const tournamentData = await api.getTournamentById(tournamentId);
                this.currentTournamentData = tournamentData;
                tournamentViews.renderTournamentScreen(this.appElement, this.currentTournamentData, this.userDatabase, getUserId());
            } else if (path.startsWith('/tournament/admin/')) {
                const tournamentId = path.split('/')[3];
                if (!tournamentId) { this.navigateTo('/tournaments'); return; }
                const tournamentData = await api.getTournamentById(tournamentId);
                this.currentTournamentData = tournamentData;
                tournamentViews.renderAdminScreen(this.appElement, this.currentTournamentData, getUserId());
            } else {
                switch (path) {
                    case '/signup':
                        authView.renderSignupScreen(this.appElement);
                        break;
                    case '/matchmaking':
                        matchmakingView.renderMatchmakingScreen(this.appElement);
                        break;
                    case '/game':
                        gameViews.renderGameScreen(this.appElement);
                        break;
                    case '/win':
                        gameViews.renderResultScreen(this.appElement, true);
                        break;
                    case '/lose':
                        gameViews.renderResultScreen(this.appElement, false);
                        break;
                    case '/error':
                        gameViews.renderErrorScreen(this.appElement);
                        break;
                    default:
                        this.navigateTo('/tournaments');
                        break;
                }
            }
        } catch (error) {
            console.error("Routing failed:", error);
            gameViews.renderErrorScreen(this.appElement);
        }
    }

    // --- インタラクティブな操作を処理するメソッド群 ---

    public async callFindMatch() {
        const responseDisplay = document.getElementById('response-data');
        if (!responseDisplay) return;
        responseDisplay.textContent = 'Requesting...';
        try {
            const data = await api.findMatch();
            responseDisplay.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            responseDisplay.textContent = `エラーが発生しました: ${error as string}`;
        }
    }

    public async handleSignup(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const name = formData.get('name') as string;

        if (!name) {
            alert('名前を入力してください。');
            return;
        }

        try {
            const data = await api.signup(name);
            alert(`ようこそ、${data.name}さん！ユーザーが作成されました。`);
            // サインアップ成功後、トーナメント一覧へ遷移
            this.navigateTo('/tournaments');
        } catch (error) {
            alert('サインアップに失敗しました。ユーザー名が既に使用されている可能性があります。');
        }
    }
    
    public async handleCreateTournament(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string
        };
        try {
            const newTournament = await api.createTournament(data);
            alert('トーナメントを作成しました！');
            this.navigateTo(`/tournament/detail/${newTournament.id}`);
        } catch (error) {
            alert('トーナメントの作成に失敗しました。');
        }
    }

    public async handleJoinTournament(tournamentId: string) {
        const myUserId = getUserId();
        if (!myUserId) { alert("サインアップまたはログインが必要です。"); return; }
        try {
            await api.joinTournament(tournamentId, myUserId);
            alert('トーナメントに参加しました！');
            this.handleLocation(); // 画面を再読み込みして参加者リストを更新
        } catch (error) {
            alert('参加に失敗しました。');
        }
    }

    public async handleSetReady(tournamentId: string, participantId: string, currentStatus: string) {
        try {
            if (currentStatus === 'pending' || currentStatus === 'accepted') {
                await api.setParticipantReady(tournamentId, participantId);
            } else {
                await api.setParticipantCancel(tournamentId, participantId);
            }
            this.handleLocation(); // 画面を再読み込みしてステータスを更新
        } catch (error) {
            alert('ステータスの変更に失敗しました。');
        }
    }

    public async openTournament() {
        if (!this.currentTournamentData) return;
        if (confirm('トーナメントをオープンし、対戦準備を開始しますか？')) {
            try {
                this.currentTournamentData = await api.openTournament(this.currentTournamentData.id);
                alert('トーナメントがオープンされました！');
                tournamentViews.renderAdminScreen(this.appElement, this.currentTournamentData, getUserId());
            } catch (error) {
                alert('トーナメントの開始に失敗しました。');
            }
        }
    }
}
