import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { registerUser, loginUser } from "./auth.service.js";
import generateToken from "../../common/utils/generateToken.js";
import {
  successResponse,
  errorResponse,
} from "../../common/utils/apiResponse.js";
import { registerSchema, loginSchema } from "./auth.validation.js";

export const register = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const user = await registerUser(value);
  const token = generateToken(user);

  return successResponse(
    res,
    201,
    { user: user.toObject(), token },
    "User registered successfully",
  );
});

export const login = asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const user = await loginUser(value.email, value.password);
  const token = generateToken(user);

  return successResponse(
    res,
    200,
    { user: user.toObject(), token },
    "Login successful",
  );
});
