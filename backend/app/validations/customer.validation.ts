import { z } from 'zod';
import customerModel from '../models/customer.model';
import { msg } from '../constants/language';

// Common password validation function
const validateStrongPassword = (val: string, ctx: z.RefinementCtx) => {
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

// Async schema for customer creation
const customerCreateSchema = z
  .object({
    cus_firstname: z
      .string()
      .trim()
      .min(1, msg.validation.firstName.required)
      .max(50, msg.validation.firstName.max)
      .regex(/^[A-Za-z\s]+$/, msg.validation.firstName.regex),

    cus_lastname: z
      .string()
      .trim()
      .min(1, msg.validation.lastName.required)
      .max(50, msg.validation.lastName.max)
      .regex(/^[A-Za-z\s]+$/, msg.validation.lastName.regex),

    cus_email: z
      .string()
      .trim()
      .email(msg.validation.email.invalid)
      .transform((email) => email.toLowerCase()),

    cus_phone_number: z
      .string()
      .length(10, msg.validation.phone.exactLength)
      .regex(/^\d+$/, msg.validation.phone.onlyDigits),

    cus_password: z
      .string()
      .min(8, msg.validation.password.min)
      .superRefine(validateStrongPassword),

    cus_confirm_password: z
      .string()
      .min(8, msg.validation.confirmPassword.required),

    cus_status: z.string().optional(),
  })
  .strict()
  .refine((data) => data.cus_password === data.cus_confirm_password, {
    message: msg.validation.password.mismatch,
    path: ['cus_confirm_password'],
  })
  .superRefine(async (data, ctx) => {
    const emailExists = await customerModel.findOne({
      where: { cus_email: data.cus_email },
    });

    if (emailExists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg.validation.email.exists,
        path: ['cus_email'],
      });
    }

    const phoneExists = await customerModel.findOne({
      where: { cus_phone_number: data.cus_phone_number },
    });

    if (phoneExists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg.validation.phone.exists,
        path: ['cus_phone_number'],
      });
    }
  });

const customerLoginSchema = z.object({
  cus_email: z
    .string()
    .trim()
    .email(msg.validation.email.invalid)
    .transform((email) => email.toLowerCase()),

  cus_password: z.string(),
});

const customerUpdateSchema = z
  .object({
    cus_firstname: z.string().min(2).max(50).optional(),
    cus_lastname: z.string().min(2).max(50).optional(),
    cus_email: z.string().email(msg.validation.email.invalid).optional(),
    cus_phone_number: z
      .string()
      .length(10, msg.validation.phone.exactLength)
      .regex(/^\d+$/, msg.validation.phone.onlyDigits)
      .optional(),
    cus_password: z
      .string()
      .min(8, msg.validation.password.min)
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).*$/,
        msg.validation.password.pattern,
      )
      .optional(),
    cus_status: z
      .enum(['active', 'inactive', 'restricted', 'blocked'], {
        errorMap: () => ({
          message: msg.validation.status.enum,
        }),
      })
      .optional(),
  })
  .strict();

const forgotPasswordSchema = z
  .object({
    cus_email: z
      .string({
        required_error: msg.validation.email.required,
      })
      .trim()
      .email(msg.validation.email.invalid)
      .transform((email) => email.toLowerCase()),
  })
  .strict();

const resetPasswordSchema = z
  .object({
    cus_auth_refresh_token: z
      .string({
        required_error: msg.validation.token.required,
      })
      .min(1, msg.validation.token.required),

    new_password: z
      .string({
        required_error: msg.validation.password.newRequired,
      })
      .min(8, msg.validation.password.min)
      .superRefine(validateStrongPassword),

    confirm_password: z
      .string({
        required_error: msg.validation.confirmPassword.required,
      })
      .min(8, msg.validation.confirmPassword.min),
  })
  .strict()
  .refine((data) => data.new_password === data.confirm_password, {
    message: msg.validation.password.mismatch,
    path: ['confirm_password'],
  });

export const customerValidations = {
  customerCreateSchema,
  customerLoginSchema,
  customerUpdateSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
