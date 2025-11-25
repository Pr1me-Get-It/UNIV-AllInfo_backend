import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const COLLECTION = "Notice";
const MONGODB_URI = process.env.MONGODB_URI + COLLECTION;

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(" ✔ Active  - DB Connection");
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
