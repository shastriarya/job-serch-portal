import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import logger from "../config/logger.js";

export const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided",
        statusCode: 401,
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Auth error: ${error.message}`);
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
      statusCode: 401,
    });
  }
};

export const optionalProtect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Optional auth ignored: ${error.message}`);
    next();
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        statusCode: 401,
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Unauthorized access attempt by ${req.user.id} role: ${req.user.role}`,
      );
      return res.status(403).json({
        success: false,
        message: `This operation requires one of these roles: ${roles.join(", ")}`,
        statusCode: 403,
      });
    }
    next();
  };
};
