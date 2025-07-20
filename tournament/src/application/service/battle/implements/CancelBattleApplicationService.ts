import { IRepositoryFactory } from "../../../../domain/interfaces/IRepositoryFactory";
import { NotFoundError } from "../../../../domain/tournament/TournamentError";
import { ParticipantId } from "../../../../domain/tournament/value-objects/ParticipantId";
import { TournamentId } from "../../../../domain/tournament/value-objects/TournamentId";

export type CancelBattleParticipantApplicationServiceCommand = {
	readonly tournamentId: string;
	readonly firstParticipantId: string;
	readonly secondParticipantId: string;
}

export class CancelBattleParticipantApplicationService {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: CancelBattleParticipantApplicationServiceCommand) {
		return this.repositoryFactory.transaction(async (repository) => {
			const tournamentId = new TournamentId(command.tournamentId);
			const firstParticipantId = new ParticipantId(command.firstParticipantId);
			const secondParticipantId = new ParticipantId(command.secondParticipantId);
			const tournament = await repository.find(tournamentId);
			if (tournament == null)
				throw new NotFoundError("トーナメントが見つかりませんでした。");
			const firstParticipant = tournament.getParticipantById(firstParticipantId);
			const secondParticipant = tournament.getParticipantById(secondParticipantId);
			if (!firstParticipant || !secondParticipant)
				throw new NotFoundError("参加者が見つかりませんでした。");
			tournament.cancelBattle(firstParticipant, secondParticipant);
			await repository.update(tournament);
		});
	}
}
