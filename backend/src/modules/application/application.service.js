import Application from "./application.model.js";
import User from "../user/user.model.js";
import Job from "../job/job.model.js";
import { scoreApplicationWithAI } from "../ai/ai.service.js";
import logger from "../../config/logger.js";

export const applyJobService = async (data) => {
  try {
    const [user, job] = await Promise.all([
      User.findById(data.user).select("name email skills resume"),
      Job.findById(data.job).select(
        "title company location description skills experienceLevel type category",
      ),
    ]);

    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    if (!job) {
      throw Object.assign(new Error("Job not found"), { statusCode: 404 });
    }

    const resumeTextParts = [
      `Candidate: ${user.name}`,
      `Email: ${user.email}`,
      `Skills: ${(user.skills || []).join(", ") || "Not provided"}`,
      user.resume ? `Resume file: ${user.resume}` : "",
    ].filter(Boolean);

    const jobDescription = [
      `${job.title} at ${job.company}`,
      `Location: ${job.location}`,
      `Type: ${job.type}`,
      `Experience: ${job.experienceLevel}`,
      `Category: ${job.category}`,
      `Required skills: ${(job.skills || []).join(", ")}`,
      job.description,
    ].join("\n");

    const ai = await scoreApplicationWithAI({
      resumeText: resumeTextParts.join("\n"),
      jobDescription,
    });

    const application = await Application.create({
      ...data,
      score: ai.score || 50,
      fullName: data.fullName || user.name,
      email: data.email || user.email,
    });

    logger.info(`Application created: ${application._id}`);
    return application;
  } catch (err) {
    logger.error("Error creating application:", err);
    throw err;
  }
};
