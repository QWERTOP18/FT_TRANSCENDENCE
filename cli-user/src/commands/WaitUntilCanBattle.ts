import { BattleAPI, BattleRoomSchema } from "../api-wrapper/battle/BattleAPI";
import { UsageError } from "../errors/UsageError";


export class WaitUntilCanBattle {

	public async waitForBattleReady(tournamentId: string, userId: string) {
		const battleAPI = new BattleAPI();
		return await new Promise<BattleRoomSchema>(async (resolve, reject) => {
			process.on('SIGINT', endReady);
			process.on('SIGTERM', endReady);

			function endReady() {
				try {
					console.log('\nWaiting cancelled.');
					cleanup();
					reject(new UsageError('Cancelled waiting for battle ready.'));
				}
				catch (error) {
					reject(error);
				}
			}

			function cleanup() {
				process.removeListener('SIGINT', endReady);
				process.removeListener('SIGTERM', endReady);
			}

			while (true) {
				try {
					const roomData = await battleAPI.getTournamentRoomId(tournamentId, userId);
					cleanup();
					resolve(roomData);
					return;
				}
				catch (error) {
				}
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		});
	}
}


async function wait() {
	return await new Promise((resolve, reject) => {
		let hoge = 0;
		const end = 3;
		let polling = false;
		const interval = setInterval(async () => {
			if (polling) return;
			polling = true;
			hoge++
			console.log('Waiting...', hoge);
			try {
				throw new Error('Simulated error');
			}
			catch (error) {
			}
			if (hoge >= end) {
				console.log('Done waiting');
				cleanup();
				resolve('done waiting');
			}
			polling = false;
		}, 1000);

		process.on('SIGINT', () => sigintHandler());
		process.on('SIGTERM', () => sigtermHandler());

		function sigintHandler() {
			endReady();
		}

		function sigtermHandler() {
			endReady();
		}

		function endReady() {
			try {
				cleanup();
				reject(new Error('Cancelled waiting for battle ready.'));
			}
			catch (error) {
				reject(error);
			}
		}

		function cleanup() {
			clearInterval(interval);
			process.removeListener('SIGINT', endReady);
			process.removeListener('SIGTERM', endReady);
		}

	});
}
