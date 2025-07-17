import { IRepositoryFactory } from "../../../../../domain/interfaces/IRepositoryFactory";
import { History } from "../../../../../domain/tournament/entities/History";
import { NotFoundError, PermissionError } from "../../../../../domain/tournament/TournamentError";
import { ParticipantId } from "../../../../../domain/tournament/value-objects/ParticipantId";
import { ParticipantScore } from "../../../../../domain/tournament/value-objects/ParticipantScore";
import { Score } from "../../../../../domain/tournament/value-objects/Score";
import { TournamentId } from "../../../../../domain/tournament/value-objects/TournamentId";
import { AppMediator } from "../../../../authorization/actors/AppMediator";
import { AuthorizationApplicationService } from "../../../../authorization/AuthorizationApplicationService";
import { HistoryDTO } from "../../../../dto/HistoryDTO";


export type CreateTournamentHistoryApplicationServiceCommand = {
	tournament_id: string;
	winner: {
		id: string;
		score: number;
	};
	loser: {
		id: string;
		score: number;
	};
	appMediator: AppMediator;
};

export class CreateTournamentHistoryApplicationService {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: CreateTournamentHistoryApplicationServiceCommand) {
		return await this.repositoryFactory.transaction(async (repository) => {
			const authApp = new AuthorizationApplicationService();
			const authUser = authApp.createPolicyMediator(command.appMediator);
			if (authUser.can('anything', {}) == false)
				throw new PermissionError('権限がありません');
			const history = this.createHistoryFromCommand(command);
			const tournament = await repository.find(history.tournamentId);
			if (tournament == null)
				throw new NotFoundError("トーナメントが見つかりませんでした。");
			tournament.addHistory(history);
			await repository.update(tournament);
			return HistoryDTO.fromDomain(history);
		});
	}

	createHistoryFromCommand(command: CreateTournamentHistoryApplicationServiceCommand) {
		const winnerScore = new ParticipantScore({
			id: new ParticipantId(command.winner.id),
			score: new Score(command.winner.score)
		})
		const loserScore = new ParticipantScore({
			id: new ParticipantId(command.loser.id),
			score: new Score(command.loser.score)
		})
		const tournamentId = new TournamentId(command.tournament_id);
		const history = History.create(tournamentId, winnerScore, loserScore);
		return history;
	}
}
