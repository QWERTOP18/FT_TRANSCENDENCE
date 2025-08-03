import { AppRouter } from './router';
import "./style.css"
import { changeLanguage } from './i18n';

const router = new AppRouter();

(window as any).router = router;
(window as any).changeLanguage = changeLanguage;
(window as any).router.handleLogout = router.handleLogout.bind(router);

router.handleLocation();
