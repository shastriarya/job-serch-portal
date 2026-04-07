export class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export const successResponse = (
  res,
  statusCode = 200,
  data = null,
  message = "Success",
) => {
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, data, message));
};

export const errorResponse = (
  res,
  statusCode = 500,
  message = "Server Error",
  data = null,
) => {
  return res.status(statusCode).json({
    statusCode,
    data,
    message,
    success: false,
  });
};
