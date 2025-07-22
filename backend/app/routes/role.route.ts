import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import roleController from '../controllers/role.controller';
import authMiddleware from '../middlewares/auth.middleware';
import checkPermission from '../middlewares/checkPermission';

// Add a new role
router.post('/add',checkPermission('Roles And Permissions', 'create'), roleController.addRoleWithPermissions);

// Get all roles
router.get('/', checkPermission('Roles And Permissions', 'read'), roleController.getAllRoles);

// Get single role by ID (for editing)
router.get('/:id',checkPermission('Roles And Permissions', 'read'), roleController.getRoleById);

// Update a role
// router.put('/:id', roleController.updateRoleStatus);
router.put("/:id", checkPermission('Roles And Permissions', 'update'), roleController.updateRoleStatusAndPermissions);

// Delete a role
router.delete('/:id', checkPermission('Roles And Permissions', 'delete'), roleController.deleteRole);

export default router;