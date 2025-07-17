import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import permissionController from '../controllers/permission.controller';

router.post("/add", permissionController.addPermission);
// router.get("/get", permissionController.);
export default router;