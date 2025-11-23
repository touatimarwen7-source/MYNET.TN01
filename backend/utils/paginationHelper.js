/**
 * Unified Pagination Helper
 * Ensures all endpoints use consistent pagination limits
 */

const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 500,
  DEFAULT_OFFSET: 0,
};

const validatePagination = (limit, offset) => {
  // Enforce limits
  let validLimit = parseInt(limit) || PAGINATION.DEFAULT_LIMIT;
  let validOffset = parseInt(offset) || PAGINATION.DEFAULT_OFFSET;

  // Cap the limit
  if (validLimit > PAGINATION.MAX_LIMIT) {
    validLimit = PAGINATION.MAX_LIMIT;
  }
  if (validLimit < 1) {
    validLimit = PAGINATION.DEFAULT_LIMIT;
  }

  // Prevent negative offset
  if (validOffset < 0) {
    validOffset = PAGINATION.DEFAULT_OFFSET;
  }

  return { limit: validLimit, offset: validOffset };
};

const buildPaginationQuery = (limit, offset) => {
  const { limit: validLimit, offset: validOffset } = validatePagination(limit, offset);
  return {
    limit: validLimit,
    offset: validOffset,
    sql: `LIMIT ${validLimit} OFFSET ${validOffset}`,
  };
};

module.exports = {
  PAGINATION,
  validatePagination,
  buildPaginationQuery,
};
