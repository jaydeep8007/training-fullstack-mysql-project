import { z } from "zod";

export const customerEditSchema = z.object({
  cus_firstname: z.string().min(2, "First name must be at least 2 characters"),
  cus_lastname: z.string().min(2, "Last name must be at least 2 characters"),
  cus_email: z.string().email("Invalid email address"),
  cus_phone_number: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
  cus_status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Status must be active or inactive" }),
  }),
});
