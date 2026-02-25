import express from "express";
import {
  changeJobApplicationStatus,
  changeJobVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
} from "../controllers/companyController.js";
import upload from "../config/multer.js";
import protectCompany from "../middlewares/authMiddleware.js";

const router = express.Router();

//Register a company
router.post("/register", upload.single("image"), registerCompany);

//Company Login
router.post("/login", loginCompany);

//Get company data
router.get("/company", protectCompany, getCompanyData);

//Post a job
router.post("/post-job", protectCompany, postJob);

//Get applicants data of company
router.get("/applicants", protectCompany, getCompanyJobApplicants);

//Get company job list
router.get("/list-jobs", protectCompany, getCompanyPostedJobs);

//Change job application status
router.put("/change-status", protectCompany, changeJobApplicationStatus);

//Change job visibility
router.post("/change-visibility", protectCompany, changeJobVisibility);

export default router;
