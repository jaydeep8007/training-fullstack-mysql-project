import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import employeeController from '../controllers/employee.controller';
import checkPermission from '../middlewares/checkPermission';
import authMiddleware from '../middlewares/auth.middleware';

// 📦 Employee CRUD routes
router.post('/',authMiddleware.authAdmin, checkPermission('Employees', 'create'), employeeController.createEmployee);
router.get('/',authMiddleware.authAdmin, checkPermission('Employees', 'read'), employeeController.getAllEmployees);
// router.get("/:id", employeeController.getEmployeeById);
router.put('/:id',authMiddleware.authAdmin, checkPermission('Employees', 'update'), employeeController.updateEmployeeById);
router.delete('/:id',authMiddleware.authAdmin, checkPermission('Employees', 'delete'), employeeController.deleteEmployeeById);

export default router;
