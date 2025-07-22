import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import adminPermissionController from '../controllers/adminPermission.controller';

router.post("/add", adminPermissionController.addPermission);
// router.get("/get", permissionController.);
export default router;