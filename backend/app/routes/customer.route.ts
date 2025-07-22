import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();
import customerController from '../controllers/customer.controller';
import customerAuthRoutes from './customerAuth.route';
import  checkPermission  from '../middlewares/checkPermission';
import authMiddleware from '../middlewares/auth.middleware';

// 📦 Customer CRUD routes
router.post('/',authMiddleware.authAdmin, checkPermission('Customers', 'create') ,  customerController.addCustomer);
router.get('/',authMiddleware.authAdmin,checkPermission('Customers', 'read'), customerController.getCustomers);
router.get('/:id',authMiddleware.authAdmin, checkPermission('Customers', 'read'),customerController.getCustomerById);
router.put('/:id',authMiddleware.authAdmin,checkPermission('Customers', 'update'), customerController.updateCustomer);
router.delete('/:id',authMiddleware.authAdmin,checkPermission('Customers', 'delete'), customerController.deleteCustomerById);

router.use('/auth', customerAuthRoutes);

export default router;
