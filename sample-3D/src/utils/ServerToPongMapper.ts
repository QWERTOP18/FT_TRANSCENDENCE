import { Mapper } from "./Mapper";


export class ServerToPongMapper {

	static yxMapper: Mapper;
	static xzMapper: Mapper;

	static paddleWidth_server: number;

	static width_3d: number;
	static width_server: number;
	static height_3d: number;
	static height_server: number;
	
	static {
		this.paddleWidth_server = 100;
		this.width_3d = 20;
		this.width_server = 600;
		ServerToPongMapper.yxMapper = new Mapper(0, this.width_server, 0, this.width_3d);
		this.height_3d = 30;
		this.height_server = 800;
		ServerToPongMapper.xzMapper = new Mapper(0, this.height_server, 0, this.height_3d);
	}

	static y2xMap(value: number): number {
		return ServerToPongMapper.yxMapper.map(value);
	}

	static x2zMap(value: number): number {
		return ServerToPongMapper.xzMapper.map(value);
	}
}
