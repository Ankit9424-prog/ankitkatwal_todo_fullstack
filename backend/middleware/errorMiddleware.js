// Ankit Katwal
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message || "Internal server error";

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid resource ID format: ${err.value}`;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors || {}).map((e) => e.message);
    message = errors.length > 0 ? errors[0] : "Validation failed";
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = "An account with that email already exists";
  }

  console.error(`[Error Handler] ${req.method} ${req.originalUrl} - ${statusCode} ${message}`);

  res.status(statusCode).json({
    error: statusCode === 400 ? "Bad Request" : statusCode === 401 ? "Unauthorized" : statusCode === 404 ? "Not Found" : "Internal Server Error",
    message,
  });
};

module.exports = errorHandler;
