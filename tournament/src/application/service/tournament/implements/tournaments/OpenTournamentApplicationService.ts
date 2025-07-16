import { IRepositoryFactory } from "../../../../../domain/interfaces/IRepositoryFactory";
import { NotFoundError, PermissionError } from "../../../../../domain/tournament/TournamentError";
import { TournamentId } from "../../../../../domain/tournament/value-objects/TournamentId";
import { AppUser } from "../../../../authorization/actors/AppUser";
import { AuthorizationApplicationService } from "../../../../authorization/AuthorizationApplicationService";

export type OpenTournamentApplicationServiceCommand = {
	readonly tournamentId: string;
	readonly appUser: AppUser;
}

export class OpenTournamentApplicationService {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: OpenTournamentApplicationServiceCommand) {
		return this.repositoryFactory.transaction(async (repository) => {
			const tournamentId = new TournamentId(command.tournamentId);
			const tournament = await repository.find(tournamentId);
			if (tournament == null)
				throw new NotFoundError("トーナメントが見つかりませんでした。");
			const authorizer = new AuthorizationApplicationService();
			const authUser = authorizer.createTournamentPolicyUser(command.appUser);
			if (authUser.can('update', tournament) == false)
				throw new PermissionError("権限がありません");
			tournament.open();
			await repository.update(tournament);
		});
	}
}
