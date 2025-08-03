/**
 * デバイス検出ユーティリティクラス
 */
export class DeviceDetector {
	
	/**
	 * タッチデバイスかどうかを判定
	 */
	public static isTouchDevice(): boolean {
		return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	}

	/**
	 * モバイルデバイスかどうかを判定
	 */
	public static isMobileDevice(): boolean {
		const userAgent = navigator.userAgent.toLowerCase();
		return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
	}

	/**
	 * タブレットデバイスかどうかを判定
	 */
	public static isTabletDevice(): boolean {
		const userAgent = navigator.userAgent.toLowerCase();
		return /ipad|android(?=.*\b(?!.*mobile))/i.test(userAgent);
	}

	/**
	 * 画面サイズからモバイルかどうかを判定
	 */
	public static isMobileByScreenSize(): boolean {
		return window.innerWidth <= 768;
	}

	/**
	 * 画面サイズからタブレットかどうかを判定
	 */
	public static isTabletByScreenSize(): boolean {
		return window.innerWidth > 768 && window.innerWidth <= 1024;
	}

	/**
	 * デスクトップかどうかを判定
	 */
	public static isDesktop(): boolean {
		return !this.isTouchDevice() || (window.innerWidth > 1024 && !this.isMobileDevice());
	}

	/**
	 * 現在のデバイスタイプを取得
	 */
	public static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
		if (this.isMobileDevice() || this.isMobileByScreenSize()) {
			return 'mobile';
		} else if (this.isTabletDevice() || this.isTabletByScreenSize()) {
			return 'tablet';
		} else {
			return 'desktop';
		}
	}

	/**
	 * タッチ操作が推奨されるデバイスかどうかを判定
	 */
	public static shouldUseTouchControls(): boolean {
		return this.isTouchDevice();
	}
} 
