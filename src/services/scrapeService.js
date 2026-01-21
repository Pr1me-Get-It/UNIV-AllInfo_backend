import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import extractNoticesFromPath from "../utils/extractNoticesFromPath.js";
import { scrapeLogger as logger } from "../config/logger.js";
import { sendKeywordPush } from "./pushService.js";
import { noticeModel } from "../models/noticeModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "..", "config", "scrapeConfig.json");
const scrapeConfigs = JSON.parse(fs.readFileSync(configPath, "utf-8"));

/** 모든 스크랩퍼 실행 */
const runAllScrapers = async () => {
  const newNotices = [];
  newNotices.push(...(await scrapeCSE()));
  newNotices.push(...(await scrapeSEE()));
  newNotices.push(...(await scrapeAllHome()));

  // 셔플 (같은 소스 공지들 뭉쳐있는 문제 해결)
  // 일단 해보고 나중에 문제가 짙으면 주석 해제
  // newNotices.sort(() => Math.random() - 0.5);

  // const tickets = await sendKeywordPush(newNotices);
  // console.log("Push notification tickets:", tickets);
};

const saveNoticeIfNew = async (notices) => {
  const newNotices = [];
  let saved = 0;
  let duplicates = 0;
  let errors = 0;
  for (const notice of notices) {
    try {
      await noticeModel.create(notice);
      logger.info(`Saved notice:  ${notice.title}`);
      newNotices.push(notice);
      saved++;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        logger.info(`Duplicate notice, skipped: ${notice.title}`);
        duplicates++;
        continue;
      }
      logger.error("Error saving notice:", error);
      errors++;
    }
  }
  logger.info(
    `Summary: ${saved} saved, ${duplicates} duplicates, ${errors} errors.`,
  );
  return newNotices;
};

const scrapeAllHome = async () => {
  const newNotices = [];
  for (const config of scrapeConfigs.filter((c) => c.isHome)) {
    for (const p of config.paths) {
      const { notices: extractedNotices } = await extractNoticesFromPath(
        config,
        p,
        {
          titleTdIndex: 1,
          dateTdIndex: 4,
          linkAnchorIndex: null,
        },
      );
      if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
        const savedNotices = await saveNoticeIfNew(extractedNotices);
        newNotices.push(...savedNotices);
      }
    }
  }
  return newNotices;
};

const scrapeCSE = async () => {
  const cseConfig = scrapeConfigs.find((c) => c.name === "CSE");
  const newNotices = [];
  for (const p of cseConfig.paths) {
    const { notices: extractedNotices } = await extractNoticesFromPath(
      cseConfig,
      p,
      {
        titleTdIndex: 1,
        dateTdIndex: 4,
        linkAnchorIndex: 1,
      },
    );
    if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
      const savedNotices = await saveNoticeIfNew(extractedNotices);
      newNotices.push(...savedNotices);
    }
  }
  return newNotices;
};

const scrapeSEE = async () => {
  const seeConfig = scrapeConfigs.find((c) => c.name === "SEE");
  const newNotices = [];
  for (const p of seeConfig.paths) {
    const { notices: extractedNotices } = await extractNoticesFromPath(
      seeConfig,
      p,
      {
        titleTdIndex: 1,
        dateTdIndex: 3,
        linkAnchorIndex: null,
      },
    );
    if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
      const savedNotices = await saveNoticeIfNew(extractedNotices);
      newNotices.push(...savedNotices);
    }
  }
  return newNotices;
};

export default runAllScrapers;
