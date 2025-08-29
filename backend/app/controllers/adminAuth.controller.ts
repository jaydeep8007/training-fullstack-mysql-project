import { Request, Response, NextFunction } from 'express';
import { hashPassword, comparePasswords } from '../services/password.service';
import { authToken } from '../services/authToken.service';
import { responseHandler } from '../services/responseHandler.service';
import { resCode } from '../constants/resCode';
import { ValidationError } from 'sequelize';
import { msg } from '../constants/language';
import { get } from '../config/config';
import adminModel from '../models/admin.model';
import adminAuthModel from '../models/adminAuth.model';
import commonQuery from '../services/commonQuery.service';
import { adminValidations } from '../validations/admin.validation';
import nodemailer from 'nodemailer';
import { getSmtpSettings } from '../utils/getSmtpSettings.utils';
import roleModel from '../models/role.model';

const envConfig = get(process.env.NODE_ENV);

const adminQuery = commonQuery(adminModel);
const adminAuthQuery = commonQuery(adminAuthModel);
const DEFAULT_ADMIN_ROLE_ID = 2; // Replace with your actual admin role_id

/* ============================================================================
 * 📝 Admin Signup
 * ============================================================================
 */
const signupAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = await adminValidations.adminCreateSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((err) => err.message);
      return responseHandler.error(res, errors.join(', '), resCode.BAD_REQUEST);
    }

    const { admin_firstname, admin_lastname, admin_email, admin_phone_number, admin_password } =
      parsed.data;
    const isSuperAdmin = admin_email === envConfig.SUPER_ADMIN_EMAIL;
    const role_id = isSuperAdmin ? 1 : DEFAULT_ADMIN_ROLE_ID; // Use 1 for super admin, otherwise default role_id

    const hashedPassword = await hashPassword(admin_password);

    const newAdmin = await adminQuery.create({
      admin_firstname,
      admin_lastname,
      admin_email,
      admin_phone_number,
      admin_password: hashedPassword,
      admin_status: 'active',
      role_id: role_id,
    });

    const adminData = await adminModel.findOne({
      where: { admin_id: newAdmin.admin_id },
      attributes: ['admin_id', 'admin_email', 'role_id'],
    });

    // const role = await roleModel.findByPk(role_id);
    // console.log("role..../" , role)
    // if (!role) {
    //   return responseHandler.error(res, "Invalid role selected", resCode.BAD_REQUEST);
    // }
    //  console.log("....role" , role)
    const accessToken = authToken.generateAuthToken({
      user_id: adminData.admin_id,
      email: adminData.admin_email,
      role_id: adminData.role_id,
    });

    const refreshToken = authToken.generateRefreshAuthToken({
      user_id: adminData.admin_id,
      email: adminData.admin_email,
      role_id: adminData.role_id,
    });

    await adminAuthQuery.create({
      admin_id: adminData.admin_id,
      admin_auth_token: accessToken,
      admin_auth_refresh_token: refreshToken,
    });

    // ✅ Set HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      ...envConfig.COOKIE_OPTIONS,
    });

    return responseHandler.success(
      res,
      msg.auth.registerSuccess,
      {
        accessToken,
        admin: {
          ...adminData,
          role_id: adminData.role_id, // Include role_id in the response
        },
      },
      resCode.CREATED,
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
 * 🔐 Admin Login
 * ============================================================================
 */

const signinAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ✅ Validate request body
    const parsed = await adminValidations.adminLoginSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((err) => err.message);
      return responseHandler.error(res, errors.join(', '), resCode.BAD_REQUEST);
    }

    const { admin_email, admin_password } = parsed.data;

    // 🔍 Find admin by email
    const admin = await adminModel.findOne({ where: { admin_email } });
    if (!admin) {
      return responseHandler.error(res, msg.admin.notFound, resCode.NOT_FOUND);
    }

    const adminData = admin.get();

    // 🔐 Compare password
    const isValid = await comparePasswords(admin_password, adminData.admin_password);
    if (!isValid) {
      return responseHandler.error(res, msg.common.invalidPassword, resCode.UNAUTHORIZED);
    }

    const role_id = adminData.role_id; // ✅ Get role_id directly from admin data

    // 🔑 Generate tokens
    const accessToken = authToken.generateAuthToken({
      user_id: adminData.admin_id,
      email: adminData.admin_email,
      role_id,
    });

    const refreshToken = authToken.generateRefreshAuthToken({
      user_id: adminData.admin_id,
      email: adminData.admin_email,
      role_id,
    });

    // 💾 Save tokens
    await adminAuthQuery.create({
      admin_id: adminData.admin_id,
      admin_auth_token: accessToken,
      admin_auth_refresh_token: refreshToken,
    });

    // 🍪 Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      ...envConfig.COOKIE_OPTIONS,
    });

    // ✅ Respond with success
    return responseHandler.success(
      res,
      msg.auth.loginSuccess,
      {
        accessToken,
        admin: {
          admin_id: adminData.admin_id,
          admin_firstname: adminData.admin_firstname,
          admin_lastname: adminData.admin_lastname,
          admin_email: adminData.admin_email,
          role_id: adminData.role_id, // ✅ Also return it
        },
      },
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

const getAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin_id = (req as any).user?.admin_id;

    if (!admin_id) {
      return responseHandler.error(res, msg.common.unauthorized, resCode.UNAUTHORIZED);
    }

    const admin = await adminQuery.getById(admin_id);

    if (!admin) {
      return responseHandler.error(res, msg.admin.notFound, resCode.NOT_FOUND);
    }

    return responseHandler.success(res, msg.auth.profileFetchSuccess, { admin }, resCode.OK);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(', '), resCode.BAD_REQUEST);
    }
    return next(error);
  }
};

