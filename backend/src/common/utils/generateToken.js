import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";

const generateToken = (user) => {
  if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

export default generateToken;
