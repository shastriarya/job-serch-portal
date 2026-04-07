import fs from "fs/promises";
import path from "path";

import { asyncHandler } from "../../common/utils/asyncHandler.js";
import {
  getUserProfile,
  updateUserProfile,
  updateResume,
} from "./user.service.js";
import { extractResumeSkills } from "../ai/ai.service.js";
import { successResponse } from "../../common/utils/apiResponse.js";

const getResumeTextForExtraction = async (req) => {
  const resumeText =
    typeof req.body.resumeText === "string" ? req.body.resumeText.trim() : "";

  if (resumeText) {
    return resumeText;
  }

  if (!req.file) {
    return "";
  }

  const ext = path.extname(req.file.originalname || "").toLowerCase();
  const textFileExtensions = new Set([".txt", ".md"]);
  const isTextFile =
    req.file.mimetype?.startsWith("text/") || textFileExtensions.has(ext);

  if (!isTextFile) {
    return "";
  }

  try {
    return await fs.readFile(req.file.path, "utf8");
  } catch {
    return "";
  }
};

export const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user.id);
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }
  return successResponse(res, 200, user, "Profile retrieved successfully");
});

export const updateProfile = asyncHandler(async (req, res) => {
  // Prevent password update through this endpoint
  if (req.body.password) {
    throw Object.assign(
      new Error("Password cannot be updated through this endpoint"),
      { statusCode: 400 },
    );
  }

  const user = await updateUserProfile(req.user.id, req.body);
  return successResponse(res, 200, user, "Profile updated successfully");
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw Object.assign(new Error("Resume file is required"), {
      statusCode: 400,
    });
  }

  const resumeText = await getResumeTextForExtraction(req);
  const aiResponse = resumeText
    ? await extractResumeSkills(resumeText)
    : { skills: [], source: "skipped" };
  const extractedSkills = Array.isArray(aiResponse.skills)
    ? aiResponse.skills.slice(0, 20)
    : [];

  const user = await updateResume(req.user.id, {
    resumePath: req.file.path,
    skills: extractedSkills,
  });

  return successResponse(
    res,
    200,
    {
      user,
      extractedSkills,
      extractionSource: aiResponse.source || "ai-service",
      extractionApplied: extractedSkills.length > 0,
    },
    "Resume uploaded successfully",
  );
});
