import { z } from 'zod';
import employeeModel from '../models/employee.model';
import jobModel from '../models/job.model';
import { msg } from '../constants/language';

const assignJobSchema = z
  .object({
    emp_id: z
      .number({ invalid_type_error: msg.validation.employeeJob.empIdType })
      .min(1, { message: msg.validation.employeeJob.empIdRequired }),

    job_id: z
      .number({ invalid_type_error: msg.validation.employeeJob.jobIdType })
      .min(1, { message: msg.validation.employeeJob.jobIdRequired }),
  })
  .superRefine(async (data, ctx) => {
    // Check if emp_id exists
    const employee = await employeeModel.findByPk(data.emp_id);
    if (!employee) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg.validation.employeeJob.empIdNotFound,
        path: ['emp_id'],
      });
    }

    // Check if job_id exists
    const job = await jobModel.findByPk(data.job_id);
    if (!job) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg.validation.employeeJob.jobIdNotFound,
        path: ['job_id'],
      });
    }
  });

const assignMultipleJobsSchema = z.object({
  emp_ids: z
    .array(z.number({ invalid_type_error: msg.validation.employeeJob.empIdType }))
    .nonempty({ message: msg.validation.employeeJob.empIdsEmpty }),

  job_id: z.number({ required_error: msg.validation.employeeJob.jobIdRequired }),
});

export default {
  assignJobSchema,
  assignMultipleJobsSchema,
};
