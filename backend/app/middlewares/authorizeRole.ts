import { Request, Response, NextFunction } from "express";
import { responseHandler } from "../services/responseHandler.service";
import { msg } from "../constants/language/en.constant";
import { resCode } from "../constants/resCode";

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.userType;
    if (!role || !allowedRoles.includes(role)) {
      return responseHandler.error(res, msg.auth.forbidden, resCode.FORBIDDEN);
    }
    next();
  };
};
