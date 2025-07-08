
export interface ITransactionManager<T> {
	transaction(callback: (clientManager: T) => Promise<void>): Promise<void>;
}
