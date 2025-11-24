import nodeCron from "node-cron";
import runAllScrapers from "../services/scrapeService.js";

// 매일 2시부터 22시까지 4시간 간격으로 실행
const scrapeScheduler = nodeCron.schedule("0 2-22/4 * * *", async () => {
  console.log("Scrape Scheduler started at", new Date().toISOString());
  await runAllScrapers();
});

export default scrapeScheduler;
