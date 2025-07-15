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
        this.toggleTournamentMenu(true);
        history.pushState({}, '', path);
        this.handleLocation();
    }

    public handleLocation() {
        const path = window.location.pathname;

        if (path.startsWith('/tournament/admin/')) {
            const tournamentId = path.split('/')[3];
            this.currentTournamentData = mockData.tournament2P_before; // 実際のアプリではIDでデータを探す
            tournamentViews.renderAdminScreen(this.appElement, this.currentTournamentData);
        } else if (path.startsWith('/tournament/')) {
            const participantCount = parseInt(path.split('/')[2]);
            const state = path.split('/')[3] || 'before';
            let data;
            if (participantCount === 2) {
                data = state === 'before' ? mockData.tournament2P_before : mockData.tournament2P_after;
            } else {
                data = state === 'before' ? mockData.tournament3P_before : mockData.tournament3P_after;
            }
            this.currentTournamentData = JSON.parse(JSON.stringify(data));
            tournamentViews.renderTournamentScreen(this.appElement, this.currentTournamentData);
            if (state === 'before' && participantCount > 0) {
                setTimeout(() => { alert('Readyボタンを押してください'); }, 100);
            }
        } else {
            switch (path) {
                case '/matchmaking': matchmakingView.renderMatchmakingScreen(this.appElement); break;
                case '/game': gameViews.renderGameScreen(this.appElement); break;
                case '/win': gameViews.renderResultScreen(this.appElement, true); break;
                case '/lose': gameViews.renderResultScreen(this.appElement, false); break;
                case '/error': gameViews.renderErrorScreen(this.appElement); break;
                default: this.navigateTo('/tournament/3/after'); break;
            }
        }
    }

    public toggleTournamentMenu(forceClose = false) {
        const modal = document.getElementById('tournament-menu-modal');
        if (!modal) return;
        if (forceClose) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        } else {
            modal.classList.toggle('hidden');
            modal.classList.toggle('flex');
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

    public closeTournamentRegistration() {
        if (confirm('本当に参加者の募集を締め切りますか？この操作は元に戻せません。')) {
            this.currentTournamentData.state = 'ready_to_start';
            alert('募集を締め切りました。トーナメントが開始可能です。');
            tournamentViews.renderAdminScreen(this.appElement, this.currentTournamentData);
        }
    }
}
