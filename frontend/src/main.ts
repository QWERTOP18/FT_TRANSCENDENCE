import { AppRouter } from './router';
import "./style.css"

const router = new AppRouter();

(window as any).router = router;

router.handleLocation();