import logger from "../config/logger.js";

const errorMiddleware = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Server Error";

  // Log error details
  logger.error(`[${req.method}] ${req.path} - ${status}:`, err);

  // Handle Joi validation errors
  if (err.details && err.details[0]) {
    return res.status(400).json({
      success: false,
      message: err.details[0].message,
      statusCode: 400,
    });
  }

  // Handle MongoDB validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors)
        .map((e) => e.message)
        .join(", "),
      statusCode: 400,
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: `${Object.keys(err.keyValue)[0]} already exists`,
      statusCode: 400,
    });
  }

  res.status(status).json({
    success: false,
    message,
    statusCode: status,
  });
};

export default errorMiddleware;
