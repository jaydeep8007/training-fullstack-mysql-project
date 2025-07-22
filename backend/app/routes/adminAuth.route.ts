// routes/adminAuth.route.ts

import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import adminAuthController from '../controllers/adminAuth.controller';
import authMiddleware from '../middlewares/auth.middleware';

// 🔐 Admin Auth routes
router.post('/login', adminAuthController.signinAdmin);
router.post('/signup', adminAuthController.signupAdmin);
router.post('/forget-password', adminAuthController.forgotPassword);
router.post('/reset-password', adminAuthController.resetPassword);
router.post('/logout', authMiddleware.authAdmin, adminAuthController.logoutAdmin);
router.get('/profile', authMiddleware.authAdmin, adminAuthController.getAdminProfile);

export default router;
