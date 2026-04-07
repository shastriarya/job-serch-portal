import express from "express";
import { addJob, fetchJobs, saveJob } from "./job.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("recruiter", "admin"), addJob);
router.get("/", fetchJobs);

router.post("/:id/save", protect, saveJob);
export default router;
