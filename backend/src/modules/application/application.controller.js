import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { applyJobService } from "./application.service.js";
import Application from "./application.model.js";
import { successResponse } from "../../common/utils/apiResponse.js";
import logger from "../../config/logger.js";

export const applyJob = asyncHandler(async (req, res) => {
  const jobId = req.body.job || req.body.jobId;

  if (!jobId) {
    throw Object.assign(new Error("Job ID is required"), { statusCode: 400 });
  }

  // Check if already applied
  const existing = await Application.findOne({
    user: req.user.id,
    job: jobId,
  });
  if (existing) {
    throw Object.assign(new Error("You have already applied for this job"), {
      statusCode: 400,
    });
  }

  const application = await applyJobService({
    user: req.user.id,
    job: jobId,
    fullName: req.body.fullName,
    email: req.body.email,
    resumeUrl: req.body.resumeUrl,
    note: req.body.note,
  });

  logger.info(`User ${req.user.id} applied for job ${jobId}`);
  return successResponse(
    res,
    201,
    { application },
    "Application submitted successfully",
  );
});

export const getApplicantsByJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const applications = await Application.find({ job: jobId })
    .populate("user", "name email resume")
    .sort({ score: -1 });

  return successResponse(
    res,
    200,
    applications,
    "Applicants retrieved successfully",
  );
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["applied", "shortlisted", "rejected", "selected"];
  if (!validStatuses.includes(status)) {
    throw Object.assign(
      new Error(`Status must be one of: ${validStatuses.join(", ")}`),
      { statusCode: 400 },
    );
  }

  const app = await Application.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );

  if (!app) {
    throw Object.assign(new Error("Application not found"), {
      statusCode: 404,
    });
  }

  logger.info(`Application ${id} status updated to ${status}`);
  return successResponse(res, 200, app, "Status updated successfully");
});
