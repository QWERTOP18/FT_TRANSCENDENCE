import { ITournamentRepository } from "./ITournamentRepository";


export interface IRepositoryFactory {
	run<T>(callback: (repository: ITournamentRepository) => Promise<T>): Promise<T>;
	transaction<T>(callback: (repository: ITournamentRepository) => Promise<T>): Promise<T>;
}
