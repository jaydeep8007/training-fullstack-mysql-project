import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import roleController from '../controllers/role.controller';
import authMiddleware from '../middlewares/auth.middleware';
import checkPermission from '../middlewares/checkPermission';


router.post('/add',checkPermission('Roles And Permissions', 'create'), roleController.addRoleWithPermissions);
router.get('/', checkPermission('Roles And Permissions', 'read'), roleController.getAllRoles);
router.get('/:id',checkPermission('Roles And Permissions', 'read'), roleController.getRoleById);
router.put("/:id", checkPermission('Roles And Permissions', 'update'), roleController.updateRoleStatusAndPermissions);
router.delete('/:id', checkPermission('Roles And Permissions', 'delete'), roleController.deleteRole);
router.get('/:id/assigned-admins', roleController.getAssignedAdminCount);
export default router;