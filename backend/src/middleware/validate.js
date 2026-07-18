import { ApiError } from "../utils/ApiError.js";

// Validates req.body against a zod schema and replaces it with the parsed result.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues
      .map((i) => `${i.path.join(".") || "field"}: ${i.message}`)
      .join("; ");
    return next(ApiError.badRequest(message));
  }
  req.body = result.data;
  next();
};
