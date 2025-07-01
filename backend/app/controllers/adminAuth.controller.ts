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
import nodemailer from "nodemailer";

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

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = adminValidations.forgotPasswordSchema.safeParse(req.body); // ✅ use admin schema
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(", ");
      return responseHandler.error(res, errors, resCode.BAD_REQUEST);
    }

    const { admin_email } = result.data;

    const admin = await adminQuery.getOne({ admin_email }); // ✅ fetch admin by email
    if (!admin) {
      return responseHandler.error(res, "Admin not found", resCode.NOT_FOUND);
    }

    const admin_auth_refresh_token = authToken.generateRefreshAuthToken({
      user_id: admin.admin_id,
      email: admin.admin_email,
    });

    const [authEntry, created] = await adminAuthModel.findOrCreate({
      where: { admin_id: admin.admin_id },
      defaults: {
        admin_auth_token: '',
        admin_auth_refresh_token,
      },
    });

    if (!created) {
      authEntry.set("admin_auth_refresh_token", admin_auth_refresh_token);
      await authEntry.save();
    }

    const resetUrl = `http://localhost:5173/admin-reset-password/${admin_auth_refresh_token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jrparmar8007@gmail.com",
        pass: "olqvuhxslpmmokyc",
      },
    });

    const mailOptions = {
      from: '"Job Portal" <jrparmar8007@gmail.com>',
      to: admin_email,
      subject: "Reset Your Password",
      html: `
        <p>Hello ${admin.admin_firstname},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="color:blue;">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return responseHandler.success(
      res,
      "Reset link sent successfully!",
      { email: admin_email },
      resCode.OK
    );
  } catch (error) {
    console.error(error);
    return responseHandler.error(res, "Something went wrong", resCode.SERVER_ERROR);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminValidations.resetPasswordSchema.safeParseAsync(req.body); // ✅ Use admin schema
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(', ');
      return responseHandler.error(res, errors, resCode.BAD_REQUEST);
    }

    const { admin_auth_refresh_token, new_password, confirm_password } = result.data;

    if (!admin_auth_refresh_token || !new_password || !confirm_password) {
      return responseHandler.error(res, msg.common.requiredAllFields, resCode.BAD_REQUEST);
    }

    const authEntry = await adminAuthQuery.getOne(
      { admin_auth_refresh_token },
      {
        include: [{ model: adminModel, as: 'admin' }], // ✅ Include associated admin
      }
    );

    if (!authEntry || !authEntry.get('admin')) {
      return responseHandler.error(res, msg.auth.invalidResetToken, resCode.UNAUTHORIZED);
    }

    const adminInstance = authEntry.get('admin') as typeof adminModel.prototype;

    const hashedPassword = await hashPassword(new_password);
    adminInstance.set('admin_password', hashedPassword);

    await adminInstance.save();

    authEntry.set('admin_auth_refresh_token', ''); // ✅ Clear token after use
    await authEntry.save();

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
