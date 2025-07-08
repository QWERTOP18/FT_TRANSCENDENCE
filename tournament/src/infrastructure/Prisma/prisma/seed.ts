import { PrismaClient } from "@prisma/client";

async function main() {
	await seed();
}

async function seed() {
	const prisma = new PrismaClient();
	const ownerId = crypto.randomUUID();
	await prisma.tournament.create({
		data: {
			name: "Sample Tournament",
			description: "This is a sample tournament.",
			owner_id: ownerId,
			state: "reception",
			participants: {
				create: [
					{ id: ownerId, external_id: "user-1", state: "pending" }
				]
			}
		}
	});
}

(async () => {
	await main();
})();
