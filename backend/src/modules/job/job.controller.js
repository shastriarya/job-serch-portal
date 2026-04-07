import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { createJob, getJobs } from "./job.service.js";
import Job from "./job.model.js";
import { successResponse } from "../../common/utils/apiResponse.js";
import logger from "../../config/logger.js";

export const addJob = asyncHandler(async (req, res) => {
  const requiredFields = [
    "title",
    "company",
    "location",
    "salary",
    "description",
  ];
  const missing = requiredFields.filter((field) => !req.body[field]);

  if (missing.length > 0) {
    throw Object.assign(
      new Error(`Missing required fields: ${missing.join(", ")}`),
      { statusCode: 400 },
    );
  }

  const job = await createJob({
    ...req.body,
    createdBy: req.user.id,
  });

  logger.info(`Job created: ${job._id} by ${req.user.id}`);
  return successResponse(res, 201, job, "Job created successfully");
});

export const fetchJobs = asyncHandler(async (req, res) => {
  const jobs = await getJobs(req.query);
  return successResponse(res, 200, jobs, "Jobs retrieved successfully");
});

export const saveJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw Object.assign(new Error("Job not found"), { statusCode: 404 });
  }

  if (!job.savedBy.includes(req.user.id)) {
    job.savedBy.push(req.user.id);
    await job.save();
  }

  return successResponse(
    res,
    200,
    { message: "Job saved successfully" },
    "Job saved",
  );
});
