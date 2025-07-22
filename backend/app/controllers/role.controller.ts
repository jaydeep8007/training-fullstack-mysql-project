import { Request, Response, NextFunction } from 'express';
import roleModel from '../models/role.model'; // your Sequelize model
import { responseHandler } from '../services/responseHandler.service'; // Optional if you're using centralized responses
import { resCode } from '../constants/resCode';
import resourceModel from '../models/resourse.model';
import adminPermissionModel from '../models/permission.model';

export const addRoleWithPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role_name, permissions, role_status = 'active' } = req.body;

    if (!role_name || !Array.isArray(permissions) || permissions.length === 0) {
      return responseHandler.error(res, 'Role name and permissions are required', 400);
    }

    // Optional: validate role_status
    if (!['active', 'inactive'].includes(role_status)) {
      return responseHandler.error(res, "Invalid role status. Use 'active' or 'inactive'.", 400);
    }

    // Check if role already exists
    const existingRole = await roleModel.findOne({ where: { role_name } });
    if (existingRole) {
      return responseHandler.error(res, 'Role already exists', 400);
    }

    // Create new role with role_status
    const newRole = await roleModel.create({ role_name, role_status });

    // Add permissions
    const addedPermissions = await Promise.all(
      permissions.map(async (perm: any) => {
        const {
          resource_id,
          admin_permission_can_create,
          admin_permission_can_read,
          admin_permission_can_update,
          admin_permission_can_delete,
        } = perm;

        return await adminPermissionModel.create({
          role_id: newRole.role_id,
          resource_id,
          admin_permission_can_create,
          admin_permission_can_read,
          admin_permission_can_update,
          admin_permission_can_delete,
        });
      }),
    );

    return responseHandler.success(res, 'Role and permissions added successfully', {
      role: newRole,
      permissions: addedPermissions,
    });
  } catch (error) {
    next(error);
  }
};

// const addRole = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { role_name, permissions, role_status = "active" } = req.body;

//     if (!role_name || !permissions || !Array.isArray(permissions)) {
//       return responseHandler.error(res, "Role name and permissions are required", 400);
//     }

//     // Create the role with status
//     const newRole = await roleModel.create({ role_name, role_status });

//     // Create permissions
//     const permissionEntries = permissions.map((perm) => ({
//       role_id: newRole.role_id,
//       resource_id: perm.resource_id,
//       admin_permission_can_create: perm.can_create || false,
//       admin_permission_can_read: perm.can_read || false,
//       admin_permission_can_update: perm.can_update || false,
//       admin_permission_can_delete: perm.can_delete || false,
//     }));

//     const addedPermissions = await adminPermissionModel.bulkCreate(permissionEntries);

//     return responseHandler.success(res, "Role and permissions added successfully", {
//       role: newRole,
//       permissions: addedPermissions,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await roleModel.findAll({
      attributes: ['role_id', 'role_name', 'role_status'],

      include: [
        {
          model: adminPermissionModel,
          as: 'permissions',
          attributes: [
            'admin_permission_id',
            'admin_permission_can_create',
            'admin_permission_can_read',
            'admin_permission_can_update',
            'admin_permission_can_delete',
          ],
          include: [
            {
              model: resourceModel,
              as: 'resource',
              attributes: ['resource_id', 'resource_name'],
            },
          ],
        },
      ],
    });

    return responseHandler.success(res, 'Roles fetched successfully', roles);
  } catch (error) {
    next(error);
  }
};

