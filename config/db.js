import mongoose from "mongoose";

//Function to connect mongodb database
const connectDB = async () => {
  //   try {
  //     const conn = await mongoose.connect(process.env.MONGO_URI, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //     });
  //     console.log(`MongoDB Connected: ${conn.connection.host}`);
  //   } catch (error) {
  //     console.error(`Error: ${error.message}`);
  //     process.exit(1);
  //   }
  mongoose.connection.on("connected", () => {
    console.log("connected to database");
  });
  await mongoose.connect(`${process.env.MONGO_URI}/job-portal-project`);
};

export default connectDB;
