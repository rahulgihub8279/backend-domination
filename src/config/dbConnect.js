import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const dbConnect = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}${DB_NAME}`);
    console.log(`db connected`);
  } catch (err) {
    console.log("mongo connection failed ", err.message);
    process.exit(1);
  }
};

export default dbConnect;
