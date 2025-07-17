import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import resourceController from '../controllers/resource.controller';

router.get("/", resourceController.getAllResources); // GET /api/permissions/resources

export default router;