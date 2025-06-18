import { z } from "zod";
import jobModel from "../models/job.model";

export const jobCreateSchema = z.object({
  job_name: z
    .string()
    .min(2, "Job name must be at least 2 characters")
    .max(50, "Job name must be at most 50 characters"),

  job_sku: z
    .string()
    .min(1, "Job SKU is required")
    .max(20, "Job SKU must be at most 20 characters"),

  job_category: z
    .string()
    .min(2, "Job category must be at least 2 characters")
    .max(50, "Job category must be at most 50 characters"),
})  .refine(
    async (data) => {
      // Async uniqueness check for job_sku in DB
      const existingJob = await jobModel.findOne({
        where: { job_sku: data.job_sku },
      });
      return !existingJob; // true if SKU NOT found (unique)
    },
    {
      message: "Job SKU already exists",
      path: ["job_sku"],
    }
  );
