// routes/admin.route.ts

import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import adminController from '../controllers/admin.controller';
import adminAuthRoutes from './adminAuth.route';
import checkPermission from '../middlewares/checkPermission';

// 📦 Admin CRUD routes
router.post('/',checkPermission('User Management', 'create'), adminController.addAdmin);
router.get('/',checkPermission('User Management', 'read'), adminController.getAdmins);
router.get('/:id',checkPermission('User Management', 'read'), adminController.getAdminById);
router.put('/:id',checkPermission('User Management', 'read'), adminController.updateAdmin);
router.delete('/:id',checkPermission('User Management', 'read'), adminController.deleteAdminById);
router.post('/create',checkPermission('User Management', 'read'), adminController.createAdminWithResetLink);


// 🔐 Auth routes for admin
router.use('/auth', adminAuthRoutes);

export default router;
