import { ITournamentRepository } from "./ITournamentRepository";


export interface IRepositoryFactory {
	run(callback: (repository: ITournamentRepository) => Promise<void>): Promise<void>;
	transaction(callback: (repository: ITournamentRepository) => Promise<void>): Promise<void>;
}
