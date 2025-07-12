import { PrismaClient } from "@prisma/client";
import { IClientProvider } from "../../domain/interfaces/IClientProvider";

export class PrismaClientProvider implements IClientProvider<PrismaClient> {

	private static instance: PrismaClient;

	getInstance(): PrismaClient {
		if (!PrismaClientProvider.instance) {
			PrismaClientProvider.instance = new PrismaClient();
		}
		return PrismaClientProvider.instance;
	}
}
