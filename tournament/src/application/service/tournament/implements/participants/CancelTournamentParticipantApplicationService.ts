import { IRepositoryFactory } from "../../../../../domain/interfaces/IRepositoryFactory";
import { NotFoundError, PermissionError, UsageError } from "../../../../../domain/tournament/TournamentError";
import { ParticipantId } from "../../../../../domain/tournament/value-objects/ParticipantId";
import { ParticipantState } from "../../../../../domain/tournament/value-objects/ParticipantState";
import { TournamentId } from "../../../../../domain/tournament/value-objects/TournamentId";
import { AppUser } from "../../../../authorization/actors/AppUser";
import { AuthorizationApplicationService } from "../../../../authorization/AuthorizationApplicationService";


export type CancelTournamentParticipantApplicationServiceCommand = {
	readonly tournamentId: string;
	readonly participantId: string;
	readonly appUser: AppUser;
}


export class CancelTournamentParticipantApplicationService {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: CancelTournamentParticipantApplicationServiceCommand) {
		return this.repositoryFactory.transaction(async (repository) => {
			const tournamentId = new TournamentId(command.tournamentId);
			const participantId = new ParticipantId(command.participantId);
			const tournament = await repository.find(tournamentId);
			if (tournament == null)
				throw new NotFoundError("トーナメントが見つかりませんでした。");
			const participant = tournament.getParticipantById(participantId);
			if (!participant)
				throw new NotFoundError("参加者が見つかりませんでした。");
			const authApp = new AuthorizationApplicationService();
			const authUser = authApp.createParticipantPolicyUser(command.appUser);
			if (authUser.can('update', participant) == false)
				throw new PermissionError('権限がありません');
			if (participant.state.equals(new ParticipantState("ready")) == false)
				throw new UsageError("参加者は「ready」状態でなければキャンセルできません。");
			tournament.cancel(participant);
			await repository.update(tournament);
		});
	}
}
