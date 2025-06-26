import { Router } from 'express';
import globalConfigController from '../controllers/globalConfig.controller';

const router = Router();

// ✅ GET all global configs (for listing)
// router.get('/', globalConfigController.getAllConfigs);

// ✅ GET config by slug
router.get('/:slug', globalConfigController.getConfigBySlug);
router.post('/language', globalConfigController.updateLanguageSetting); // ✅



export default router;