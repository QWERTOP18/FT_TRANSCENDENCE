import { PrismaClient } from "@prisma/client";

async function main() {
	await seed();
}

async function seed() {
	const prisma = new PrismaClient();
	const participants = {
		owner1: { id: '697a1e3f-85a9-47f8-8106-b684328ba106', external_id: "owner-1", state: "pending" }
	} as const;
	const tournamentIds = {
		id1: "df6065be-4e09-4346-99e6-5aa5200cd0c5"
	}
	await prisma.tournament.upsert({
		where: { id: tournamentIds.id1 },
		update: {},
		create: {
			id: tournamentIds.id1,
			name: "Sample Tournament",
			description: "This is a sample tournament.",
			max_num: 8,
			owner_id: participants.owner1.id,
			state: "reception",
			participants: {
				create: [
					participants.owner1
				]
			}
		}
	});
}

(async () => {
	await main();
})();
