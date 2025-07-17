import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'sequelize';

import jobModel from '../models/job.model';
import employeeModel from '../models/employee.model';
import employeeJobModel from '../models/employeeJobAssign.model';

import employeeJobValidation from '../validations/employeeJob.validation';
import commonQuery from '../services/commonQuery.service';
import { responseHandler } from '../services/responseHandler.service';
import { resCode } from '../constants/resCode';
import { msg } from '../constants/language/en.constant';

// 🔸 Query handlers
const jobQuery = commonQuery(jobModel);
const employeeQuery = commonQuery(employeeModel);
const employeeJobQuery = commonQuery(employeeJobModel)

/* ============================================================================
 * 📄 Assign Job to a Single Employee
 * ============================================================================
 */
const assignJobToEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = await employeeJobValidation.assignJobSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(', ');
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const { emp_id, job_id } = parsed.data;

    // ✅ Check if job exists
    const jobExists = await jobQuery.getById(job_id);
    if (!jobExists) {
      return responseHandler.error(res, `Job with ID ${job_id} does not exist`, resCode.NOT_FOUND);
    }

    // ✅ Check if employee exists
    const employee = await employeeModel.findByPk(emp_id);
    if (!employee) {
      return responseHandler.error(res, `Employee with ID ${emp_id} does not exist`, resCode.NOT_FOUND);
    }

    // ✅ Check if already assigned
    if (employee.get('job_id')) {
      return responseHandler.error(
        res,
        `Employee with ID ${emp_id} is already assigned to a job`,
        resCode.BAD_REQUEST
      );
    }

    // ✅ Assign job_id
    await employeeModel.update({ job_id }, { where: { emp_id } });

    // ✅ Return updated employee
    const updatedEmployee = await employeeModel.findByPk(emp_id, {
      include: [
        {
          model: jobModel,
          as: 'job',
          attributes: ['job_id', 'job_name', 'job_category'],
        },
      ],
    });

    return responseHandler.success(res, msg.employeeJob.assignSuccess, updatedEmployee, resCode.CREATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message).join(', ');
      return responseHandler.error(res, messages, resCode.BAD_REQUEST);
    }
    return next(error);
  }
};

/* ============================================================================
 * 📄 Assign Job to Multiple Employees
 * ============================================================================
 */
const assignJobToManyEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = await employeeJobValidation.assignMultipleJobsSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(', ');
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const { emp_ids, job_id } = parsed.data;

    // ✅ Check if job exists
    const jobExists = await jobQuery.getById(job_id);
    if (!jobExists) {
      return responseHandler.error(res, `Job with ID ${job_id} does not exist`, resCode.NOT_FOUND);
    }

    // ✅ Get all matching employees
    const employees = await employeeModel.findAll({ where: { emp_id: emp_ids } });
    const foundEmpIds = employees.map((e) => e.get('emp_id'));
    const missingEmpIds = emp_ids.filter((id) => !foundEmpIds.includes(id));

    if (missingEmpIds.length > 0) {
      return responseHandler.error(
        res,
        `These employee IDs do not exist: ${missingEmpIds.join(', ')}`,
        resCode.NOT_FOUND
      );
    }

    // ✅ Find already assigned employees
    const alreadyAssigned = employees.filter((e) => e.get('job_id'));
    if (alreadyAssigned.length > 0) {
      const assignedIds = alreadyAssigned.map((e) => e.get('emp_id')).join(', ');
      return responseHandler.error(
        res,
        `These employees are already assigned to a job: ${assignedIds}`,
        resCode.BAD_REQUEST
      );
    }

    // ✅ Assign job_id to all employees
    await Promise.all(
      emp_ids.map((emp_id) =>
        employeeModel.update({ job_id }, { where: { emp_id } })
      )
    );

    const updatedEmployees = await employeeModel.findAll({
      where: { emp_id: emp_ids },
      include: [
        {
          model: jobModel,
          as: 'job',
          attributes: ['job_id', 'job_name', 'job_category'],
        },
      ],
    });

    return responseHandler.success(res, msg.employeeJob.assignSuccess, updatedEmployees, resCode.CREATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message).join(', ');
      return responseHandler.error(res, messages, resCode.BAD_REQUEST);
    }

    return next(error);
  }
};


const updateEmployeeJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const emp_id = Number(req.params.id);
    const { job_id } = req.body;

    console.log("📥 Received update request for emp_id:", emp_id, "with job_id:", job_id);

    // 🔍 Validate employee ID
    if (!emp_id || isNaN(emp_id)) {
      console.warn("⚠️ Invalid employee ID:", req.params.id);
      return responseHandler.error(res, "Invalid employee ID", resCode.BAD_REQUEST);
    }

    // 🔍 Check if employee exists
    const employee = await employeeModel.findByPk(emp_id);
    if (!employee) {
      console.warn("❌ Employee not found for emp_id:", emp_id);
      return responseHandler.error(res, `Employee with ID ${emp_id} not found`, resCode.NOT_FOUND);
    }
    console.log("✅ Employee found:", employee.dataValues);

    // 🔍 Check existing job assignment
    const existingAssignment = await employeeJobModel.findOne({ where: { emp_id } });
    console.log("🔗 Existing assignment:", existingAssignment?.dataValues || null);

    // 🔴 CASE 1: Remove job assignment
    if (!job_id) {
      if (existingAssignment) {
        console.log("🗑️ Removing job assignment for emp_id:", emp_id);
        await employeeJobModel.destroy({ where: { emp_id } });
        return responseHandler.success(res, msg.common.deleteSuccess, { emp_id });
      } else {
        console.warn("⚠️ No job to remove for emp_id:", emp_id);
        return responseHandler.error(res, "No job assigned to remove", resCode.NOT_FOUND);
      }
    }

    // 🔍 Validate job existence
    const job = await jobModel.findByPk(job_id);
    if (!job) {
      console.warn("❌ Job not found for job_id:", job_id);
      return responseHandler.error(res, `Job with ID ${job_id} not found`, resCode.NOT_FOUND);
    }
    console.log("✅ Job found:", job.dataValues);

    // ✅ CASE 2: Update or Create Assignment
    if (existingAssignment) {
      console.log("🔄 Updating assignment for emp_id:", emp_id, "to job_id:", job_id);
      const [updatedCount] = await employeeJobModel.update(
        { job_id },
        { where: { emp_id } }
      );
      console.log("✅ Update result → updated rows:", updatedCount);

      if (updatedCount === 0) {
        console.error("❌ Update failed — no rows changed");
        return responseHandler.error(res, "Failed to update job assignment", resCode.BAD_REQUEST);
      }

      return responseHandler.success(res, msg.common.updateSuccess, { emp_id, job_id });
    } else {
      console.log("🆕 Creating new assignment for emp_id:", emp_id, "with job_id:", job_id);
      const created = await employeeJobModel.create({ emp_id, job_id });
      console.log("✅ New assignment created:", created.dataValues);
      return responseHandler.success(res, msg.common.createSuccess, { emp_id, job_id });
    }

  } catch (error) {
    console.error("🔥 Error in updateEmployeeJob:", error);
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
  updateEmployeeJob
};
