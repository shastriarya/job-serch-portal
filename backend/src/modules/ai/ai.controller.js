import { asyncHandler } from "../../common/utils/asyncHandler.js";
import Job from "../job/job.model.js";
import User from "../user/user.model.js";
import {
  extractResumeSkills,
  recommendJobsWithAI,
  scoreApplicationWithAI,
} from "./ai.service.js";
import { successResponse } from "../../common/utils/apiResponse.js";

export const aiHandler = asyncHandler(async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    throw Object.assign(
      new Error("resumeText and jobDescription are required"),
      {
        statusCode: 400,
      },
    );
  }

  const result = await scoreApplicationWithAI({ resumeText, jobDescription });
  return successResponse(res, 200, result, "AI match score generated");
});

export const recommendJobs = asyncHandler(async (req, res) => {
  let skills = Array.isArray(req.body.skills) ? req.body.skills : [];

  if (skills.length === 0 && req.user?.id) {
    const user = await User.findById(req.user.id).select("skills");
    skills = user?.skills || [];
  }

  if (skills.length === 0) {
    throw Object.assign(new Error("Skills array is required"), {
      statusCode: 400,
    });
  }

  const jobs = await Job.find({})
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .lean();

  const response = await recommendJobsWithAI({
    skills,
    jobs: jobs.map((job) => ({
      id: String(job._id),
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      skills: job.skills || [],
      category: job.category,
      type: job.type,
      experience_level: job.experienceLevel,
    })),
    topK: Number(req.body.topK) || 5,
  });

  const jobById = new Map(jobs.map((job) => [String(job._id), job]));
  const recommendations = (response.recommendations || [])
    .map((entry) => {
      const job = jobById.get(String(entry.job_id));
      if (!job) {
        return null;
      }

      return {
        ...job,
        recommendationScore: entry.score,
        matchedSkills: entry.matched_skills || [],
      };
    })
    .filter(Boolean);

  return successResponse(
    res,
    200,
    {
      skillsUsed: skills,
      recommendations,
      source: response.source || "ai-service",
    },
    "Job recommendations generated",
  );
});

export const parseResume = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    throw Object.assign(new Error("Resume text is required"), {
      statusCode: 400,
    });
  }

  const response = await extractResumeSkills(text);
  return successResponse(res, 200, response, "Resume skills extracted");
});
