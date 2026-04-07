import { asyncHandler } from "../../common/utils/asyncHandler.js";
import User from "../user/user.model.js";
import Job from "../job/job.model.js";
import Application from "../application/application.model.js";
import { successResponse } from "../../common/utils/apiResponse.js";

export const getStats = asyncHandler(async (req, res) => {
  const [users, jobs, applications] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
  ]);

  return successResponse(
    res,
    200,
    { users, jobs, applications },
    "Statistics retrieved successfully",
  );
});
