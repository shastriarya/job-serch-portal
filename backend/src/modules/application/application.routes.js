import express from "express";
import { applyJob } from "./application.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { getApplicantsByJob, updateStatus } from "./application.controller.js";
import { authorize } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, applyJob);

// Recruiter dashboard
router.get(
  "/job/:jobId",
  protect,
  authorize("recruiter", "admin"),
  getApplicantsByJob
);

router.put(
  "/:id/status",
  protect,
  authorize("recruiter", "admin"),
  updateStatus
);
export default router;
