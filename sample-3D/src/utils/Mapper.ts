

export class Mapper {
	constructor(
		private inMin: number, 
		private inMax: number, 
		private outMin: number, 
		private outMax: number) {
	}

	public map(value: number): number {
		return ((value - this.inMin) * (this.outMax - this.outMin)) / (this.inMax - this.inMin) + this.outMin;
	}
}
