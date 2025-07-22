import * as api from './services/api';
import * as gameViews from './views/gameViews';
import * as tournamentViews from './views/tournamentView';
import * as matchmakingView from './views/matchmakingView';

const MY_USER_ID = "player-a-id"; 

export class AppRouter {
    private appElement: HTMLElement;
    // private userDatabase: any = {};
    private userDatabase: any = {
        "player-a-id": { name: "K.K.", image: "https://via.placeholder.com/150/FFC107/000000?Text=A" },
        "player-b-id": { name: "Isabelle", image: "https://via.placeholder.com/150/03A9F4/FFFFFF?Text=B" },
        "player-c-id": { name: "Tom Nook", image: "https://via.placeholder.com/150/4CAF50/FFFFFF?Text=C" },
    };
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
        try {
            if (path === '/tournaments') {
                const tournaments = await api.getTournaments();
                tournamentViews.renderTournamentListScreen(this.appElement, tournaments, MY_USER_ID, this.userDatabase);

            } else if (path.startsWith('/tournament/detail/')) {
                const tournamentId = path.split('/')[3];
                const tournamentData = await api.getTournamentById(tournamentId);
                this.currentTournamentData = tournamentData;
                tournamentViews.renderTournamentScreen(this.appElement, this.currentTournamentData, this.userDatabase, MY_USER_ID);

            } else if (path.startsWith('/tournament/admin/')) {
                const tournamentId = path.split('/')[3];
                if (!tournamentId) {
                    this.navigateTo('/tournaments');
                    return;
                }
                const tournamentData = await api.getTournamentById(tournamentId);
                this.currentTournamentData = tournamentData;
                tournamentViews.renderAdminScreen(this.appElement, this.currentTournamentData, MY_USER_ID);
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
        tournamentViews.renderTournamentScreen(this.appElement, this.currentTournamentData, this.userDatabase, MY_USER_ID);
    }
    
    public startTournament() {
        alert('トーナメントが始まります！');
    }

    public async handleAdminFormSubmit(event: SubmitEvent) {
        event.preventDefault();
        if (!this.currentTournamentData) return;

        const formData = new FormData(event.target as HTMLFormElement);
        const dataToUpdate = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            max_participants: parseInt(formData.get('max_participants') as string, 10),
        };

        try {
            this.currentTournamentData = await api.updateTournament(this.currentTournamentData.id, dataToUpdate);
            alert('トーナメント情報を更新しました！');
            tournamentViews.renderAdminScreen(this.appElement, this.currentTournamentData, MY_USER_ID);
        } catch (error) {
            alert('情報の更新に失敗しました。');
        }
    }

    public async openTournament() {
        if (!this.currentTournamentData) return;
        if (confirm('トーナメントをオープンし、対戦準備を開始しますか？')) {
            try {
                this.currentTournamentData = await api.openTournament(this.currentTournamentData.id);
                alert('トーナメントがオープンされました！');
                tournamentViews.renderAdminScreen(this.appElement, this.currentTournamentData, MY_USER_ID);
            } catch (error) {
                alert('トーナメントの開始に失敗しました。');
            }
        }
    }
}
