import nodeCron from "node-cron";
import runAllScrapers from "../services/scrapeService.js";
import { scrapeLogger as logger } from "../config/logger.js";
import { formatKST } from "../utils/time.js";

// 매일 2시부터 22시까지 4시간 간격으로 실행 (KST timezone)
const scrapeScheduler = nodeCron.schedule(
  "0 2-22/4 * * *",
  async () => {
    const now = formatKST(new Date());
    logger.info(`Scrape Scheduler started at ${now}`);
    try {
      await runAllScrapers();
      logger.info(`Scrape Scheduler finished at ${formatKST(new Date())}`);
    } catch (err) {
      logger.error(`Scrape run failed: ${err?.stack || err}`);
    }
  },
  {
    timezone: "Asia/Seoul",
  }
);

export default scrapeScheduler;
