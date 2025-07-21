import { Tournament as PrismaTournament, Participant as PrismaParticipant, History as PrismaHistory } from "@prisma/client";
import { Tournament } from "../../../domain/tournament/aggregate/Tournament";
import { PrismaHistoryQueryConverter } from "./PrismaHistoryQueryConverter";
import { PrismaParticipantQueryConverter } from "./PrismaParticipantQueryConverter";
import { TournamentId } from "../../../domain/tournament/value-objects/TournamentId";
import { ParticipantId } from "../../../domain/tournament/value-objects/ParticipantId";
import { TournamentState } from "../../../domain/tournament/value-objects/TournamentState";


export class PrismaTournamentQueryConverter {
	static create(tournament: Tournament) {
		return {
			id: tournament.id.value,
			owner_id: tournament.ownerId.value,
			name: tournament.name,
			description: tournament.description,
			max_num: tournament.max_num,
			state: tournament.state.value,
			champion_id: tournament.championId?.value ?? null,
			histories: {
				create: tournament.histories
					.map(history => PrismaHistoryQueryConverter.create(history)),
			},
			participants: {
				create: tournament.participants
					.map(participant => PrismaParticipantQueryConverter.create(participant)),
			}
		}
	}

	static update(tournament: Tournament) {
		return {
			id: tournament.id.value,
			owner_id: tournament.ownerId.value,
			name: tournament.name,
			description: tournament.description,
			max_num: tournament.max_num,
			state: tournament.state.value,
			champion_id: tournament.championId?.value ?? null,
			histories: {
				upsert: tournament.histories.map(history => ({
					where: { id: history.id.value },
					update: PrismaHistoryQueryConverter.update(history),
					create: PrismaHistoryQueryConverter.create(history),
				})),
			},
			participants: {
				upsert: tournament.participants.map(participant => ({
					where: { id: participant.id.value },
					update: PrismaParticipantQueryConverter.update(participant),
					create: PrismaParticipantQueryConverter.create(participant),
				})),
			},
		}
	}

	static toDomain(tournament: PrismaTournament & { histories: PrismaHistory[]; participants: PrismaParticipant[]; }): Tournament {
		return Tournament.reconstruct({
			id: new TournamentId(tournament.id),
			ownerId: new ParticipantId(tournament.owner_id),
			name: tournament.name,
			description: tournament.description,
			max_num: tournament.max_num,
			state: new TournamentState(tournament.state),
			championId: tournament.champion_id && new ParticipantId(tournament.champion_id) || undefined,
			histories: tournament.histories
				.map(history => PrismaHistoryQueryConverter.toDomain(history)),
			participants: tournament.participants
				.map(participant => PrismaParticipantQueryConverter.toDomain(participant))
		})
	}

}
