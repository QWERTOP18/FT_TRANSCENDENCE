import { Prisma, PrismaClient } from "@prisma/client";
import { ITournamentRepository } from "../../domain/interfaces/ITournamentRepository";
import { Tournament } from "../../domain/tournament/aggregate/Tournament";
import { History } from "../../domain/tournament/entities/History";
import { Participant } from "../../domain/tournament/entities/Participant";
import { HistoryId } from "../../domain/tournament/value-objects/HistoryId";
import { ParticipantId } from "../../domain/tournament/value-objects/ParticipantId";
import { ParticipantScore } from "../../domain/tournament/value-objects/ParticipantScore";
import { ParticipantState } from "../../domain/tournament/value-objects/ParticipantState";
import { Score } from "../../domain/tournament/value-objects/Score";
import { TournamentId } from "../../domain/tournament/value-objects/TournamentId";
import { TournamentState } from "../../domain/tournament/value-objects/TournamentState";

export type PrismaTournamentRepositoryProps = {
	readonly client: PrismaClient | Prisma.TransactionClient;
}

export class PrismaTournamentRepository implements ITournamentRepository {
	private readonly _client: PrismaClient | Prisma.TransactionClient;

	constructor(props: PrismaTournamentRepositoryProps) {
		this._client = props.client;
	}

	async create(tournament: Tournament): Promise<void> {
		await this._client.tournament.create({
			data: {
				id: tournament.id.value,
				owner_id: tournament.ownerId.value,
				name: tournament.name,
				description: tournament.description,
				state: tournament.state.value,
				champion_id: tournament.championId?.value ?? null,
				histories: {
					create: tournament.histories.map(history => ({
						id: history.id.value,
						created_at: history.created_at.toISOString(),
						loser_id: history.getLoserId().value,
						loser_score: history.getLoserScore().value,
						winner_id: history.getWinnerId().value,
						winner_score: history.getWinnerScore().value,
					}))
				},
				participants: {
					create: tournament.participants.map(participant => ({
						id: participant.id.value,
						external_id: participant.externalId,
						state: participant.state.value,
					}))
				}
			}
		})
	}

	async update(tournament: Tournament): Promise<void> {
		await this._client.tournament.update({
			where: { id: tournament.id.value },
			data: {
				id: tournament.id.value,
				owner_id: tournament.ownerId.value,
				name: tournament.name,
				description: tournament.description,
				state: tournament.state.value,
				champion_id: tournament.championId?.value ?? null,
				histories: {
					update: tournament.histories.map(history => ({
						where: { id: history.id.value },
						data: {
							created_at: history.created_at.toISOString(),
							loser_id: history.getLoserId().value,
							loser_score: history.getLoserScore().value,
							winner_id: history.getWinnerId().value,
							winner_score: history.getWinnerScore().value,
						}
					}))
				},
				participants: {
					update: tournament.participants.map(participant => ({
						where: { id: participant.id.value },
						data: {
							external_id: participant.externalId,
							state: participant.state.value,
						}
					}))
				}
			}
		});
	}

	async find(tournamentId: TournamentId): Promise<Tournament | null> {
		const tournamentData = await this._client.tournament.findUnique({
			where: { id: tournamentId.value },
			include: {
				histories: true,
				participants: true
			}
		});

		if (!tournamentData) {
			return null;
		}

		return Tournament.reconstruct({
			id: new TournamentId(tournamentData.id),
			ownerId: new ParticipantId(tournamentData.owner_id),
			name: tournamentData.name,
			description: tournamentData.description,
			state: new TournamentState(tournamentData.state),
			championId: tournamentData.champion_id && new ParticipantId(tournamentData.champion_id) || undefined,
			histories: tournamentData.histories.map(history => History.reconstruct({
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
			})),
			participants: tournamentData.participants.map(participant => Participant.reconstruct({
				id: new ParticipantId(participant.id),
				externalId: participant.external_id,
				tournamentId: new TournamentId(participant.tournament_id),
				state: new ParticipantState(participant.state)
			}))
		});
	}
}
