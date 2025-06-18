// import { z } from "zod";

// const customerCreateSchema = z
//   .object({
//     cus_firstname: z
//       .string()
//       .trim()
//       .min(1, "First name is required")
//       .max(50, "Maximum 50 characters allowed")
//       .regex(
//         /^[A-Za-z\s]+$/,
//         "First name must not contain numbers or special characters"
//       ),

//     cus_lastname: z
//       .string()
//       .trim()
//       .min(1, "Last name is required")
//       .max(50, "Maximum 50 characters allowed")
//       .regex(
//         /^[A-Za-z\s]+$/,
//         "Last name must not contain numbers or special characters"
//       ),

//     cus_email: z
//       .string()
//       .trim()
//       .email("Invalid email address")
//       .transform((email) => email.toLowerCase()),

//     cus_phone_number: z
//       .string()
//       .length(10, "Phone number must be exactly 10 digits")
//       .regex(/^\d+$/, "Phone number must contain only digits"),

//     cus_password: z
//       .string()
//       .min(8, "Password must be at least 8 characters")
//       .regex(
//         /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).+$/,
//         "Password must include uppercase, lowercase, number, and special character"
//       )
//       .superRefine((val, ctx) => {
//         if (!/[A-Z]/.test(val)) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Password must contain at least one uppercase letter",
//           });
//         }
//         if (!/[a-z]/.test(val)) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Password must contain at least one lowercase letter",
//           });
//         }
//         if (!/\d/.test(val)) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Password must contain at least one number",
//           });
//         }
//         if (!/[!@#$%^&*()_+]/.test(val)) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Password must contain at least one special character",
//           });
//         }
//       }),

//     cus_confirm_password: z.string().min(8, "Confirm password is required"),
//     cus_status: z.string().optional(),
//   })
//   .refine((data) => data.cus_password === data.cus_confirm_password, {
//     message: "Passwords do not match",
//     path: ["cus_confirm_password"],
//   });

// const customerLoginSchema = z.object({
//   cus_email: z
//     .string()
//     .trim()
//     .email("Invalid email address")
//     .transform((email) => email.toLowerCase()),

//   cus_password: z.string(),
// });

// const customerUpdateSchema = z
//   .object({
//     cus_firstname: z
//       .string()
//       .min(2, "First name must be at least 2 characters long")
//       .max(50, "First name must be no more than 50 characters")
//       .optional(),

//     cus_lastname: z
//       .string()
//       .min(2, "Last name must be at least 2 characters long")
//       .max(50, "Last name must be no more than 50 characters")
//       .optional(),

//     cus_email: z
//       .string()
//       .email("Please provide a valid email address")
//       .optional(),

//     cus_phone_number: z
//       .string({
//         required_error: "Phone number is required",
//         invalid_type_error: "Phone number must be a string",
//       })
//       .length(10, "Phone number must be exactly 10 digits")
//       .regex(/^\d+$/, "Phone number must contain only digits")
//       .optional(),

//     cus_password: z
//       .string()
//       .min(8, "Password must be at least 8 characters long")
//       .regex(
//         /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).*$/,
//         "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
//       )
//       .optional(),

//     cus_status: z
//       .enum(["active", "inactive", "restricted", "blocked"], {
//         errorMap: () => ({
//           message:
//             "Status must be one of: active, inactive, restricted, or blocked",
//         }),
//       })
//       .optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (!data.cus_firstname) {
//       ctx.addIssue({
//         path: ["cus_firstname"],
//         code: z.ZodIssueCode.custom,
//         message: "First name is required",
//       });
//     }

//     if (!data.cus_lastname) {
//       ctx.addIssue({
//         path: ["cus_lastname"],
//         code: z.ZodIssueCode.custom,
//         message: "Last name is required",
//       });
//     }

//     if (!data.cus_email) {
//       ctx.addIssue({
//         path: ["cus_email"],
//         code: z.ZodIssueCode.custom,
//         message: "Email is required",
//       });
//     }

//     if (!data.cus_phone_number) {
//       ctx.addIssue({
//         path: ["cus_phone_number"],
//         code: z.ZodIssueCode.custom,
//         message: "Phone number is required",
//       });
//     }

//     if (!data.cus_password) {
//       ctx.addIssue({
//         path: ["cus_password"],
//         code: z.ZodIssueCode.custom,
//         message: "Password is required",
//       });
//     }
//   });

// const forgotPasswordSchema = z.object({
//   cus_email: z
//     .string()
//     .trim()
//     .email("Invalid email address")
//     .transform((email) => email.toLowerCase()),
// });

