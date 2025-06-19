import { Request, Response, NextFunction } from "express";
import { authToken } from "../services/authToken.service";
import customerModel from "../models/customer.model";
import { responseHandler } from "../services/responseHandler.service";
import { msg } from "../constants/language/en.constant";
import { resCode } from "../constants/resCode";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authCustomer = async (req: Request, res: Response, next: NextFunction) => {
  // ✅ Reuse token verification from service
  authToken.verifyAuthToken(req, res, async () => {
    try {
      const decoded = (req as any).user;
      console.log("Decoded token:", decoded);

      // ✅ SQL version: Use Sequelize's findByPk
      const customer = await customerModel.findByPk(decoded.id);

      if (!customer) {
        return responseHandler.error(res, msg.auth.customerNotFound, resCode.NOT_FOUND);
      }

      const customerData = customer.get();

      // ✅ Attach full customer info to req.user
      req.user = {
        cus_id: customerData.cus_id,
        cus_email: customerData.cus_email,
        cus_firstname: customerData.cus_firstname,
      };
      console.log("Authenticated customer:", req.user);

      next();
    } catch (error) {
      console.error("authCustomer error:", error);
      return responseHandler.error(res, msg.common.serverError, resCode.SERVER_ERROR);
    }
  });
};

export default {
  authCustomer,
};
