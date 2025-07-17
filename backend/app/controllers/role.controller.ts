import { Request, Response, NextFunction } from "express";
import roleModel from "../models/role.model"; // your Sequelize model
import { responseHandler } from "../services/responseHandler.service"; // Optional if you're using centralized responses
import { resCode } from "../constants/resCode";
import permissionModel from "../models/permission.model";
import resourceModel from "../models/resourse.model";




export const addRoleWithPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role_name, permissions } = req.body;

    if (!role_name || !Array.isArray(permissions) || permissions.length === 0) {
      return responseHandler.error(res, "Role name and permissions are required", 400);
    }

    // Check if role already exists
    const existingRole = await roleModel.findOne({ where: { role_name } });
    if (existingRole) {
      return responseHandler.error(res, "Role already exists", 400);
    }

    // Create new role
    const newRole = await roleModel.create({ role_name });

    // Add permissions
    const addedPermissions = await Promise.all(
      permissions.map(async (perm: any) => {
        const { resource_id, can_create, can_read, can_update, can_delete } = perm;
        return await permissionModel.create({
          role_id: newRole.role_id,
          resource_id,
          can_create,
          can_read,
          can_update,
          can_delete,
        });
      })
    );

    return responseHandler.success(res, "Role and permissions added successfully", {
      role: newRole,
      permissions: addedPermissions,
    });
  } catch (error) {
    next(error);
  }
};

 const addRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role_name, permissions } = req.body;

    if (!role_name || !permissions || !Array.isArray(permissions)) {
      return responseHandler.error(res, "Role name and permissions are required", 400);
    }

    // Create the role
    const newRole = await roleModel.create({ role_name });

    // Create permissions for the role
    const permissionEntries = permissions.map((perm) => ({
      role_id: newRole.role_id,
      resource_id: perm.resource_id,
      can_create: perm.can_create || false,
      can_read: perm.can_read || false,
      can_update: perm.can_update || false,
      can_delete: perm.can_delete || false,
    }));

    const addedPermissions = await permissionModel.bulkCreate(permissionEntries);

    return responseHandler.success(res, "Role and permissions added successfully", {
      role: newRole,
      permissions: addedPermissions,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await roleModel.findAll({
      attributes: ["role_id", "role_name"],
      include: [
        {
          model: permissionModel,
          as: "permissions",
          attributes: ["permission_id", "can_create", "can_read", "can_update", "can_delete"],
          include: [
            {
              model: resourceModel,
              as: "resource",
              attributes: ["resource_id", "resource_name"],
            },
          ],
        },
      ],
    });

    return responseHandler.success(res, "Roles fetched successfully", roles);
  } catch (error) {
    next(error);
  }
};


const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role_id = parseInt(req.params.id);
    if (!role_id || isNaN(role_id)) {
      return responseHandler.error(res, "Invalid role ID", resCode.BAD_REQUEST);
    }

    const role = await roleModel.findByPk(role_id);
    if (!role) {
      return responseHandler.error(res, "Role not found", resCode.NOT_FOUND);
    }

    return responseHandler.success(res, "Role fetched successfully", role);
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role_id = parseInt(req.params.id);
    const { role_name } = req.body;

    if (!role_name) {
      return responseHandler.error(res, "Role name is required", resCode.BAD_REQUEST);
    }

    const role = await roleModel.findByPk(role_id);
    if (!role) {
      return responseHandler.error(res, "Role not found", resCode.NOT_FOUND);
    }

    await role.update({ role_name });
    return responseHandler.success(res, "Role updated successfully", role);
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role_id = parseInt(req.params.id);

    const role = await roleModel.findByPk(role_id);
    if (!role) {
      return responseHandler.error(res, "Role not found", resCode.NOT_FOUND);
    }

    await role.destroy();
    return responseHandler.success(res, "Role deleted successfully");
  } catch (error) {
    next(error);
  }
};



export default {
  addRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
addRoleWithPermissions
};
