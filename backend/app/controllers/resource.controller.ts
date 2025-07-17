import { Request, Response, NextFunction } from "express";

import { responseHandler } from "../services/responseHandler.service"; // Optional if you're using centralized responses
import { resCode } from "../constants/resCode";

import resourceModel from "../models/resourse.model";

// Get all resources from the database
 const getAllResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = await resourceModel.findAll({
      attributes: ["resource_id", "resource_name"], // only fetch required fields
      order: [["resource_name", "ASC"]],
    });

    return responseHandler.success(res, "Resources fetched successfully", resources);
  } catch (error) {
    return responseHandler.error(res, "Failed to fetch resources", resCode.SERVER_ERROR, error);
  }
};

export default {
    getAllResources
}