//Register a new company
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import Company from "../models/Company.js";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import jobApplication from "../models/jobApplication.js";

export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if the company already exists
    const companyExist = await Company.findOne({ email });
    if (companyExist) {
      return res.json({
        success: false,
        message: "Company already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: imageUpload.secure_url,
    });
    res.json({
      success: true,
      message: "Company registered successfully",
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Comapy Login
export const loginCompany = async (req, res) => {
  //company login
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });
    if (!company) {
      return res.json({ success: false, message: "Invalid email or password" });
    }
    if (await bcrypt.compare(password, company.password)) {
      res.json({
        success: true,
        message: "Company logged in successfully",
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company._id),
      });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Get company data
export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;
    res.json({ success: true, company });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Post a new job
export const postJob = async (req, res) => {
  //company id comes from auth middleware
  const companyId = req.company._id;
  const { title, description, location, salary, level, category } = req.body;
  try {
    if (!title || !description || !location || !salary || !level || !category) {
      return res.json({ success: false, message: "All fields are required" });
    }
    const newJob = new Job({
      title,
      description,
      location,
      category,
      level,
      salary,
      date: Date.now(),
      companyId,
    });
    await newJob.save();
    res.json({
      success: true,
      message: "Job posted successfully",
      job: newJob,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
  // res.json({
  //   success: true,
  //   message: "Job posted successfully",
  //   job: { title, description, location, salary, companyId },
  // });
};

//Get Comapny Job Applicants
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;
    const applications = await jobApplication
      .find({ companyId })
      .populate("userId", "name image resume")
      .populate("jobId", "title location category level salary")
      .exec();
    return res.json({ success: true, applications });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Get Comapny Posted Jobs
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });

    //(Todo) Adding No. of applicants info in data
    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await jobApplication.find({
          jobId: job._id,
        });
        return { ...job.toObject(), applicants: applicants.length };
      }),
    );
    res.status(200).json({
      success: true,
      jobsData: [...jobsData],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Change Job Applications Status
export const changeJobApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    console.log(id, status);
    const application = await jobApplication.findById(id);
    application.status = status;
    await application.save();
    res.status(200).json({
      success: true,
      message: "Job application status changed successfully",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Change job visisbility
export const changeJobVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;
    const job = await Job.findById(id);
    if (companyId.toString() == job.companyId.toString()) {
      job.visible = !job.visible;
    }
    await job.save();
    res.status(200).json({
      success: true,
      message: "Job visibility changed successfully",
      job,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
