//Get all jobs

import Job from "../models/Job.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true }).populate({
      path: "companyId",
      select: "-password",
    });
    if (!jobs) {
      return res.json({ success: false, message: "No jobs found" });
    }
    res.json({ success: true, jobs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get a single job by ID
export const getJobById = async (req, res) => {
  const jobId = req.params.id;
  try {
    const job = await Job.findById(jobId).populate({
      path: "companyId",
      select: "-password",
    });
    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, job });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
