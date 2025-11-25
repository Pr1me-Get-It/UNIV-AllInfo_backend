import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routers/index.js";
import dbConnect from "./config/dbConnect.js";
import scrapeScheduler from "./schedulers/scrapeScheduler.js";

dotenv.config();

console.log(`
  _    _ _   _ _______      __           _ _ _____        __      
 | |  | | \\ | |_   _\\ \\    / /     /\\   | | |_   _|      / _|     
 | |  | |  \\| | | |  \\ \\  / /     /  \\  | | | | |  _ __ | |_ ___  
 | |  | | . \` | | |   \\ \\/ /     / /\\ \\ | | | | | | '_ \\|  _/ _ \\ 
 | |__| | |\\  |_| |_   \\  /     / ____ \\| | |_| |_| | | | || (_) |
  \\____/|_| \\_|_____|   \\/     /_/    \\_\\_|_|_____|_| |_|_| \\___/ 
                                                                  
                                                                    
`);

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

await dbConnect();

try {
  scrapeScheduler.start();
  console.log(" ✔ Started - Scrape scheduler Status");
} catch (error) {
  console.error("Failed to start scrape scheduler:", error);
}

app.use("/", router);

app.listen(PORT, () => {
  console.log(` ✔ Running - Server Status`);
});
