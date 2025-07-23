import { Tournament } from "../tournament/aggregate/Tournament";
import { TournamentId } from "../tournament/value-objects/TournamentId";

export interface ITournamentRepository {
	create(tournament: Tournament): Promise<void>;
	update(tournament: Tournament): Promise<void>; // histories, participantsはupsertで実行する。
	upsert(tournament: Tournament): Promise<void>;
	find(tournamentId: TournamentId): Promise<Tournament | null>;
	findAll(): Promise<Array<Tournament>>;
}
