import express from "express";
import { getStats } from "./admin.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getStats);

export default router;
