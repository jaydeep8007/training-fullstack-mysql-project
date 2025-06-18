import { Request, Response, NextFunction } from "express";
import { hashPassword } from "../services/password.service";
import { responseHandler } from "../services/responseHandler.service";
import { resCode } from "../constants/resCode";
import { ValidationError } from "sequelize";
import { customerValidations } from "../validations/customer.validation";
import { msg } from "../constants/language/en.constant";
import customerModel from "../models/customer.model";
import employeeModel from "../models/employee.model";
import commonQuery from "../services/commonQuery.service";

// 🔸 Initialize customer-specific query service
const customerQuery = commonQuery(customerModel);

/* ============================================================================
 * ➕ Add Customer
 * ============================================================================
 */
const addCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 🔍 Validate request body
    const parsed = await customerValidations.customerCreateSchema.safeParseAsync(req.body);

    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const {
      cus_password,
      cus_email,
      cus_phone_number,
      cus_firstname,
      cus_lastname,
      cus_status = "active",
    } = parsed.data as typeof parsed.data & {
      cus_status: "active" | "inactive" | "restricted" | "blocked";
    };

    // 🔐 Hash the password before saving
    const hashedPassword = await hashPassword(cus_password);

    // 📥 Create new customer
    const newCustomer = await customerQuery.create({
      cus_firstname,
      cus_lastname,
      cus_email,
      cus_phone_number,
      cus_password: hashedPassword,
      cus_status,
    });

    return responseHandler.success(
      res,
      msg.customer.createSuccess,
      newCustomer,
      resCode.CREATED
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
 * 📄 Get All Customers
 * ============================================================================
 */
const getCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.results_per_page as string, 10) || 10;

    const result = await customerQuery.getAll(
      {},
      {
        page,
        limit,
        include: [
          {
            model: employeeModel,
            as: "employee", // should match alias in customerModel association
            required: false, // LEFT JOIN behavior
          },
        ],
      }
    );

    return responseHandler.success(
      res,
      msg.customer.fetchSuccess,
      {
        totalDataCount: result.pagination.totalDataCount,
        totalPages: result.pagination.totalPages,
        page: result.pagination.page,
        results_per_page: result.pagination.limit,
        data: result.data,
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
// const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const offset = (page - 1) * limit;

//     const customers = await customerQuery.getAll({ limit, offset });
//     const totalDataCount = await customerModel.count();

//     return responseHandler.success(
//       res,
//       msg.customer.fetchSuccess,
//       {
//         totalDataCount,
//         page,
//         limit,
//         totalPages: Math.ceil(totalDataCount / limit),//how many pages we need to show all data
//         data: customers,
//       },
//       resCode.OK
//     );
//   } catch (error) {
//     if (error instanceof ValidationError) {
//       const messages = error.errors.map((err) => err.message);
//       return responseHandler.error(res, messages.join(", "), resCode.BAD_REQUEST);
//     }

//     return next(error);
//   }
// };


/* ============================================================================
 * 📄 Get Customer by ID (with associated employees)
 * ============================================================================
 */
const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await customerQuery.getById(req.params.id, {
      include: [
        {
          model: employeeModel,
          as: "employee", // must match model association alias
          attributes: ["emp_id", "emp_name", "emp_email", "emp_mobile_number"],
        },
      ],
    });

    if (!customer) {
      return responseHandler.error(res, msg.customer.notFound, resCode.NOT_FOUND);
    }

    return responseHandler.success(res, msg.customer.fetchSuccess, customer, resCode.OK);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(", "), resCode.BAD_REQUEST);
    }

    return next(error);
  }
};

/* ============================================================================
 * ✏️ Update Customer by ID
 * ============================================================================
 */
const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 🔍 Check if customer exists
    const customer = await customerQuery.getById(req.params.id);

    if (!customer) {
      return responseHandler.error(res, msg.customer.fetchFailed, resCode.NOT_FOUND);
    }

    // 🔍 Validate update input
    const parsed = await customerValidations.customerUpdateSchema.safeParseAsync(req.body);

    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(", ");
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    // 🔁 Update customer
    const { affectedCount, updatedRows } = await customerQuery.update(
      { cus_id: req.params.id },
      parsed.data
    );

    if (affectedCount === 0) {
      return responseHandler.error(res, msg.customer.updateFailed, resCode.BAD_REQUEST);
    }

    return responseHandler.success(res, msg.customer.updateSuccess, updatedRows, resCode.OK);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(", "), resCode.BAD_REQUEST);
    }

    return next(error);
  }
};

/* ============================================================================
 * ❌ Delete Customer by ID
 * ============================================================================
 */
const deleteCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await customerQuery.deleteById({ cus_id: req.params.id });

    if (result.deletedCount === 0) {
      return responseHandler.error(res, msg.common.invalidId, resCode.NOT_FOUND);
    }

    return responseHandler.success(res, msg.customer.deleteSuccess, null, resCode.OK);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(", "), resCode.BAD_REQUEST);
    }

    return next(error);
  }
};

/* ============================================================================
 * 📦 Export All Customer Controllers
 * ============================================================================
 */
export default {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomerById,
};
