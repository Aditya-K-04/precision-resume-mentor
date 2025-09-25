import express from "express";
import { addResume, getResumes } from "../controllers/resumeController.js";

const router = express.Router();

// POST: Save new resume
router.post("/", addResume);

// GET: Fetch all resumes
router.get("/", getResumes);

export default router;
