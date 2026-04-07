import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    type: {
      type: String,
      enum: ["application", "job", "message", "system"],
      default: "system",
    },
    read: { type: Boolean, default: false },
    relatedId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true },
);

// Index for efficient queries
schema.index({ user: 1, read: 1, createdAt: -1 });

export default mongoose.model("Notification", schema);
