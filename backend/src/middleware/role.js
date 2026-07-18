import { ApiError } from "../utils/ApiError.js";

// Restricts a route to one or more roles (e.g. requireRole("LECTURER")).
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden("You do not have permission to perform this action.")
      );
    }
    next();
  };
