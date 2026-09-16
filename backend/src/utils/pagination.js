import { ApiError } from "./ApiError.js";

export const getPagination = (query, { defaultLimit = 50, maxLimit = 100 } = {}) => {
  const page = query.page === undefined ? 1 : Number(query.page);
  const requestedLimit = query.limit === undefined ? defaultLimit : Number(query.limit);
  if (!Number.isInteger(page) || page < 1) throw ApiError.badRequest("page must be a positive integer");
  if (!Number.isInteger(requestedLimit) || requestedLimit < 1) {
    throw ApiError.badRequest("limit must be a positive integer");
  }
  const limit = Math.min(requestedLimit, maxLimit);
  return { page, limit, skip: (page - 1) * limit };
};
