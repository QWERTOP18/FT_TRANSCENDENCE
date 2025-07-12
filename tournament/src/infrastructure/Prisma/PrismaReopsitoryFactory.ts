import { IRepositoryFactory } from "../../domain/interfaces/IRepositoryFactory";
import { ITournamentRepository } from "../../domain/interfaces/ITournamentRepository";
import { PrismaClientProvider } from "./PrismaClientProvider";
import { PrismaTournamentRepository } from "./PrismaTournamentRepository";

export class PrismaRepositoryFactory implements IRepositoryFactory {
	constructor(private readonly clientProvider: PrismaClientProvider) { }

	async run<T>(callback: (repository: ITournamentRepository) => Promise<T>): Promise<T> {
		const repository = new PrismaTournamentRepository({ client: this.clientProvider.getInstance() });
		return await callback(repository);
	}

	async transaction<T>(callback: (repository: ITournamentRepository) => Promise<T>): Promise<T> {
		return await this.clientProvider.getInstance().$transaction(async (transaction) => {
			const repository = new PrismaTournamentRepository({ client: transaction });
			return await callback(repository);
		});
	}
}
