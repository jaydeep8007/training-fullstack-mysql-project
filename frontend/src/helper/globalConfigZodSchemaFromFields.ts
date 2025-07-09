// utils/buildZodSchemaFromFields.ts
import { z } from "zod";

export const buildZodSchemaFromFields = (fields: Record<string, any>[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((fieldObj) => {
    const key = Object.keys(fieldObj)[0];
    const config = fieldObj[key];
    let validator = z.string();

    if (config.required) {
      validator = validator.min(1, `${config.label} is required`);
    } else if (config.min) {
      validator = validator.min(config.min, `${config.label} must be at least ${config.min} characters`);
    }

    if (config.max) {
      validator = validator.max(config.max, `${config.label} must be at most ${config.max} characters`);
    }

    if (config.regex) {
      const regex = new RegExp(config.regex.replace(/^\/|\/$/g, ""));
      validator = validator.regex(regex, `${config.label} is not valid`);
    }

    shape[key] = validator;
  });

  return z.object(shape);
};