// const resetPasswordSchema = z
//   .object({
//     reset_token: z.string().min(1, "Reset token is required"),
//     new_password: z
//       .string()
//       .min(8, "Password must be at least 8 characters")
//       .superRefine((val, ctx) => {
//         if (!/[A-Z]/.test(val)) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Password must contain at least one uppercase letter",
//           });
//         }
//         if (!/[a-z]/.test(val)) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Password must contain at least one lowercase letter",
//           });
//         }
//         if (!/\d/.test(val)) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Password must contain at least one number",
//           });
//         }
//         if (!/[!@#$%^&*()_+]/.test(val)) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Password must contain at least one special character",
//           });
//         }
//       }),
//     confirm_password: z.string().min(8, "Confirm password is required"),
//   })
//   .refine((data) => data.new_password === data.confirm_password, {
//     message: "Passwords do not match",
//     path: ["confirm_password"],
//   });

// export const customerValidations = {
//   customerCreateSchema,
//   customerLoginSchema,
//   customerUpdateSchema,
//   forgotPasswordSchema,
//   resetPasswordSchema,
// };

import { z } from "zod";
import customerModel from "../models/customer.model"; // Adjust path as needed

// Common password validation function
const validateStrongPassword = (val: string, ctx: z.RefinementCtx) => {
  if (!/[A-Z]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must contain at least one uppercase letter",
    });
  }
  if (!/[a-z]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must contain at least one lowercase letter",
    });
  }
  if (!/\d/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must contain at least one number",
    });
  }
  if (!/[!@#$%^&*()_+]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must contain at least one special character",
    });
  }
};

// Async schema for customer creation
const customerCreateSchema = z
  .object({
    cus_firstname: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(50, "Maximum 50 characters allowed")
      .regex(/^[A-Za-z\s]+$/, "First name must not contain numbers or special characters"),

    cus_lastname: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(50, "Maximum 50 characters allowed")
      .regex(/^[A-Za-z\s]+$/, "Last name must not contain numbers or special characters"),

    cus_email: z
      .string()
      .trim()
      .email("Invalid email address")
      .transform((email) => email.toLowerCase()),

    cus_phone_number: z
      .string()
      .length(10, "Phone number must be exactly 10 digits")
      .regex(/^\d+$/, "Phone number must contain only digits"),

    cus_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .superRefine(validateStrongPassword),

    cus_confirm_password: z.string().min(8, "Confirm password is required"),

    cus_status: z.string().optional(),
  }).strict()
  .refine((data) => data.cus_password === data.cus_confirm_password, {
    message: "Passwords do not match",
    path: ["cus_confirm_password"],
  })
  .superRefine(async (data, ctx) => {
    // ✅ Check email uniqueness
    const emailExists = await customerModel.findOne({
      where: { cus_email: data.cus_email },
    });

    if (emailExists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email already exists",
        path: ["cus_email"],
      });
    }

    // ✅ Check phone number uniqueness
    const phoneExists = await customerModel.findOne({
      where: { cus_phone_number: data.cus_phone_number },
    });

    if (phoneExists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone number already exists",
        path: ["cus_phone_number"],
      });
    }
  });

// Other schemas
const customerLoginSchema = z.object({
  cus_email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),
  cus_password: z.string(),
});

const customerUpdateSchema = z.object({
  cus_firstname: z.string().min(2).max(50).optional(),
  cus_lastname: z.string().min(2).max(50).optional(),
  cus_email: z.string().email("Please provide a valid email address").optional(),
  cus_phone_number: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .optional(),
  cus_password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).*$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .optional(),
  cus_status: z
    .enum(["active", "inactive", "restricted", "blocked"], {
      errorMap: () => ({
        message: "Status must be one of: active, inactive, restricted, or blocked",
      }),
    })
    .optional(),
}).strict();

 const forgotPasswordSchema = z.object({
  cus_email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),
}).strict();

const resetPasswordSchema = z
  .object({
    cus_auth_refresh_token: z
      .string({
        required_error: "Reset token is required",
      })
      .min(1, "Reset token is required"),

    new_password: z
      .string({
        required_error: "New password is required",
      })
      .min(8, "Password must be at least 8 characters")
      .superRefine(validateStrongPassword),

    confirm_password: z
      .string({
        required_error: "Confirm password is required",
      })
      .min(8, "Confirm password must be at least 8 characters"),
  }).strict()
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
// Final export
export const customerValidations = {
  customerCreateSchema,
  customerLoginSchema,
  customerUpdateSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};