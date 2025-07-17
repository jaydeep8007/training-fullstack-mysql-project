// src/controllers/permission.controller.ts
import { Request, Response, NextFunction } from "express";
import permissionModel from "../models/permission.model";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";
import roleModel from "../models/role.model";
import resourceModel from "../models/resourse.model";


const addPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      role_id,
      resource_id,
      can_create = false,
      can_read = false,
      can_update = false,
      can_delete = false,
    } = req.body;

    // Validate role and resource existence
    const [role, resource] = await Promise.all([
      roleModel.findByPk(role_id),
      resourceModel.findByPk(resource_id),
    ]);

    if (!role) {
      return responseHandler.error(res, 'Invalid role_id provided.', 400);
    }

    if (!resource) {
      return responseHandler.error(res, 'Invalid resource_id provided.', 400);
    }

    // Optional: check if permission already exists
    const existingPermission = await permissionModel.findOne({
      where: { role_id, resource_id },
    });

    if (existingPermission) {
      return responseHandler.error(res, 'Permission already exists for this role and resource.', 409);
    }

    // Create the permission
    const newPermission = await permissionModel.create({
      role_id,
      resource_id,
      can_create,
      can_read,
      can_update,
      can_delete,
    });

    return responseHandler.success(res, 'Permission added successfully', newPermission);
  } catch (error) {
    next(error);
  }
};


const getPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const permissions = await permissionModel.findAll({
      order: [['permission_id', 'ASC']], // Optional: sort by ID
    });

    return responseHandler.success(res, "Permissions fetched successfully", permissions);
  } catch (error) {
    next(error);
  }
};

export default {
  addPermission,
  getPermissions
};
