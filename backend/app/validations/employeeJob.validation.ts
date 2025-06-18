// validations/employee_job.validation.ts
import { z } from "zod";
import employeeModel from "../models/employee.model";
import jobModel from "../models/job.model";

const assignJobSchema = z
  .object({
    emp_id: z
      .number({ invalid_type_error: "emp_id must be a number" })
      .min(1, "emp_id is required"),

    job_id: z
      .number({ invalid_type_error: "job_id must be a number" })
      .min(1, "job_id is required"),
  })
  .superRefine(async (data, ctx) => {
    // Check if emp_id exists
    const employee = await employeeModel.findByPk(data.emp_id);
    if (!employee) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Employee ID does not exist",
        path: ["emp_id"],
      });
    }

    // Check if job_id exists
    const job = await jobModel.findByPk(data.job_id);
    if (!job) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Job ID does not exist",
        path: ["job_id"],
      });
    }
  });

const assignMultipleJobsSchema = z.object({
  emp_ids: z
    .array(z.number({ invalid_type_error: "emp_id must be a number" }))
    .nonempty("emp_ids array cannot be empty"),

  job_id: z.number({ required_error: "job_id is required" }),
});

export default {
    assignJobSchema,
    assignMultipleJobsSchema
}