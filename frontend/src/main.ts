import { AppRouter } from './router';
import "./style.css"

const router = new AppRouter();

(window as any).router = router;
(window as any).router.handleLogout = router.handleLogout.bind(router);

router.handleLocation();
