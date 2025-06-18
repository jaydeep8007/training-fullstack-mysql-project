import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";

import employeeJobModel from "../models/employeeJobAssign.model";
import jobModel from "../models/job.model";
import employeeModel from "../models/employee.model";
import employeeJobValidation from "../validations/employeeJob.validation";

import commonQuery from "../services/commonQuery.service";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";
import { msg } from "../constants/language/en.constant";

// 🔸 Initialize query handlers
const jobQuery = commonQuery(jobModel);
const employeeQuery = commonQuery(employeeModel);
const employeeJobQuery = commonQuery(employeeJobModel);

/* ============================================================================
 * 📄 Assign Job to Single Employee
 * ============================================================================
 */
const assignJobToEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Validate request body with Zod
    const parsed = await employeeJobValidation.assignJobSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const { emp_id, job_id } = parsed.data;

    // 🔎 Check if job exists
    const jobExists = await jobQuery.getById(job_id);
    if (!jobExists) {
      return responseHandler.error(
        res,
        `Job with ID ${job_id} does not exist`,
        resCode.NOT_FOUND
      );
    }

    // 🔎 Check if employee exists
    const employeeExists = await employeeQuery.getById(emp_id);
    if (!employeeExists) {
      return responseHandler.error(
        res,
        `Employee with ID ${emp_id} does not exist`,
        resCode.NOT_FOUND
      );
    }

    // 🔎 Check if the employee is already assigned to a job
    const alreadyAssigned = await employeeJobQuery.getOne({
      where: { emp_id },
    });

    if (alreadyAssigned) {
      return responseHandler.error(
        res,
        `Employee with ID ${emp_id} is already assigned to a job`,
        resCode.BAD_REQUEST
      );
    }

    // ✅ Create job assignment
    const assignment = await employeeJobQuery.create({ emp_id, job_id });

    return responseHandler.success(
      res,
      msg.employeeJob.assignSuccess,
      assignment,
      resCode.CREATED
    );
  } catch (error) {
    // ⚠️ Handle Sequelize validation errors
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, messages, resCode.BAD_REQUEST);
    }

    // 🔁 Forward unhandled errors
    return next(error);
  }
};

/* ============================================================================
 * 📄 Assign Job to Many Employees
 * ============================================================================
 */
const assignJobToManyEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Validate request body with Zod
    const parsed =
      await employeeJobValidation.assignMultipleJobsSchema.safeParseAsync(
        req.body
      );
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const { emp_ids, job_id } = parsed.data;

    // 🔎 Check if job exists
    const jobExists = await jobQuery.getById(job_id);
    if (!jobExists) {
      return responseHandler.error(
        res,
        `Job with ID ${job_id} does not exist`,
        resCode.NOT_FOUND
      );
    }

    // 🔎 Fetch and verify employees
    const foundEmployees = await employeeQuery.getAll({
      where: { emp_id: emp_ids },
    });

    const foundEmpIds = foundEmployees.data.map((emp: any) => emp.get("emp_id"));
    const missingEmpIds = emp_ids.filter((id) => !foundEmpIds.includes(id));

    if (missingEmpIds.length > 0) {
      return responseHandler.error(
        res,
        `These employee IDs do not exist: ${missingEmpIds.join(", ")}`,
        resCode.NOT_FOUND
      );
    }

    // 🔎 Check for already assigned employees
    const existingAssignments = await employeeJobModel.findAll({ 
      where: { emp_id: emp_ids },
    });

    if (existingAssignments.length > 0) {
      const alreadyAssignedEmpIds = existingAssignments.map((ea) =>
        ea.get("emp_id")
      );
      return responseHandler.error(
        res,
        `These employees are already assigned a job: ${alreadyAssignedEmpIds.join(
          ", "
        )}`,
        resCode.BAD_REQUEST
      );
    }

    // ✅ Assign job to all employees
    const assignments = await Promise.all(
      emp_ids.map((emp_id) => employeeJobQuery.create({ emp_id, job_id }))
    );

    return responseHandler.success(
      res,
      msg.employeeJob.assignSuccess,
      assignments,
      resCode.CREATED
    );
  } catch (error) {
    // ⚠️ Handle validation errors
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(
        res,
        messages.join(", "),
        resCode.BAD_REQUEST
      );
    }

    // 🔁 Forward unhandled errors
    return next(error);
  }
};

/* ============================================================================
 * 📦 Export Controller
 * ============================================================================
 */
export default {
  assignJobToEmployee,
  assignJobToManyEmployees,
};
