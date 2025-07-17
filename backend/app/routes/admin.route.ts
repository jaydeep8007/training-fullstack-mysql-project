// routes/admin.route.ts

import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import adminController from '../controllers/admin.controller';
import adminAuthRoutes from './adminAuth.route';

// 📦 Admin CRUD routes
router.post('/', adminController.addAdmin);
router.get('/', adminController.getAdmins);
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdminById);


// 🔐 Auth routes for admin
router.use('/auth', adminAuthRoutes);

export default router;
