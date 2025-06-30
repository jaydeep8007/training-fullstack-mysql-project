import { Request, Response, NextFunction } from 'express';
import { hashPassword } from '../services/password.service';
import { responseHandler } from '../services/responseHandler.service';
import { resCode } from '../constants/resCode';
import { ValidationError } from 'sequelize';
import { adminValidations } from '../validations/admin.validation';
import { msg } from '../constants/language';
import adminModel from '../models/admin.model';
import employeeModel from '../models/employee.model';
import commonQuery from '../services/commonQuery.service';

// 🔸 Initialize admin-specific query service
const adminQuery = commonQuery(adminModel);

/* ============================================================================
 * ➕ Add Admin
 * ============================================================================
 */
const addAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = await adminValidations.adminCreateSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(', ');
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const {
      admin_password,
      admin_email,
      admin_phone_number,
      admin_firstname,
      admin_lastname,
    } = parsed.data;

    const hashedPassword = await hashPassword(admin_password);

    const newAdmin = await adminQuery.create({
      admin_firstname,
      admin_lastname,
      admin_email,
      admin_phone_number,
      admin_password: hashedPassword,

    });

    return responseHandler.success(res, msg.admin.createSuccess, newAdmin, resCode.CREATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(', '), resCode.BAD_REQUEST);
    }
    return next(error);
  }
};

/* ============================================================================
 * 📄 Get All Admins
 * ============================================================================
 */
const getAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const results_per_page = parseInt(req.query.results_per_page as string, 10) || 10;
    const offset = (page - 1) * results_per_page;

    const filter = {};
    const options = {
      limit: results_per_page,
      offset,
      
    };

    const data = await adminQuery.getAll(filter, options);
    const count = await adminQuery.countDocuments(adminModel, filter);

    return responseHandler.success(
      res,
      msg.admin.fetchSuccess,
      { count, rows: data },
      resCode.OK,
    );
  } catch (error) {
    return next(error);
  }
};

/* ============================================================================
 * 📄 Get Admin by ID
 * ============================================================================
 */
const getAdminById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await adminQuery.getById(req.params.id, {});

    if (!admin) {
      return responseHandler.error(res, msg.admin.notFound, resCode.NOT_FOUND);
    }

    return responseHandler.success(res, msg.admin.fetchSuccess, admin, resCode.OK);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(', '), resCode.BAD_REQUEST);
    }
    return next(error);
  }
};

/* ============================================================================
 * ✏️ Update Admin by ID
 * ============================================================================
 */
const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin_id = req.params.id;

    const existingAdmin = await adminQuery.getById(admin_id);
    if (!existingAdmin) {
      return responseHandler.error(res, msg.admin.fetchFailed, resCode.NOT_FOUND);
    }

    const parsed = await adminValidations.adminUpdateSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(', ');
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const updateData = parsed.data;

    const isSame = Object.entries(updateData).every(
      ([key, value]) => existingAdmin[key] === value
    );

    if (isSame) {
      return responseHandler.success(res, msg.common.noChanges);
    }

    const changedFields: Record<string, any> = {};
    for (const [key, value] of Object.entries(updateData)) {
      if (existingAdmin[key] !== value) {
        changedFields[key] = value;
      }
    }

    const updatedCount = await adminQuery.update(updateData, { admin_id });

    if (updatedCount === 0) {
      return responseHandler.error(res, msg.admin.updateFailed, resCode.BAD_REQUEST);
    }

    return responseHandler.success(res, msg.admin.updateSuccess, { updatedFields: changedFields }, resCode.OK);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(', '), resCode.BAD_REQUEST);
    }
    return next(error);
  }
};

/* ============================================================================
 * ❌ Delete Admin by ID
 * ============================================================================
 */
const deleteAdminById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminQuery.deleteById({ admin_id: req.params.id });

    if (result.deletedCount === 0) {
      return responseHandler.error(res, msg.common.invalidId, resCode.NOT_FOUND);
    }

    return responseHandler.success(res, msg.admin.deleteSuccess);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(', '), resCode.BAD_REQUEST);
    }
    return next(error);
  }
};

export default {
  addAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdminById,
};
