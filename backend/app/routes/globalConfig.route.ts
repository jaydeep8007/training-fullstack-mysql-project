import { Router } from 'express';
import globalConfigController from '../controllers/globalConfig.controller';

const router = Router();

// ✅ Route to get all viewable global configs
router.get("/", globalConfigController.getAllConfigs);

// ✅ GET config by slug
router.get('/:slug', globalConfigController.getConfigBySlug);
router.put("/:slug", globalConfigController.updateGlobalConfig);




export default router;