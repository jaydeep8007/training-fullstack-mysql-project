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
import roleModel from '../models/role.model';
import permissionModel from '../models/permission.model';
import nodemailer from 'nodemailer';
import { getSmtpSettings } from '../utils/getSmtpSettings.utils';
import adminAuthModel from '../models/adminAuth.model';
import { authToken } from '../services/authToken.service';
import dayjs from 'dayjs';

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
      role_id,
    } = parsed.data;

    const hashedPassword = await hashPassword(admin_password);

    const newAdmin = await adminQuery.create({
      admin_firstname,
      admin_lastname,
      admin_email,
      admin_phone_number,
      admin_password: hashedPassword,
      role_id: role_id ?? null,
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
// const getAdmins = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const page = parseInt(req.query.page as string, 10) || 1;
//     const results_per_page = parseInt(req.query.results_per_page as string, 10) || 10;
//     const offset = (page - 1) * results_per_page;

//     const filter = {};
//     const options = {
//       limit: results_per_page,
//       offset,

//     };

//     const data = await adminQuery.getAll(filter, options);
//     const count = await adminQuery.countDocuments(adminModel, filter);

//     return responseHandler.success(
//       res,
//       msg.admin.fetchSuccess,
//       { count, rows: data },
//       resCode.OK,
//     );
//   } catch (error) {
//     return next(error);
//   }
// };

// const getAdmins = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const page = parseInt(req.query.page as string, 10) || 1;
//     const results_per_page = parseInt(req.query.results_per_page as string, 10) || 10;
//     const offset = (page - 1) * results_per_page;

//     const filter = {};

//     const include = [
//       {
//         model: roleModel,
//         as: "role",
//         attributes: ["role_id", "role_name"], // only the fields you need
//       },
//     ];

//     const options = {
//       limit: results_per_page,
//       offset,
//       include,
//       attributes: {
//         exclude: ["admin_password"], // optional: hide sensitive fields
//       },
//       order: [["admin_id", "ASC"]],
//     };

//     const data = await adminQuery.getAll(filter, options);
//     const count = await adminQuery.countDocuments(adminModel, filter);

//     return responseHandler.success(
//       res,
//       msg.admin.fetchSuccess,
//       { count, rows: data },
//       resCode.OK,
//     );
//   } catch (error) {
//     return next(error);
//   }
// };
const getAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const results_per_page = parseInt(req.query.results_per_page as string, 10) || 10;
    const offset = (page - 1) * results_per_page;

    const filter = {}; // Add any filtering conditions if required

    const include = [
      {
        model: roleModel,
        as: 'roles', // ✅ Use the alias defined in association (singular)
        attributes: ['role_id', 'role_name', 'role_status'], // ✅ Include status here
      },
    ];

    const options = {
      limit: results_per_page,
      offset,
      include,
      attributes: {
        exclude: ['admin_password'],
      },
      order: [['admin_id', 'ASC']],
    };

    const data = await adminQuery.getAll(filter, options);
    const count = await adminQuery.countDocuments(adminModel, filter);

    return responseHandler.success(res, msg.admin.fetchSuccess, { count, rows: data }, resCode.OK);
  } catch (error) {
    console.error('❌ Error in getAdmins:', error);
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

    const isSame = Object.entries(updateData).every(([key, value]) => existingAdmin[key] === value);

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

    return responseHandler.success(
      res,
      msg.admin.updateSuccess,
      { updatedFields: changedFields },
      resCode.OK,
    );
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

// src/controllers/adminAuth.controller.ts

const createAdminWithResetLink = async (req: Request, res: Response) => {
  try {
    const parsed = await adminValidations.createAdminWithResetLinkSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errorMessages = parsed.error.errors.map((e) => e.message).join(', ');
      return responseHandler.error(res, errorMessages, resCode.BAD_REQUEST);
    }
    const { admin_firstname, admin_lastname, admin_email, admin_phone_number, role_id } =
      parsed.data;

    // Check if admin already exists
    const existing = await adminQuery.getOne({ admin_email });
    if (existing) {
      return responseHandler.error(res, 'Admin already exists', resCode.DUPLICATE_DATA);
    }

    // Create admin
    const admin = await adminModel.create({
      admin_firstname,
      admin_lastname,
      admin_email,
      admin_phone_number,
      role_id,
    });

    // Generate reset token
    const reset_token = authToken.generateResetToken({
      user_id: admin.admin_id,
      email: admin.admin_email,
    });

    const reset_token_expiry = dayjs().add(10, 'minutes').toDate();

    // Create or update adminAuth
    const [authEntry, created] = await adminAuthModel.findOrCreate({
      where: { admin_id: admin.admin_id },
      defaults: {
        admin_auth_refresh_token: reset_token,
      },
    });

    if (!created) {
      authEntry.set({ reset_token, reset_token_expiry });
      await authEntry.save();
    }

    // Build reset URL
    const resetUrl = `http://localhost:5173/admin-reset-password/${reset_token}`;

    // Load SMTP Config
    const smtpConfig = await getSmtpSettings();
    console.log('SMTP Config:', smtpConfig);
    if (!smtpConfig) {
      return responseHandler.error(res, 'SMTP config missing', resCode.SERVER_ERROR);
    }

    // Send email
    const transporter = nodemailer.createTransport({
      host: smtpConfig.smtp_host,
      port: smtpConfig.smtp_port,
      secure: smtpConfig.smtp_port === 465,
      auth: {
        user: smtpConfig.smtp_user,
        pass: smtpConfig.smtp_password,
      },
    });

    const mailOptions = {
      from: `"Admin Portal" <${smtpConfig.smtp_user}>`,
      to: admin_email,
      subject: 'Set Your Admin Password',
      html: `
        <p>Hello ${admin_firstname},</p>
        <p>You have been added as an admin to the system.</p>
        <p>Click below to set your password:</p>
        <a href="${resetUrl}" style="color:blue;">Set Password</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error('Failed to send email:', mailError);
      return responseHandler.error(res, 'Failed to send email', resCode.SERVER_ERROR);
    }

    return responseHandler.success(res, 'Admin created & password setup email sent', {
      admin_email,
      admin_id: admin.admin_id,
      reset_token,
      reset_token_expiry,
    });
  } catch (err) {
    console.error('Admin creation error:', err);
    return responseHandler.error(res, 'Server error', resCode.SERVER_ERROR);
  }
};

const createAdminWithoutPassword = async (req: Request, res: Response) => {
  try {
    const parsed = await adminValidations.createAdminWithResetLinkSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errorMessages = parsed.error.errors.map((e) => e.message).join(', ');
      return responseHandler.error(res, errorMessages, resCode.BAD_REQUEST);
    }

    const { admin_firstname, admin_lastname, admin_email, admin_phone_number, role_id } =
      parsed.data;

    // Check if admin already exists
    const existing = await adminQuery.getOne({ admin_email });
    if (existing) {
      return responseHandler.error(res, 'Admin already exists', resCode.DUPLICATE_DATA);
    }

    // Create admin (no password or auth setup)
    const admin = await adminModel.create({
      admin_firstname,
      admin_lastname,
      admin_email,
      admin_phone_number,
      role_id,
    });

    return responseHandler.success(res, 'Admin created successfully', {
      admin_id: admin.admin_id,
      admin_email: admin.admin_email,
    });
  } catch (err) {
    console.error('Admin direct creation error:', err);
    return responseHandler.error(res, 'Server error', resCode.SERVER_ERROR);
  }
};

export default {
  addAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdminById,
  createAdminWithResetLink,
  createAdminWithoutPassword,
};
