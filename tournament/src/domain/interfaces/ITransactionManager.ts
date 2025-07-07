
export interface ITransactionManager {
	transaction(callback: () => Promise<void>): Promise<void>;
}
