import winston from "winston";
import fs from "fs";
import path from "path";

// ensure logs directory exists (keep logs in project-root/logs)
const logsDir = path.join(process.cwd(), "logs");
try {
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
} catch (e) {
  // best-effort
  // eslint-disable-next-line no-console
  console.error("Failed to create logs directory", e);
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}] : ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsDir, "app.log") }),
  ],
});

// separate logger for scraper-specific logs
const scrapeLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}] : ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsDir, "scrape.log") }),
  ],
});

export { scrapeLogger };
export default logger;
