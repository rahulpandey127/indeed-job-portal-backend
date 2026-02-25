import epress from "express";
import { getAllJobs, getJobById } from "../controllers/jobController.js";

const router = epress.Router();

// Route to get all jobs
router.get("/", getAllJobs);

// Route to get a single job by ID
router.get("/:id", getJobById);

export default router;
