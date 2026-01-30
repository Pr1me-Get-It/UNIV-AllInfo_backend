import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./config/logger.js";
import router from "./routers/index.js";
import createMorganMiddleware from "./config/morgan.js";
import scrapeScheduler from "./schedulers/scrapeScheduler.js";
import initRunAllScrapers from "./services/initScrapeService.js";
import runAllScrapers from "./services/scrapeService.js";

dotenv.config();

// Ensure process uses Korea Standard Time
process.env.TZ = "Asia/Seoul";

console.log(`
  _    _ _   _ _______      __           _ _ _____        __      
 | |  | | \\ | |_   _\\ \\    / /     /\\   | | |_   _|      / _|     
 | |  | |  \\| | | |  \\ \\  / /     /  \\  | | | | |  _ __ | |_ ___  
 | |  | | . \` | | |   \\ \\/ /     / /\\ \\ | | | | | | '_ \\|  _/ _ \\ 
 | |__| | |\\  |_| |_   \\  /     / ____ \\| | |_| |_| | | | || (_) |
  \\____/|_| \\_|_____|   \\/     /_/    \\_\\_|_|_____|_| |_|_| \\___/ 
                                                                  
                                                                    
`);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: 우리 도메인 등록
app.use(cors());

app.use(createMorganMiddleware(logger));

const PORT = process.env.PORT;

// 개발 중 스케줄러 비활성화
try {
  scrapeScheduler.start();
  console.log(" ✔ Started - Scrape scheduler Status");
} catch (error) {
  console.error("Failed to start scrape scheduler:", error);
}

app.use("/", router);

app.listen(PORT, "0.0.0.0", () => {
  console.log(` ✔ Running - Server Status on PORT ${PORT}`);
  // initRunAllScrapers();
  // runAllScrapers();
});
