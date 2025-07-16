import { IRepositoryFactory } from "../../../../../domain/interfaces/IRepositoryFactory";
import { TournamentDomainService } from "../../../../../domain/services/Tournament/TournamentDomainService";
import { Tournament } from "../../../../../domain/tournament/aggregate/Tournament";
import { History } from "../../../../../domain/tournament/entities/History";
import { InternalError, NotFoundError } from "../../../../../domain/tournament/TournamentError";
import { ParticipantId } from "../../../../../domain/tournament/value-objects/ParticipantId";
import { ParticipantScore } from "../../../../../domain/tournament/value-objects/ParticipantScore";
import { Score } from "../../../../../domain/tournament/value-objects/Score";
import { TournamentId } from "../../../../../domain/tournament/value-objects/TournamentId";
import { HistoryDTO } from "../../../../dto/HistoryDTO";
import { TournamentDTO } from "../../../../dto/TournamentDTO";


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
};

export class CreateTournamentHistoryApplicationService {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: CreateTournamentHistoryApplicationServiceCommand) {
		return this.repositoryFactory.transaction(async (repository) => {
			const history = this.createHistoryFromCommand(command);
			const tournament = await repository.find(history.tournamentId);
			if (tournament == null)
				throw new NotFoundError("トーナメントが見つかりませんでした。");
			console.log("トーナメントID, 履歴ID", tournament.id.value, history.tournamentId.toString());
			tournament.addHistory(history);
			repository.update(tournament);
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
