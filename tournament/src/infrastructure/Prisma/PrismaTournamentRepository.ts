import { Prisma, PrismaClient } from "@prisma/client";
import { ITournamentRepository } from "../../domain/interfaces/ITournamentRepository";
import { Tournament } from "../../domain/tournament/aggregate/Tournament";
import { TournamentId } from "../../domain/tournament/value-objects/TournamentId";
import { PrismaTournamentQueryConverter } from "./PrismaQueryConverter/PrismaTournamentQueryConverter";

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
			data: PrismaTournamentQueryConverter.create(tournament)
		})
	}

	async update(tournament: Tournament): Promise<void> {
		await this._client.tournament.update({
			where: { id: tournament.id.value },
			data: PrismaTournamentQueryConverter.update(tournament),
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

		return PrismaTournamentQueryConverter.toDomain(tournamentData);
	}

	async findAll(): Promise<Array<Tournament>> {
		const tournaments = await this._client.tournament.findMany({
			take: 10,
			include: {
				histories: true,
				participants: true
			}
		})

		return tournaments
			.map((tournament) => PrismaTournamentQueryConverter.toDomain(tournament));
	}
}
