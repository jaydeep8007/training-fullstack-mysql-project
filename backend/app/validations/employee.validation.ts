import { z } from 'zod';
import employeeModel from '../models/employee.model';
import { msg } from '../constants/language'; // ✅ Dynamic language import

export const validateStrongPassword = (val: string, ctx: z.RefinementCtx) => {
  if (!/[A-Z]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: msg.validation.password.uppercase,
    });
  }
  if (!/[a-z]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: msg.validation.password.lowercase,
    });
  }
  if (!/\d/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: msg.validation.password.number,
    });
  }
  if (!/[!@#$%^&*()_+]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: msg.validation.password.specialChar,
    });
  }
};

const employeeCreateSchema = z
  .object({
    emp_name: z
      .string()
      .min(1, msg.validation.firstName.required)
      .max(50, msg.validation.firstName.max),
    emp_email: z
      .string()
      .email(msg.validation.email.invalid)
      .transform((email) => email.toLowerCase()),

    emp_password: z
      .string()
      .min(8, msg.validation.password.min)
      .superRefine(validateStrongPassword),

    emp_company_name: z
      .string()
      .min(2, msg.common.invalidInput)
      .max(100, msg.common.invalidInput),

    cus_id: z.number({
      required_error: msg.common.requiredAllFields,
      invalid_type_error: msg.common.invalidId,
    }),

    emp_mobile_number: z
      .string()
      .min(10, msg.validation.phone.exactLength)
      .max(15, msg.validation.phone.exactLength)
      .regex(/^\d+$/, msg.validation.phone.onlyDigits),
  })
  .strict()
  .superRefine(async (data, ctx) => {
    const existingEmail = await employeeModel.findOne({
      where: { emp_email: data.emp_email },
    });
    if (existingEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg.employee.emailAlreadyExists,
        path: ['emp_email'],
      });
    }

    const existingPhone = await employeeModel.findOne({
      where: { emp_mobile_number: data.emp_mobile_number },
    });
    if (existingPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg.employee.phoneAlreadyExists,
        path: ['emp_mobile_number'],
      });
    }
  });

const employeeUpdateSchema = z
  .object({
    emp_name: z
      .string()
     .min(1, msg.validation.firstName.required)
      .max(50, msg.validation.firstName.max)
      .optional(),

    emp_email: z
      .string()
      .email(msg.validation.email.invalid)
      .transform((email) => email.toLowerCase())
      .optional(),

    emp_password: z
      .string()
      .min(8, msg.validation.password.min)
      .superRefine(validateStrongPassword)
      .optional(),

    emp_company_name: z
      .string()
      .min(2, msg.common.invalidInput)
      .max(100, msg.common.invalidInput)
      .optional(),

    emp_mobile_number: z
      .string()
      .min(10, msg.validation.phone.exactLength)
      .max(15, msg.validation.phone.exactLength)
      .regex(/^\d+$/, msg.validation.phone.onlyDigits)
      .optional(),
  })
  .strict()
  .superRefine(async (data, ctx) => {
    if (data.emp_email) {
      const existingEmail = await employeeModel.findOne({
        where: { emp_email: data.emp_email },
      });
      if (existingEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: msg.employee.emailAlreadyExists,
          path: ['emp_email'],
        });
      }
    }

    if (data.emp_mobile_number) {
      const existingPhone = await employeeModel.findOne({
        where: { emp_mobile_number: data.emp_mobile_number },
      });
      if (existingPhone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: msg.employee.phoneAlreadyExists,
          path: ['emp_mobile_number'],
        });
      }
    }
  });

export default {
  employeeCreateSchema,
  employeeUpdateSchema,
};
