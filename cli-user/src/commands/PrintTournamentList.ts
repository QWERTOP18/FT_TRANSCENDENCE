import { Tournament, TournamentAPI } from "../api-wrapper/tournament/TournamentAPI";


export class PrintTournamentListCommand {
	constructor(private tournaments: Tournament[]) {
	}

	public async execute() {
		const tournaments = this.tournaments;
		if (tournaments.length === 0) {
			console.log('\nNo tournaments available.');
			return null;
		}

		console.log('\n=== Available Tournaments ===');
		tournaments.forEach((tournament, index) => {
			console.log(`${index + 1}. ${tournament.name}`);
			console.log(`   Description: ${tournament.description}`);
			console.log(`   State: ${tournament.state}`);
			console.log(`   Participants: ${tournament.participants}/${tournament.max_num}`);
			console.log('');
		});
	}
}
