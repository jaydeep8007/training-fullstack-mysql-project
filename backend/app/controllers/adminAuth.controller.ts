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

const envConfig = get(process.env.NODE_ENV);

const adminQuery = commonQuery(adminModel);
const adminAuthQuery = commonQuery(adminAuthModel);

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

    const {
      admin_firstname,
      admin_lastname,
      admin_email,
      admin_phone_number,
      admin_password,
    } = parsed.data;

    const hashedPassword = await hashPassword(admin_password);

    const newAdmin = await adminQuery.create({
      admin_firstname,
      admin_lastname,
      admin_email,
      admin_phone_number,
      admin_password: hashedPassword,
      admin_status: 'active',
    });

    const adminData = newAdmin.get();

    const accessToken = authToken.generateAuthToken({
      user_id: adminData.admin_id,
      email: adminData.admin_email,
    });

    const refreshToken = authToken.generateRefreshAuthToken({
      user_id: adminData.admin_id,
      email: adminData.admin_email,
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

    // ✅ Return accessToken and admin data
    return responseHandler.success(
      res,
      msg.auth.registerSuccess,
      {
        admin: adminData,
        accessToken,
      },
      resCode.CREATED
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
    const admin = await adminQuery.getOne({ admin_email });
    if (!admin) {
      return responseHandler.error(res, msg.admin.notFound, resCode.NOT_FOUND);
    }

    const adminData = admin.get();

    // 🔐 Compare password
    const isValid = await comparePasswords(admin_password, adminData.admin_password);
    if (!isValid) {
      return responseHandler.error(res, msg.common.invalidPassword, resCode.UNAUTHORIZED);
    }

    // 🔑 Generate tokens
    const accessToken = authToken.generateAuthToken({
      user_id: adminData.admin_id,
      email: adminData.admin_email,
    });

    const refreshToken = authToken.generateRefreshAuthToken({
      user_id: adminData.admin_id,
      email: adminData.admin_email,
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
        },
      },
      resCode.OK
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
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
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



export default {
  signupAdmin,
  signinAdmin,
  getAdminProfile,
    logoutAdmin,
};
