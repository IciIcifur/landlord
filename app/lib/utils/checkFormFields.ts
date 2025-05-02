import z, { ZodSchema } from 'zod';

export default function CheckFormFields(fields: any, schema: ZodSchema) {
  const newErrors = {};
  try {
    schema.parse(fields);
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      e.errors.forEach((error) => {
        if (error.path.length > 0) {
          newErrors[error.path[0]] = error.message;
        }
      });
    }
  }
  return newErrors;
}
