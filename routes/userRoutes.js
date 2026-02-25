import express from "express";
import {
  applyForJob,
  getUserData,
  getAllUsersList,
  getUserJobApplications,
  updateUserResume,
} from "../controllers/userController.js";
import upload from "../config/multer.js";

const router = express.Router();

// Get user data
router.get("/user", getUserData);

//Get all users list

router.get("/user-list", getAllUsersList);

//Apply for a job
router.post("/apply", applyForJob);

//Get aaplied jobs data
router.get("/applications", getUserJobApplications);

//Update user profile
router.post("/update-resume", upload.single("resume"), updateUserResume);

export default router;
