import { z } from 'zod';
import jobModel from '../models/job.model';
import { msg } from '../constants/language'; // Dynamic language-aware messages

export const jobCreateSchema = z
  .object({
    job_name: z
      .string()
      .min(2, { message: msg.validation.job.nameMin })
      .max(50, { message: msg.validation.job.nameMax }),

    job_sku: z
      .string()
      .min(1, { message: msg.validation.job.skuRequired })
      .max(20, { message: msg.validation.job.skuMax }),

    job_category: z
      .string()
      .min(2, { message: msg.validation.job.categoryMin })
      .max(50, { message: msg.validation.job.categoryMax }),
  })
  .superRefine(async (data, ctx) => {
    const existingJob = await jobModel.findOne({
      where: { job_sku: data.job_sku },
    });
    if (existingJob) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg.validation.job.skuExists(data.job_sku),
        path: ['job_sku'],
      });
    }
  });
