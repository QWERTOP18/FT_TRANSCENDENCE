import { AppRouter } from './router';

const router = new AppRouter();
(window as any).router = router;
router.handleLocation();
