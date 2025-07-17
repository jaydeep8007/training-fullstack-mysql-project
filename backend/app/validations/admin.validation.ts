import { z } from 'zod';
import adminModel from '../models/admin.model';
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

// Async schema for admin creation
const adminCreateSchema = z
  .object({
    admin_firstname: z
      .string()
      .trim()
      .min(1, msg.validation.firstName.required)
      .max(50, msg.validation.firstName.max)
      .regex(/^[A-Za-z\s]+$/, msg.validation.firstName.regex),

    admin_lastname: z
      .string()
      .trim()
      .min(1, msg.validation.lastName.required)
      .max(50, msg.validation.lastName.max)
      .regex(/^[A-Za-z\s]+$/, msg.validation.lastName.regex),

    admin_email: z
      .string()
      .trim()
      .email(msg.validation.email.invalid)
      .transform((email) => email.toLowerCase()),

    admin_phone_number: z
      .string()
      .length(10, msg.validation.phone.exactLength)
      .regex(/^\d+$/, msg.validation.phone.onlyDigits),

    admin_password: z
      .string()
      .min(8, msg.validation.password.min)
      .superRefine(validateStrongPassword),

    admin_confirm_password: z
      .string()
      .min(8, msg.validation.confirmPassword.required),

    role_id: z.number().int().positive({ message: "role required" }),

   
  })
  .strict()
  .refine((data) => data.admin_password === data.admin_confirm_password, {
    message: msg.validation.password.mismatch,
    path: ['admin_confirm_password'],
  })
  .superRefine(async (data, ctx) => {
    const emailExists = await adminModel.findOne({
      where: { admin_email: data.admin_email },
    });

    if (emailExists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg.validation.email.exists,
        path: ['admin_email'],
      });
    }

    const phoneExists = await adminModel.findOne({
      where: { admin_phone_number: data.admin_phone_number },
    });

    if (phoneExists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg.validation.phone.exists,
        path: ['admin_phone_number'],
      });
    }
  });

const adminLoginSchema = z.object({
  admin_email: z
    .string()
    .trim()
    .email(msg.validation.email.invalid)
    .transform((email) => email.toLowerCase()),

  admin_password: z.string(),

  
});

const adminUpdateSchema = z
  .object({
    admin_firstname: z.string().min(2).max(50).optional(),
    admin_lastname: z.string().min(2).max(50).optional(),
    admin_email: z.string().email(msg.validation.email.invalid).optional(),
    admin_phone_number: z
      .string()
      .length(10, msg.validation.phone.exactLength)
      .regex(/^\d+$/, msg.validation.phone.onlyDigits)
      .optional(),
    admin_password: z
      .string()
      .min(8, msg.validation.password.min)
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).*$/,
        msg.validation.password.pattern
      )
      .optional(),
    admin_status: z
      .enum(['active', 'inactive', 'restricted', 'blocked'], {
        errorMap: () => ({
          message: msg.validation.status.enum,
        }),
      })
      .optional(),
      role_id: z.number().int().positive({ message: "role required" }).optional(),
  })
  .strict();

const forgotPasswordSchema = z
  .object({
    admin_email: z
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
    reset_token: z
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

export const adminValidations = {
  adminCreateSchema,
  adminLoginSchema,
  adminUpdateSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
