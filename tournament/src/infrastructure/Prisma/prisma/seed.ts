import { PrismaClientProvider } from "../PrismaClientProvider";
import { PrismaTournamentQueryConverter } from "../PrismaQueryConverter/PrismaTournamentQueryConverter";
import { PrismaRepositoryFactory } from "../PrismaReopsitoryFactory";

async function main() {
	await seed();
}

async function seed() {
	const tournamentIds = {
		id1: "df6065be-4e09-4346-99e6-5aa5200cd0c5"
	}
	const tournament = PrismaTournamentQueryConverter.toDomain({
		id: tournamentIds.id1,
		owner_id: "697a1e3f-85a9-47f8-8106-b684328ba106",
		name: "Sample Tournament",
		description: "This is a simple tournament.",
		max_num: 8,
		state: "reception",
		rule: "simple",
		champion_id: null,
		histories: [],
		participants: [
			{ external_id: "owner-1", id: "697a1e3f-85a9-47f8-8106-b684328ba106", name: "tanaka", state: "pending", tournament_id: tournamentIds.id1 }
		],
	})
	const prismaFactory = new PrismaRepositoryFactory(new PrismaClientProvider());
	await prismaFactory.transaction(async (repository) => {
		await repository.upsert(tournament);
	});
}

(async () => {
	await main();
})();
