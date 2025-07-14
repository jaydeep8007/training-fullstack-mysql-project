import { Request, Response, NextFunction } from 'express';
import { hashPassword } from '../services/password.service';
import { responseHandler } from '../services/responseHandler.service';
import { resCode } from '../constants/resCode';
import { ValidationError } from 'sequelize';
import { customerValidations } from '../validations/customer.validation';
import { msg } from '../constants/language';
import customerModel from '../models/customer.model';
import employeeModel from '../models/employee.model';
import commonQuery from '../services/commonQuery.service';

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
      const errorMsg = parsed.error.errors.map((err) => err.message).join(', ');
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const {
      cus_password,
      cus_email,
      cus_phone_number,
      cus_firstname,
      cus_lastname,
      cus_status = 'active',
    } = parsed.data as typeof parsed.data & {
      cus_status: 'active' | 'inactive' | 'restricted' | 'blocked';
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

    return responseHandler.success(res, msg.customer.createSuccess, newCustomer, resCode.CREATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(', '), resCode.BAD_REQUEST);
    }

    return next(error);
  }
};

/* ============================================================================
 * 📄 Get All Customers
 * ============================================================================
 */
const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const results_per_page = parseInt(req.query.results_per_page as string, 10) || 10;
    const offset = (page - 1) * results_per_page;

    const filter = {}; // add filters if needed (e.g. { isActive: true })

const options = {
  limit: results_per_page,
  offset,
  order: [['createdAt', 'DESC']], // ⬅️ Add this line to sort by latest (descending order) ASC for ascending 
  // Customer.find().sort({ createdAt: -1 }).skip(offset).limit(limit); in mongodb for sorting 
  include: [
    {
      model: employeeModel,
      as: 'employee',
      required: false,
    },
  ],
};


    const data = await customerQuery.getAll(filter, options);

    // const count = await customerModel.count({ where: filter });
    const count = await customerQuery.countDocuments(customerModel, filter);


    return responseHandler.success(
      res,
      msg.customer.fetchSuccess,
      {
        count,
        rows: data,
      },
      resCode.OK,
    );
  } catch (error) {
    return next(error);
  }
};

/* ============================================================================
 * 📄 Get Customer by ID (with associated employees)
 * ============================================================================
 */
const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  const msg = getMsg();
    const customer = await customerQuery.getById(req.params.id, {
      include: [
        {
          model: employeeModel,
          as: 'employee', // must match model association alias
          attributes: ['emp_id', 'emp_name', 'emp_email', 'emp_mobile_number'],
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
      return responseHandler.error(res, messages.join(', '), resCode.BAD_REQUEST);
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
    const cus_id = req.params.id;

    // 🔍 1. Check if customer exists
    const existingCustomer = await customerQuery.getById(cus_id);
    if (!existingCustomer) {
      return responseHandler.error(res, msg.customer.fetchFailed, resCode.NOT_FOUND);
    }

    // 🔍 2. Validate input
    const parsed = await customerValidations.customerUpdateSchema.safeParseAsync(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map((err) => err.message).join(', ');
      return responseHandler.error(res, errorMsg, resCode.BAD_REQUEST);
    }

    const updateData = parsed.data;

    // 🔍 3. Check if updateData is same as existing
    const isSame = Object.entries(updateData).every(
      ([key, value]) => existingCustomer[key] === value
    );

    if (isSame) {
      return responseHandler.success(res, msg.common.noChanges);
    }
    // 🔁 4. Compare & collect changed fields
const changedFields: Record<string, any> = {};
for (const [key, value] of Object.entries(updateData)) {
  if (existingCustomer[key] !== value) {
    changedFields[key] = value;
  }
}

    // 🔁 5. Update using common query
    const updatedCount = await customerQuery.update(updateData, { cus_id });

    if (updatedCount === 0) {
      return responseHandler.error(res, msg.customer.updateFailed, resCode.BAD_REQUEST);
    }

    return responseHandler.success(res, msg.customer.updateSuccess, {
    updatedFields: changedFields,
  }, resCode.OK);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(', '), resCode.BAD_REQUEST);
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
    //  const msg = getMsg();
    const result = await customerQuery.deleteById({ cus_id: req.params.id });

    if (result.deletedCount === 0) {
      return responseHandler.error(res, msg.common.invalidId, resCode.NOT_FOUND);
    }

    return responseHandler.success(res, msg.customer.deleteSuccess);
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      return responseHandler.error(res, messages.join(', '), resCode.BAD_REQUEST);
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
