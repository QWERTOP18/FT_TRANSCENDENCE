import { Prisma } from "@prisma/client";
import { ITransactionManager } from "../../domain/interfaces/ITransactionManager";
import { PrismaClientProvider } from "./PrismaClientProvider";

export class PrismaTransactionManager implements ITransactionManager<Prisma.TransactionClient> {

	constructor(private readonly clientProvider: PrismaClientProvider) { }

	async transaction<U>(callback: (clientManager: Prisma.TransactionClient) => Promise<U>): Promise<U> {
		return await this.clientProvider.getInstance().$transaction(async (transaction) => {
			return await callback(transaction);
		});
	}
}
