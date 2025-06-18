import { NextFunction, Request, Response } from "express";
import { Op, ValidationError } from "sequelize";
import employeeModel from "../models/employee.model";
import customerModel from "../models/customer.model";
import employeeValidation from "../validations/employee.validation";
import { resCode } from "../constants/resCode";
import { responseHandler } from "../services/responseHandler.service";
import { msg } from "../constants/language/en.constant";
import commonQuery from "../services/commonQuery.service";

// 🔸 Initialize queries
const employeeQuery = commonQuery(employeeModel);
const customerQuery = commonQuery(customerModel);

/* ============================================================================
 * ➕ Create a New Employee
 * ============================================================================
 */
const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = await employeeValidation.employeeCreateSchema.safeParseAsync(
      req.body
    );
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const newEmployee = await employeeQuery.create(parsed.data);

    return responseHandler.success(
      res,
      msg.employee.createSuccess,
      newEmployee,
      resCode.CREATED
    );
  } catch (error: any) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(
        res,
        messages.join(", "),
        resCode.BAD_REQUEST
      );
    }

    return next(error);
  }
};

/* ============================================================================
 * 📥 Get All Employees with Associated Customers
 * ============================================================================
 */
// const getAllEmployees = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const employees = await employeeQuery.getAll({
//       include: [
//         {
//           model: customerModel,
//           as: "customer",
//           attributes: ["cus_id", "cus_firstname", "cus_lastname", "cus_email"],
//         },
//       ],
//     });

//     return responseHandler.success(
//       res,
//       msg.employee.fetchSuccess,
//       employees,
//       resCode.OK
//     );
//   } catch (error) {
//     if (error instanceof ValidationError) {
//       const messages = error.errors.map((err) => err.message);
//       return responseHandler.error(
//         res,
//         messages.join(", "),
//         resCode.BAD_REQUEST
//       );
//     }

//     return next(error);
//   }
// };
const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = (page - 1) * limit;

    const { count: totalDataCount, rows: employees } = await employeeModel.findAndCountAll({
      include: [
        {
          model: customerModel,
          as: "customer",
          attributes: ["cus_id", "cus_firstname", "cus_lastname", "cus_email"]
        }
      ],
      limit,
      offset,
    });

    return responseHandler.success(
      res,
      msg.employee.fetchSuccess,
      {
        totalDataCount,
        page,
        limit,
        totalPages: Math.ceil(totalDataCount / limit), // how many pages needed
        data: employees,
      },
      resCode.OK
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(", "), resCode.BAD_REQUEST);
    }
    return next(error);
  }
};


/* ============================================================================
 * 🗑️ Delete Employee by ID
 * ============================================================================
 */
const deleteEmployeeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const employee = await employeeQuery.getById(id);
    if (!employee) {
      return responseHandler.error(
        res,
        msg.employee.notFound,
        resCode.NOT_FOUND
      );
    }

    await employee.destroy();

    return responseHandler.success(
      res,
      msg.employee.deleteSuccess,
      null,
      resCode.OK
    );
  } catch (error) {
    return next(error);
  }
};

/* ============================================================================
 * 🔁 Update Employee by ID
 * ============================================================================
 */
const updateEmployeeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate request body with Zod
    const parsed = await employeeValidation.employeeUpdateSchema.safeParseAsync(
      req.body
    );
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((e) => e.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const data = parsed.data;

    // Check if employee exists
    const employee = await employeeQuery.deleteById({
      where: { emp_id: Number(id) },
    });
    if (!employee) {
      return responseHandler.error(
        res,
        msg.employee.notFound,
        resCode.NOT_FOUND
      );
    }

    // Check for duplicate email
    if (data.emp_email) {
      const emailExists = await employeeQuery.getOne({
        where: {
          emp_email: data.emp_email,
          emp_id: { [Op.ne]: Number(id) },
        },
      });
      if (emailExists) {
        return responseHandler.error(
          res,
          msg.employee.emailAlreadyExists,
          resCode.BAD_REQUEST
        );
      }
    }

    // Check for duplicate mobile number
    if (data.emp_mobile_number) {
      const phoneExists = await employeeQuery.getOne({
        where: {
          emp_mobile_number: data.emp_mobile_number,
          emp_id: { [Op.ne]: Number(id) },
        },
      });
      if (phoneExists) {
        return responseHandler.error(
          res,
          msg.employee.phoneAlreadyExists,
          resCode.BAD_REQUEST
        );
      }
    }

    // Perform the update
    await employeeModel.update(data, {
      where: { emp_id: Number(id) },
    });

    // Fetch updated employee record
    const updatedEmployee = await employeeQuery.getOne({
      where: { emp_id: Number(id) },
    });

    return responseHandler.success(
      res,
      msg.employee.updateSuccess,
      updatedEmployee,
      resCode.OK
    );
  } catch (error) {
    return next(error);
  }
};

/* ============================================================================
 * 📦 Export Employee Controller
 * ============================================================================
 */
export default {
  getAllEmployees,
  createEmployee,
  deleteEmployeeById,
  updateEmployeeById,
};
