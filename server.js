import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./config/instrument.js";
import cors from "cors";
import "dotenv/config";
import * as Sentry from "@sentry/node";
import db from "./config/db.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import { clerkMiddleware } from "@clerk/express";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true }));
await db();
await connectCloudinary();

//Routes
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API Working..");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebhooks);

Sentry.setupExpressErrorHandler(app);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
