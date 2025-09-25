import express from "express";
import { testController } from "../controllers/testController.js";

const router = express.Router();

// Test route
router.get("/", testController);

export default router;
