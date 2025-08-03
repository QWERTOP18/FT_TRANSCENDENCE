
export class PongConfigs {
	// AI constants
	static minAiLevel = 0 as const; // AIの最小レベル
	static maxAiLevel = 4 as const; // AIの最大レベル
	// Game API constants
	static gameApiPaddleWidth = 100 as const; // API側のパドルの幅
	static gameApiPaddlePositionOffset = 50 as const; // API側のパドルの表面の位置のオフセット
	static gameApiWidth = 600 as const; // API側のゲームの幅
	static gameApiHeight = 800 as const; // API側のゲームの高さ
	static packSize = 10 as const; // API側のパック（ボール）のサイズ
	// Pong Game
	static pongWidth = 16 as const; // 3D Pong側のフィールドの幅（より小さく）
	static pongHeight = 28 as const; // 3D Pong側のフィールドの高さ（より小さく）
}