const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role_id = parseInt(req.params.id);
    if (!role_id || isNaN(role_id)) {
      return responseHandler.error(res, 'Invalid role ID', resCode.BAD_REQUEST);
    }

    const role = await roleModel.findOne({
      where: { role_id },
      attributes: ['role_id', 'role_name', 'role_status'],
      include: [
        {
          model: adminPermissionModel,
          as: 'permissions',
          attributes: [
            'admin_permission_id',
            'admin_permission_can_create',
            'admin_permission_can_read',
            'admin_permission_can_update',
            'admin_permission_can_delete',
          ],
          include: [
            {
              model: resourceModel,
              as: 'resource',
              attributes: ['resource_id', 'resource_name'],
            },
          ],
        },
      ],
    });

    if (!role) {
      return responseHandler.error(res, 'Role not found', resCode.NOT_FOUND);
    }

    return responseHandler.success(res, 'Role fetched successfully', role);
  } catch (error) {
    next(error);
  }
};

const updateRoleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role_id = parseInt(req.params.id);
    const { role_name, role_status, permissions } = req.body;

    if (!role_id || isNaN(role_id)) {
      return responseHandler.error(res, 'Invalid role ID', resCode.BAD_REQUEST);
    }

    const role = await roleModel.findByPk(role_id);
    if (!role) {
      return responseHandler.error(res, 'Role not found', resCode.NOT_FOUND);
    }

    // Update role fields
    await role.update({ role_name, role_status });

    if (Array.isArray(permissions)) {
      for (const perm of permissions) {
        const {
          resource_id,
          admin_permission_can_create,
          admin_permission_can_read,
          admin_permission_can_update,
          admin_permission_can_delete,
        } = perm;

        // Update or create the permission entry for the role + resource
        const [permission, created] = await adminPermissionModel.findOrCreate({
          where: { role_id, resource_id },
          defaults: {
            admin_permission_can_create,
            admin_permission_can_read,
            admin_permission_can_update,
            admin_permission_can_delete,
          },
        });

        if (!created) {
          await permission.update({
            admin_permission_can_create,
            admin_permission_can_read,
            admin_permission_can_update,
            admin_permission_can_delete,
          });
        }
      }
    }

    return responseHandler.success(res, 'Role updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role_id = parseInt(req.params.id);

    const role = await roleModel.findByPk(role_id);
    if (!role) {
      return responseHandler.error(res, 'Role not found', resCode.NOT_FOUND);
    }

    await role.destroy();
    return responseHandler.success(res, 'Role deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const updateRoleStatusAndPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const roleId = req.params.id;
  console.log('🧩 Step 1: roleId from params =', roleId);

  const { role_status, permissions } = req.body;

  try {
    // 1. Check if role exists
    const role = await roleModel.findByPk(roleId);
    if (!role) {
      return responseHandler.error(res, 'Role not found', resCode.NOT_FOUND);
    }

    // 2. Update role status if provided
    if (role_status) {
      role.role_status = role_status;
      await role.save();
    }

    // 3. Update each permission entry
    if (Array.isArray(permissions)) {
      for (const perm of permissions) {
        const {
          resource_id,
          admin_permission_can_create,
          admin_permission_can_read,
          admin_permission_can_update,
          admin_permission_can_delete,
        } = perm;

        // Find existing permission entry
        const existingPermission = await adminPermissionModel.findOne({
          where: { role_id: roleId, resource_id },
        });

        if (existingPermission) {
          // Update the existing permission
          await existingPermission.update({
            admin_permission_can_create,
            admin_permission_can_read,
            admin_permission_can_update,
            admin_permission_can_delete,
          });
        } else {
          // If not found, create new permission
          await adminPermissionModel.create({
            role_id: roleId,
            resource_id,
            admin_permission_can_create,
            admin_permission_can_read,
            admin_permission_can_update,
            admin_permission_can_delete,
          });
        }
      }
    }

    return responseHandler.success(
      res,
      'Role status and permissions updated successfully',
      resCode.OK,
    );
  } catch (error) {
    console.error('Update Role Error:', error);
    return responseHandler.error(res, 'Something went wrong', resCode.SERVER_ERROR);
  }
};

export default {
  // addRole,
  getAllRoles,
  getRoleById,
  deleteRole,
  addRoleWithPermissions,
  updateRoleById,
  updateRoleStatusAndPermissions,
};
