import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

import roleController from '../controllers/role.controller';

// Add a new role
router.post('/add', roleController.addRoleWithPermissions);

// Get all roles
router.get('/', roleController.getAllRoles);

// Get single role by ID (for editing)
router.get('/:id', roleController.getRoleById);

// Update a role
router.put('/:id', roleController.updateRole);

// Delete a role
router.delete('/:id', roleController.deleteRole);

export default router;