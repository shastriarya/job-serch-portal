import express from "express";
import { getProfile, updateProfile, uploadResume } from "./user.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = express.Router();

// Get profile
router.get("/profile", protect, getProfile);

// Update profile
router.put("/profile", protect, updateProfile);

// Upload resume
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

export default router;
