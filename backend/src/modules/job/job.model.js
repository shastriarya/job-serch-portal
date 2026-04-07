import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    skills: [String],
    description: {
      type: String,
      required: [true, "Description is required"],
    },

    category: {
      type: String,
      enum: ["private", "government", "internship", "overseas"],
      default: "private",
    },

    type: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      default: "full-time",
    },

    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      default: "fresher",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

// Indexes for better performance
schema.index({ title: "text", description: "text" });
schema.index({ createdBy: 1 });
schema.index({ category: 1, type: 1 });
schema.index({ createdAt: -1 });

export default mongoose.model("Job", schema);
