import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routers/index.js";
import dbConnect from "./config/dbConnect.js";
import scrapeScheduler from "./schedulers/scrapeScheduler.js";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

await dbConnect();

scrapeScheduler.start();

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
