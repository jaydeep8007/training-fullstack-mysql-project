import { Request, Response, NextFunction } from 'express';
import adminPermissionModel from '../models/permission.model';
import resourceModel from '../models/resourse.model';
import { responseHandler } from '../services/responseHandler.service';
import { resCode } from '../constants/resCode';
import adminModel from '../models/admin.model';
import { msg } from '../constants/language';
import jwt from 'jsonwebtoken';
import {get} from '../config/config'
const config = get(process.env.NODE_ENV || 'development');
 import commonQuery from '../services/commonQuery.service';

 const adminQuery = commonQuery(adminModel);
 const adminPermissionQuery = commonQuery(adminPermissionModel);
 const resourceQuery = commonQuery(resourceModel);


const checkPermission = (
  resourceName: string,
  action: "create" | "read" | "update" | "delete"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return responseHandler.error(
          res,
          "Authorization header missing or invalid",
          resCode.UNAUTHORIZED
        );
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, config.SECURITY_TOKEN) as any;

      if (!decoded?.id) {
        return responseHandler.error(
          res,
          "Invalid token: Admin ID missing",
          resCode.UNAUTHORIZED
        );
      }

      const admin = await adminQuery.getById(decoded.id);
      if (!admin) {
        return responseHandler.error(res, msg.admin.notFound, resCode.NOT_FOUND);
      }

      const adminData = admin.get();
      const role_id = adminData.role_id;
      console.log("🧩  role_id from checkPermission =", role_id);

      if (!role_id) {
        return responseHandler.error(
          res,
          "Invalid token: role_id missing",
          resCode.UNAUTHORIZED
        );
      }

      const resource = await resourceModel.findOne({
        where: { resource_name: resourceName },
      });

      if (!resource) {
        return responseHandler.error(
          res,
          `Resource '${resourceName}' not found`,
          resCode.NOT_FOUND
        );
      }

      const permission = await adminPermissionModel.findOne({
        where: {
          role_id: role_id,
          resource_id: resource.resource_id,
        },
      });

      if (!permission) {
        return responseHandler.error(
          res,
          "Access Denied: No permission assigned",
          resCode.FORBIDDEN
        );
      }

      const isAllowed = {
        create: permission.admin_permission_can_create,
        read: permission.admin_permission_can_read,
        update: permission.admin_permission_can_update,
        delete: permission.admin_permission_can_delete,
      }[action];

      if (!isAllowed) {
        return responseHandler.error(
          res,
          `Access Denied: '${action}' not allowed on '${resourceName}'`,
          resCode.FORBIDDEN
        );
      }

      // ✅ Attach admin info to request for future use
      (req as any).user = { ...adminData };

      next();
    } catch (error) {
      console.error("🔥 checkPermission error:", error);
      return responseHandler.error(
        res,
        "Internal server error",
        resCode.SERVER_ERROR,
        error
      );
    }
  };
};
export default checkPermission;

