import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { findOneLatest, saveNotice } from "./noticeDbService.js";
import extractNoticesFromPath from "../utils/extractNoticesFromPath.js";
import { noticeModel } from "../models/noticeModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "..", "config", "scrapeConfig.json");
const scrapeConfigs = JSON.parse(fs.readFileSync(configPath, "utf-8"));

/** 모든 스크랩퍼 실행 */
const initRunAllScrapers = async () => {
  const notices = [];
  notices.push(...(await scrapeCSE()));
  notices.push(...(await scrapeSEE()));

  notices.push(...(await scrapeAllHome()));

  // 셔플 (같은 소스 공지들 뭉쳐있는 문제 해결)
  notices.sort(() => Math.random() - 0.5);

  // date 기준 내림차순 정렬
  notices.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

  for (const notice of notices.reverse()) {
    try {
      await noticeModel.create(notice);
      //test
      console.log(`Saved notice:  ${notice.title}`);
    } catch (error) {
      console.error("Error saving notice:", error);
    }
  }
};

const scrapeAllHome = async () => {
  const notices = [];
  for (const config of scrapeConfigs.filter((c) => c.isHome)) {
    for (const p of config.paths) {
      const { notices: extractedNotices } = await extractNoticesFromPath(
        config,
        p,
        {
          titleTdIndex: 1,
          dateTdIndex: 4,
          linkAnchorIndex: null,
        }
      );
      if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
        notices.push(...extractedNotices);
      }
    }
  }
  return notices;
};

const scrapeCSE = async () => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.name === "CSE");
  for (const p of config.paths) {
    const { notices: extractedNotices } = await extractNoticesFromPath(
      config,
      p,
      {
        titleTdIndex: 1,
        dateTdIndex: 4,
        linkAnchorIndex: 1,
      }
    );
    if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
      notices.push(...extractedNotices);
    }
  }
  return notices;
};

const scrapeSEE = async () => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.name === "SEE");

  for (const p of config.paths) {
    const { notices: extractedNotices } = await extractNoticesFromPath(
      config,
      p,
      {
        titleTdIndex: 1,
        dateTdIndex: 3,
        linkAnchorIndex: null,
      }
    );
    if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
      notices.push(...extractedNotices);
    }
  }
  return notices;
};

export default initRunAllScrapers;
