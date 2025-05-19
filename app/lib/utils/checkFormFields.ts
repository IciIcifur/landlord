import z, { ZodIssue, ZodSchema } from 'zod';

export default function CheckFormFields(fields: any, schema: ZodSchema) {
  const newErrors: Record<string, string> = {};
  try {
    schema.parse(fields);
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      e.errors.forEach((error: ZodIssue) => {
        if (error.path.length > 0) {
          newErrors[error.path[0].toString()] = error.message;
        }
      });
    }
  }
  return newErrors;
}
