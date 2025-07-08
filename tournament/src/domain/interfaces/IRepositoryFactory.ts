import { ITournamentRepository } from "./ITournamentRepository";


export interface IRepositoryFactory<T> {
	createTournamentRepository(client: T): ITournamentRepository;
}
