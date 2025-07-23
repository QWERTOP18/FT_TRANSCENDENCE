import { History as PrismaHistory } from "@prisma/client";
import { History } from "../../../domain/tournament/entities/History";
import { HistoryId } from "../../../domain/tournament/value-objects/HistoryId";
import { TournamentId } from "../../../domain/tournament/value-objects/TournamentId";
import { ParticipantScore } from "../../../domain/tournament/value-objects/ParticipantScore";
import { ParticipantId } from "../../../domain/tournament/value-objects/ParticipantId";
import { Score } from "../../../domain/tournament/value-objects/Score";

export class PrismaHistoryQueryConverter {
	static create(history: History) {
		return {
			id: history.id.value,
			created_at: history.created_at.toISOString(),
			loser_id: history.getLoserId().value,
			loser_score: history.getLoserScore().value,
			winner_id: history.getWinnerId().value,
			winner_score: history.getWinnerScore().value,
		};
	}

	static update(history: History) {
		return {
			created_at: history.created_at.toISOString(),
			loser_id: history.getLoserId().value,
			loser_score: history.getLoserScore().value,
			winner_id: history.getWinnerId().value,
			winner_score: history.getWinnerScore().value,
		};
	}

	static toDomain(history: PrismaHistory): History {
		return History.reconstruct({
			id: new HistoryId(history.id),
			tournamentId: new TournamentId(history.tournament_id),
			loser: new ParticipantScore({
				id: new ParticipantId(history.loser_id),
				score: new Score(history.loser_score)
			}),
			winner: new ParticipantScore({
				id: new ParticipantId(history.winner_id),
				score: new Score(history.winner_score)
			}),
			created_at: new Date(history.created_at)
		});
	}
}