/* ============================================================================
 * 🚪 Logout - Admin Logout
 * ============================================================================
 */
const logoutAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin_id = (req as any).user?.admin_id;
    console.log('🔓 Logout request from Admin ID:', admin_id);

    if (!admin_id) {
      return responseHandler.error(res, msg.common.unauthorized, resCode.UNAUTHORIZED);
    }

    // ✅ Check if admin exists
    const admin = await adminQuery.getById(admin_id);
    if (!admin) {
      return responseHandler.error(res, msg.admin.notFound, resCode.NOT_FOUND);
    }

    // ✅ Delete auth tokens for this admin (access/refresh pair in DB)
    await adminAuthModel.destroy({ where: { admin_id } });

    // ✅ Clear refresh token cookie (secure & HTTP-only)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // ✅ Return success
    return responseHandler.success(res, msg.auth.logoutSucces, {}, resCode.OK);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(', '), resCode.BAD_REQUEST);
    }
    return next(error);
  }
};

/* ============================================================================
 * 📧 Admin Forgot Password - Request Reset Token
 * ============================================================================
 */
const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = adminValidations.forgotPasswordSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(', ');
      return responseHandler.error(res, errors, resCode.BAD_REQUEST);
    }

    const { admin_email } = result.data;

    const admin = await adminQuery.getOne({ admin_email });
    if (!admin) {
      return responseHandler.error(res, 'Admin not found', resCode.NOT_FOUND);
    }

    const reset_token = authToken.generateResetToken({
      user_id: admin.admin_id,
      email: admin.admin_email,
    });

    const [authEntry, created] = await adminAuthModel.findOrCreate({
      where: { admin_id: admin.admin_id },
      defaults: {
        admin_auth_token: '',
        admin_auth_refresh_token: reset_token,
      },
    });

    if (!created) {
      authEntry.set('admin_auth_refresh_token', reset_token);
      await authEntry.save();
    }

    const resetUrl = `http://localhost:5173/admin-reset-password/${reset_token}`;

    const smtpConfig = await getSmtpSettings();
    if (!smtpConfig) {
      return responseHandler.error(res, 'SMTP configuration not found', resCode.SERVER_ERROR);
    }

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
      from: `"Job Portal Admin" <${smtpConfig.smtp_user}>`,
      to: admin_email,
      subject: 'Admin Reset Password',
      html: `
        <p>Hello ${admin.admin_name || 'Admin'},</p>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}" style="color:blue;">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return responseHandler.success(
      res,
      msg.common.resetLinkSend,
      { email: admin_email, reset_token },
      resCode.OK,
    );
  } catch (error) {
    console.error('Admin forgot password error:', error);
    return responseHandler.error(res, 'Something went wrong', resCode.SERVER_ERROR);
  }
};

/* ============================================================================
 * 🔒 Admin Reset Password using Token
 * ============================================================================
 */
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminValidations.resetPasswordSchema.safeParseAsync(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(', ');
      return responseHandler.error(res, errors, resCode.BAD_REQUEST);
    }

    const { reset_token, new_password, confirm_password } = result.data;

    if (!reset_token || !new_password || !confirm_password) {
      return responseHandler.error(res, msg.common.requiredAllFields, resCode.BAD_REQUEST);
    }

    const authEntry = await adminAuthQuery.getOne(
      { admin_auth_refresh_token: reset_token },
      {
        include: [{ model: adminModel, as: 'admin' }],
      },
    );

    if (!authEntry || !authEntry.get('admin')) {
      return responseHandler.error(res, msg.auth.invalidResetToken, resCode.UNAUTHORIZED);
    }

    const adminInstance = authEntry.get('admin') as typeof adminModel.prototype;

    const hashedPassword = await hashPassword(new_password);
    adminInstance.set('admin_password', hashedPassword);
    await adminInstance.save();

    authEntry.set('admin_auth_refresh_token', '');
    await authEntry.destroy(); // ✅ Completely remove the auth row after successful reset

    return responseHandler.success(res, msg.auth.passwordResetSuccess, {}, resCode.OK);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(', '), resCode.BAD_REQUEST);
    }
    return next(error);
  }
};

export default {
  signupAdmin,
  signinAdmin,
  getAdminProfile,
  logoutAdmin,
  forgotPassword,
  resetPassword,
};
