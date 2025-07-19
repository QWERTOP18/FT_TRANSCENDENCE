import * as mockData from './data/mockData';
import * as gameViews from './views/gameViews';
import * as tournamentViews from './views/tournamentView';
import * as matchmakingView from './views/matchmakingView';
import * as api from './services/api';

export class AppRouter {
    private appElement: HTMLElement;
    private currentTournamentData: any = null;

    constructor() {
        this.appElement = document.getElementById('app')!;
        window.addEventListener('popstate', () => this.handleLocation());
    }

    public navigateTo(path: string) {
        if (window.location.pathname === path) return;
        
        // ページ遷移時にメニューが開いていれば閉じる
        this.toggleTournamentMenu(true);

        history.pushState({}, '', path);
        this.handleLocation();
    }

    public async handleLocation() {
        const path = window.location.pathname;

        try {
            if (path === '/tournaments') {
                const tournaments = await api.getTournaments(); // API呼び出し
                tournamentViews.renderTournamentListScreen(this.appElement, tournaments);
            } else if (path.startsWith('/tournament/detail/')) {
                const tournamentId = path.split('/')[3];
                const tournamentData = await api.getTournamentById(tournamentId);
                this.currentTournamentData = tournamentData;
                tournamentViews.renderTournamentScreen(this.appElement, this.currentTournamentData);

            } else if (path.startsWith('/tournament/admin/')) {
                const tournamentId = path.split('/')[3];
                const tournamentData = await api.getTournamentById(tournamentId);
                this.currentTournamentData = tournamentData;
                tournamentViews.renderAdminScreen(this.appElement, this.currentTournamentData);
            } else {
                switch (path) {
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

    public toggleTournamentMenu(forceClose = false) {
        const modal = document.getElementById('tournament-menu-modal');
        if (!modal) return;
        if (forceClose) {
            if (!modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        } else {
            modal.classList.toggle('hidden');
            modal.classList.toggle('flex');
        }
    }

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

    public togglePlayerStatus(playerId: string) {
        if (!this.currentTournamentData) return;
        const player = this.currentTournamentData.participants.find((p: any) => p.id === playerId);
        if (player) {
            player.status = player.status === 'pending' ? 'ready' : 'pending';
        }
        tournamentViews.renderTournamentScreen(this.appElement, this.currentTournamentData);
    }
    
    public startTournament() {
        alert('トーナメントが始まります！');
    }

    public handleAdminFormSubmit(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        this.currentTournamentData.name = formData.get('name') as string;
        this.currentTournamentData.description = formData.get('description') as string;
        this.currentTournamentData.max_participants = parseInt(formData.get('max_participants') as string, 10);

        alert('トーナメント情報を更新しました！');

        tournamentViews.renderAdminScreen(this.appElement, this.currentTournamentData);
    }

    public async openTournament() {
        if (!this.currentTournamentData) return;
        if (confirm('トーナメントをオープンし、対戦準備を開始しますか？')) {
            try {
                const updatedTournament = await api.openTournament(this.currentTournamentData.id); // API呼び出し
                this.currentTournamentData = updatedTournament;
                alert('トーナメントがオープンされました！');
                tournamentViews.renderAdminScreen(this.appElement, this.currentTournamentData);
            } catch (error) {
                alert('トーナメントの開始に失敗しました。');
            }
        }
    }
}
