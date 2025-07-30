import { Mapper } from "./Mapper";

// サーバーのX座標を3DPongのX座標にマッピングするクラス
export class ServerXToPongXMapper extends Mapper {
	constructor() {
		const width_3d = 20
		const width_server = 600
		super(0, width_server, -width_3d / 2, width_3d / 2);
	}
}
