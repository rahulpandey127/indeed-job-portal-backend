import Job from "../models/Job.js";
import jobApplication from "../models/jobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
// Get user data
export const getUserData = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get all users list
export const getAllUsersList = async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (!allUsers) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, allUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    console.log(userId, jobId);
    // Check if already applied
    const isAlreadyApplied = await jobApplication.findOne({
      userId,
      jobId,
    });

    if (isAlreadyApplied) {
      return res.json({ success: false, message: "Already Applied" });
    }

    // Check if job exists
    const jobData = await Job.findById(jobId);

    if (!jobData) {
      return res.json({ success: false, message: "Job Not Found" });
    }

    // Create new application
    const appliedJob = new jobApplication({
      userId,
      companyId: jobData.companyId,
      jobId,
      date: Date.now(),
    });
    await appliedJob.save();

    res.json({
      success: true,
      message: "Applied Successfully",
      data: appliedJob,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
//Get user applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const application = await jobApplication
      .find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec();

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "No Job Applications Found" });
    }
    return res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update user profile

export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const userData = await User.findById(userId);

    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
      userData.resume = resumeUpload.secure_url;
    }
    await userData.save();
    return res.status(200).json({
      success: true,
      message: "Resume Updated Successfully",
      resume: userData.resume,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
