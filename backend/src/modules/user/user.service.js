import User from "./user.model.js";
import logger from "../../config/logger.js";

export const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }
    return user;
  } catch (err) {
    logger.error("Error getting user profile:", err);
    throw err;
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const allowedUpdates = [
      "name",
      "email",
      "skills",
      "title",
      "location",
      "phone",
      "bio",
      "experience",
      "portfolioUrl",
      "linkedinUrl",
      "preferredRole",
      "preferredLocation",
      "workMode",
      "resumeUrl",
      "profileCompleted",
    ];
    const updates = Object.keys(data).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = key === "email" && typeof data[key] === "string"
          ? data[key].toLowerCase().trim()
          : data[key];
      }
      return acc;
    }, {});

    if (Array.isArray(updates.skills)) {
      updates.skills = updates.skills.filter(Boolean);
    }

    if (!Object.prototype.hasOwnProperty.call(updates, "profileCompleted")) {
      const completionSignals = [
        updates.title,
        updates.location,
        updates.bio,
        updates.resumeUrl,
        Array.isArray(updates.skills) ? updates.skills.length : 0,
      ];
      updates.profileCompleted = completionSignals.some(Boolean);
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    logger.info(`User ${userId} profile updated`);
    return user;
  } catch (err) {
    logger.error("Error updating user profile:", err);
    throw err;
  }
};

export const updateResume = async (userId, { resumePath, skills }) => {
  try {
    const updates = {
      resume: resumePath,
      resumeUrl: resumePath,
      profileCompleted: true,
    };

    if (Array.isArray(skills) && skills.length > 0) {
      updates.skills = skills;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    logger.info(`Resume updated for user ${userId}`);
    return user;
  } catch (err) {
    logger.error("Error updating resume:", err);
    throw err;
  }
};
