import { Prisma, PrismaClient } from "@prisma/client";
import { IRepositoryFactory } from "../../domain/interfaces/IRepositoryFactory";
import { ITournamentRepository } from "../../domain/interfaces/ITournamentRepository";
import { PrismaTournamentRepository } from "./PrismaTournamentRepository";

export class PrismaRepositoryFactory implements IRepositoryFactory<PrismaClient | Prisma.TransactionClient> {
	createTournamentRepository(client: PrismaClient | Prisma.TransactionClient): ITournamentRepository {
		return new PrismaTournamentRepository({ client });
	}
}
