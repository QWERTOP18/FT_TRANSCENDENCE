import { GameState } from "../types/game";


export class DisplayStageService {

	private yMapper: Mapper;
	private xMapper: Mapper;
	private stage: Stage;

	constructor() {
		this.stage = new Stage(160, 20);
		this.yMapper = new Mapper(0, 600, 0, this.stage.ySize);
		this.xMapper = new Mapper(0, 800, 0, this.stage.xSize);
	}

	generateStage(gameState: GameState) {
		this.stage.clear();
		this.writePaddle(this.xMapper.map(50), this.yMapper.map(gameState.paddle1Y));
		this.writePaddle(this.xMapper.map(750), this.yMapper.map(gameState.paddle2Y));
		this.writeBall(gameState.ballX, gameState.ballY);
		return this.stage.generate();
	}

	writePaddle(x: number, y: number) {
		const paddleYSize = this.yMapper.map(100);
		const paddleXSize = this.xMapper.map(10);
		this.stage.fill(x, y, paddleXSize, paddleYSize, "█");
	}
	
	writeBall(x: number, y: number) {
		const ballX = this.xMapper.map(x);
		const ballY = this.yMapper.map(y);
		this.stage.fill(ballX, ballY, 1, 0,"█");
	}
}

class Stage {

	stage: string[][];

	constructor(public xSize: number, public ySize: number) {
		this.stage = this.create();
	}

	create(): string[][] {
		const stage: string[][] = [];
		for (let y = 0; y < this.ySize; y++) {
			stage[y] = [];
			for (let x = 0; x < this.xSize; x++) {
				stage[y][x] = " ";
			}
		}
		return stage;
	}

	clear() {
		this.stage = this.create();
	}

	set(y: number, x: number, value: string) {
		this.stage[y][x] = value;
	}

	generate(): string {
		return this.stage.map(row => row.join("")).join("\n");
	}

	fill(x: number, y: number, xSize: number, ySize: number, value: string) {
		for (let _y = 0; _y < this.ySize; _y++) {
			for (let _x = 0; _x < this.xSize; _x++) {
				if (x <= _x && _x <= x + xSize
					&& y <= _y && _y <= y + ySize) {
					this.set(_y, _x, value);
				}
			}
		}
	}
}


class Mapper {
	constructor(
		private inMin: number, 
		private inMax: number, 
		private outMin: number, 
		private outMax: number) {
	}

	public map(value: number): number {
		return Math.floor((value - this.inMin) * (this.outMax - this.outMin) / (this.inMax - this.inMin)) + this.outMin;
	}
}
