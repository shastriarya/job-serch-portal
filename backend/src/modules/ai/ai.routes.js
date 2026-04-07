import express from "express";
import { aiHandler, parseResume, recommendJobs } from "./ai.controller.js";
import { optionalProtect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", aiHandler);
router.post("/recommend", optionalProtect, recommendJobs);
router.post("/parse-resume", parseResume);

export default router;
