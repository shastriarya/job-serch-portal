import axios from "axios";

import { config } from "../../config/env.js";
import logger from "../../config/logger.js";

const getAiEndpoint = (path = "") => {
  const baseUrl = config.AI_URL.replace(/\/+$/, "");
  const normalizedPath = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `${baseUrl}${normalizedPath}`;
};

const postToAIService = async (path, payload, fallbackData, action) => {
  try {
    const response = await axios.post(getAiEndpoint(path), payload, {
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    logger.warn(
      `AI ${action} failed: ${error.message}. Using fallback response.`,
    );
    return fallbackData;
  }
};

export const scoreApplicationWithAI = async ({
  resumeText,
  jobDescription,
}) => {
  return postToAIService(
    "",
    {
      resume_text: resumeText,
      job_description: jobDescription,
    },
    {
      score: 50,
      source: "fallback",
      message: "Default score - AI service unavailable",
    },
    "application scoring",
  );
};

export const recommendJobsWithAI = async ({ skills, jobs, topK = 5 }) => {
  return postToAIService(
    "/recommend",
    {
      skills,
      jobs,
      top_k: topK,
    },
    {
      recommendations: jobs
        .slice(0, topK)
        .map((job, index) => ({
          job_id: job.id,
          score: Math.max(40, 80 - index * 5),
          matched_skills: skills.filter((skill) =>
            job.skills.some(
              (jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase(),
            ),
          ),
        })),
      source: "fallback",
    },
    "job recommendation",
  );
};

export const extractResumeSkills = async (text) => {
  return postToAIService(
    "/parse",
    { text },
    {
      skills: Array.from(
        new Set(
          text
            .split(/[^a-zA-Z0-9+#.]+/)
            .map((token) => token.trim())
            .filter((token) => token.length > 2),
        ),
      ).slice(0, 20),
      source: "fallback",
    },
    "resume parsing",
  );
};
