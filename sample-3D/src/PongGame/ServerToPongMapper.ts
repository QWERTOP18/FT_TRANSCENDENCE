import { PongConfigs } from "../PongConfigs";
import { Mapper } from "../utils/Mapper";


export class ServerToPongMapper {

	static yxMapper: Mapper;
	static xzMapper: Mapper;

	static width_3d: number;
	static width_server: number;
	static height_3d: number;
	static height_server: number;
	
	static {
		this.width_3d = PongConfigs.pongWidth;
		this.width_server = PongConfigs.gameApiWidth;
		ServerToPongMapper.yxMapper = new Mapper(0, this.width_server, 0, this.width_3d);
		this.height_3d = PongConfigs.pongHeight;
		this.height_server = PongConfigs.gameApiHeight;
		ServerToPongMapper.xzMapper = new Mapper(0, this.height_server, 0, this.height_3d);
	}

	static y2xMap(value: number): number {
		return ServerToPongMapper.yxMapper.map(value);
	}

	static x2zMap(value: number): number {
		return ServerToPongMapper.xzMapper.map(value);
	}
}
