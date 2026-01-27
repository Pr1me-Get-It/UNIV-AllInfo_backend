import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import extractNoticesFromPath from "./extractNoticesFromPath.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "..", "config", "scrapeConfig.json");
const scrapeConfigs = JSON.parse(fs.readFileSync(configPath, "utf-8")).sources;

/**
 * CSE (컴퓨터학부) 스크래핑
 */
export const scrapeCSE = async () => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "CSE");
  for (const board of config.boards) {
    const { notices: extractedNotices } = await extractNoticesFromPath(
      config,
      board,
      {
        titleTdIndex: 1,
        dateTdIndex: 4,
        linkAnchorIndex: 1,
      },
    );
    if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
      notices.push(...extractedNotices);
    }
  }
  return notices;
};

/**
 * SEE (전자공학부) 스크래핑
 */
export const scrapeSEE = async () => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "SEE");

  for (const board of config.boards) {
    const { notices: extractedNotices } = await extractNoticesFromPath(
      config,
      board,
      {
        titleTdIndex: 1,
        dateTdIndex: 3,
        linkAnchorIndex: null,
      },
    );
    if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
      notices.push(...extractedNotices);
    }
  }
  return notices;
};

/**
 * Home 타입의 모든 학과 스크래핑 (ELE, MUS, KMU, ART, VCD)
 */
export const scrapeAllHome = async () => {
  const notices = [];
  for (const config of scrapeConfigs.filter((c) => c.type === "home")) {
    for (const board of config.boards) {
      const { notices: extractedNotices } = await extractNoticesFromPath(
        config,
        board,
        {
          titleTdIndex: 1,
          dateTdIndex: 4,
          linkAnchorIndex: null,
        },
      );
      if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
        notices.push(...extractedNotices);
      }
    }
  }
  return notices;
};
