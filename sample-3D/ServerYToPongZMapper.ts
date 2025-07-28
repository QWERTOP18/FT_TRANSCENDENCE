import { Mapper } from "./Mapper";


export class ServerToPongMapper {

	static xxMapper: Mapper;
	static yzMapper: Mapper;
	
	static {
		const width_3d = 20;
		const width_server = 600;
		ServerToPongMapper.xxMapper = new Mapper(0, width_server, -width_3d / 2, width_3d / 2);
		const height_3d = 30;
		const height_server = 800;
		ServerToPongMapper.yzMapper = new Mapper(0, height_server, -height_3d / 2, height_3d / 2);
	}

	static x2xMap(value: number): number {
		return ServerToPongMapper.xxMapper.map(value);
	}

	static y2zMap(value: number): number {
		return ServerToPongMapper.yzMapper.map(value);
	}
}
