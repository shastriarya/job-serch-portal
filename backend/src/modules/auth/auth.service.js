import User from "../user/user.model.js";
import bcrypt from "bcryptjs";
import logger from "../../config/logger.js";

export const registerUser = async (data) => {
  try {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      const error = new Error("User with this email already exists");
      error.statusCode = 400;
      throw error;
    }

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      ...data,
      email: data.email.toLowerCase(),
      password: hashed,
    });

    logger.info(`New user registered: ${user.email}`);
    return user;
  } catch (err) {
    logger.error("Registration error:", err);
    throw err;
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    logger.info(`User logged in: ${user.email}`);
    return user;
  } catch (err) {
    logger.error("Login error:", err);
    throw err;
  }
};
