import Job from "./job.model.js";
import logger from "../../config/logger.js";

export const createJob = async (data) => {
  try {
    const job = await Job.create(data);
    return job;
  } catch (err) {
    logger.error("Error creating job:", err);
    throw err;
  }
};

export const getJobs = async (query) => {
  const {
    page = 1,
    limit = 10,
    keyword,
    location,
    category,
    skills,
    type,
    experienceLevel,
  } = query;

  let filter = {};

  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (category) {
    filter.category = category;
  }

  if (type) {
    filter.type = type;
  }

  if (experienceLevel) {
    filter.experienceLevel = experienceLevel;
  }

  if (skills) {
    const skillArray = Array.isArray(skills) ? skills : skills.split(",");
    filter.skills = { $in: skillArray };
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  try {
    const jobs = await Job.find(filter)
      .populate("createdBy", "name email")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .lean(); // Use lean for better performance

    const total = await Job.countDocuments(filter);

    return {
      data: jobs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    };
  } catch (err) {
    logger.error("Error fetching jobs:", err);
    throw err;
  }
};
