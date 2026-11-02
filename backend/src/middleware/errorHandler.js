
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

// Handle routes that do not exist
function notFound(req, res, next) {
  next(
    ApiError.notFound(
      `Route ${req.method} ${req.originalUrl} not found`
    )
  );
}

// Global error handler
function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details;

  // PostgreSQL unique constraint violation
  if (err.code === "23505") {
    status = 409;
    message = "That value is already in use";
    details = err.detail;

  // PostgreSQL foreign key violation
  } else if (err.code === "23503") {
    status = 400;
    message = "Referenced record does not exist";

  // PostgreSQL invalid identifier
  } else if (err.code === "22P02") {
    status = 400;
    message = "Invalid identifier";

  // Zod validation error
  } else if (err.name === "ZodError") {
    status = 400;
    message = "Validation failed";
    details = err.issues;
  }

  // Log server errors
  if (status >= 500) {
    console.error(
      `[${req.method} ${req.originalUrl}]`,
      err
    );
  }

  // Hide internal error information in production
  if (status >= 500 && env.isProd) {
    message = "Internal server error";
    details = undefined;
  }

  // Send JSON error response
  res.status(status).json({
    error: {
      message,

      ...(details !== undefined ? { details } : {}),

      ...(!env.isProd ? { stack: err.stack } : {})
    }
  });
}

module.exports = {
  notFound,
  errorHandler
};
