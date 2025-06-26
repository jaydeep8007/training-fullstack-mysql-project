import { Request, Response, NextFunction } from 'express';
import customerModel from '../models/customer.model';
import customerAuthModel from '../models/customerAuth.model';
import { comparePasswords, hashPassword } from '../services/password.service';
import { authToken } from '../services/authToken.service';
import { responseHandler } from '../services/responseHandler.service';
import { resCode } from '../constants/resCode';
import { ValidationError } from 'sequelize';
import { customerValidations } from '../validations/customer.validation';
import { msg } from '../constants/language';
import { get } from '../config/config';
import commonQuery from '../services/commonQuery.service';

const envConfig = get(process.env.NODE_ENV);

// 🔸 Initialize query service
const customerQuery = commonQuery(customerModel);
const customerAuthQuery = commonQuery(customerAuthModel);

/* ============================================================================
 * ✅ Signup Customer
 * ============================================================================
 */
const signupCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  const msg = getMsg();
    const parsed = await customerValidations.customerCreateSchema.safeParseAsync(req.body);
   if (!parsed.success) {
  const errors = parsed.error.errors.map((err) => err.message); // ⛔ no field prefix
  return responseHandler.error(res, errors.join(', '), resCode.BAD_REQUEST);
}

    const { cus_firstname, cus_lastname, cus_email, cus_phone_number, cus_password } = parsed.data;

    const hashedPassword = await hashPassword(cus_password);

    const newCustomer = await customerQuery.create({
      cus_firstname,
      cus_lastname,
      cus_email,
      cus_phone_number,
      cus_password: hashedPassword,
      cus_status: 'active',
    });

    const customerData = newCustomer.get();

    const accessToken = authToken.generateAuthToken({
      user_id: customerData.cus_id,
      email: customerData.cus_email,
    });

    const refreshToken = authToken.generateRefreshAuthToken({
      user_id: customerData.cus_id,
      email: customerData.cus_email,
    });

    await customerAuthQuery.create({
      cus_id: customerData.cus_id,
      cus_auth_token: accessToken,
      cus_auth_refresh_token: refreshToken,
    });

    // ✅ Set HTTP-only refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      ...envConfig.COOKIE_OPTIONS,
    });

    // ✅ Send accessToken and customer in response
    return responseHandler.success(
      res,
      msg.auth.registerSuccess,
      {
        customer: customerData,
        accessToken,
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
 * 🔐 Signin Customer
 * ============================================================================
 */
const signinCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  const msg = getMsg();
    const parsed = await customerValidations.customerLoginSchema.safeParseAsync(req.body);
   if (!parsed.success) {
  const errors = parsed.error.errors.map((err) => err.message); // ⛔ no field prefix
  return responseHandler.error(res, errors.join(', '), resCode.BAD_REQUEST);
}

    const { cus_email, cus_password } = parsed.data;

    const customer = await customerQuery.getOne({ cus_email });
    if (!customer) {
      return responseHandler.error(res, msg.customer.notFound, resCode.NOT_FOUND);
    }

    const customerData = customer.get();

    const isValid = await comparePasswords(cus_password, customerData.cus_password);
    if (!isValid) {
      return responseHandler.error(res, msg.common.invalidPassword, resCode.UNAUTHORIZED);
    }

    const accessToken = authToken.generateAuthToken({
      user_id: customerData.cus_id,
      email: customerData.cus_email,
    });

    const refreshToken = authToken.generateRefreshAuthToken({
      user_id: customerData.cus_id,
      email: customerData.cus_email,
    });

    await customerAuthQuery.create({
      cus_id: customerData.cus_id,
      cus_auth_token: accessToken,
      cus_auth_refresh_token: refreshToken,
    });

    // ✅ Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      ...envConfig.COOKIE_OPTIONS,
    });

    // ✅ Send access token and customer data in response
    return responseHandler.success(
      res,
      msg.auth.loginSuccess,
      {
        accessToken,
        customer: {
          cus_id: customerData.cus_id,
          cus_firstname: customerData.cus_firstname,
          cus_lastname: customerData.cus_lastname,
          cus_email: customerData.cus_email,
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

/* ============================================================================
 * 📧 Forgot Password - Request Reset Token
 * ============================================================================
 */
const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  const msg = getMsg();
    const result = customerValidations.forgotPasswordSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(', ');
      return responseHandler.error(res, errors, resCode.BAD_REQUEST);
    }

    const { cus_email } = result.data;

    const customer = await customerQuery.getOne({ cus_email  });
    if (!customer) {
      return responseHandler.error(res, msg.customer.notFound, resCode.NOT_FOUND);
    }

    const cus_auth_refresh_token = authToken.generateRefreshAuthToken({
      user_id: customer.cus_id,
      email: customer.cus_email,
    });

    const [authEntry, created] = await customerAuthModel.findOrCreate({
      where: { cus_id: customer.cus_id },
      defaults: {
        cus_auth_token: '', // can leave empty or null
        cus_auth_refresh_token,
      },
    });

    if (!created) {
      authEntry.set('cus_auth_refresh_token', cus_auth_refresh_token);
      await authEntry.save();
    }

    return responseHandler.success(
      res,
      msg.auth.resetTokenSent,
      { cus_auth_refresh_token }, // ✅ return with proper key
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
 * 🔒 Reset Password using Token
 * ============================================================================
 */
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  const msg = getMsg();
    const result = await customerValidations.resetPasswordSchema.safeParseAsync(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(', ');
      return responseHandler.error(res, errors, resCode.BAD_REQUEST);
    }

    const { cus_auth_refresh_token, new_password, confirm_password } = result.data;

    if (!cus_auth_refresh_token || !new_password || !confirm_password) {
      return responseHandler.error(res, msg.common.requiredAllFields, resCode.BAD_REQUEST);
    }

     // ✅ Get auth entry with associated customer
    const authEntry = await customerAuthQuery.getOne(
      { cus_auth_refresh_token },
      {
        include: [{ model: customerModel, as: 'customer' }],
      }
    );

    if (!authEntry || !authEntry.get('customer')) {
      return responseHandler.error(res, msg.auth.invalidResetToken, resCode.UNAUTHORIZED);
    }

    const customerInstance = authEntry.get('customer') as typeof customerModel.prototype;

    const hashedPassword = await hashPassword(new_password);
    customerInstance.set('cus_password', hashedPassword);
    customerInstance.set('reset_password_token', null);
    await customerInstance.save();

    authEntry.set('cus_auth_refresh_token', ''); // Clear token after use
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

/* ============================================================================
 * 🚪 Logout - Customer Logout
 * ============================================================================
 */
const logoutCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cus_id = (req as any).user?.cus_id;
    console.log('🔓 Logout request from Customer ID:', cus_id);

    if (!cus_id) {
      return responseHandler.error(res, msg.common.unauthorized, resCode.UNAUTHORIZED);
    }

    // ✅ Check if customer exists
    const customer = await customerQuery.getById(cus_id);
    if (!customer) {
      return responseHandler.error(res, msg.customer.notFound, resCode.NOT_FOUND);
    }

    // ✅ Delete auth tokens for this customer (access/refresh pair in DB)
    await customerAuthModel.destroy({ where: { cus_id } });

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


const getCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  const msg = getMsg();
    const cus_id = (req as any).user?.cus_id;

    if (!cus_id) {
      return responseHandler.error(res, msg.common.unauthorized, resCode.UNAUTHORIZED);
    }

    // ✅ Fetch customer using Sequelize `where`
    const customer = await customerQuery.getById(cus_id);

    if (!customer) {
      return responseHandler.error(res, msg.customer.notFound, resCode.NOT_FOUND);
    }

    return responseHandler.success(res, msg.auth.profileFetchSuccess, { customer }, resCode.OK);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(', '), resCode.BAD_REQUEST);
    }
    return next(error);
  }
};

/* ============================================================================
 * 📦 Export Auth Controller
 * ============================================================================
 */
export default {
  signupCustomer,
  signinCustomer,
  forgotPassword,
  resetPassword,
  logoutCustomer,
  getCustomerProfile,
};
