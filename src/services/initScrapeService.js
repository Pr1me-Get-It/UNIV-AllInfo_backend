import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { findOneLatest, saveNotice } from "./noticeDbService.js";
import extractNoticesFromPath from "../utils/extractNoticesFromPath.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "..", "config", "scrapeConfig.json");
const scrapeConfigs = JSON.parse(fs.readFileSync(configPath, "utf-8"));

/** 모든 스크랩퍼 실행 */
const initRunAllScrapers = async () => {
  const notices = [];
  notices.push(...(await scrapeCSE()));
  notices.push(...(await scrapeSEE()));
  notices.push(...(await scrapeELE()));

  // date 기준 내림차순 정렬
  notices.sort((a, b) => new Date(b.date) - new Date(a.date));

  let countForId = Number((await findOneLatest())?.id) || 0;
  for (const notice of notices.reverse()) {
    notice.id = ++countForId;
    await saveNotice(notice);
    console.log(`Saved notice: ${notice.id} ${notice.title}`); // testing
  }
};

const scrapeCSE = async () => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.name === "CSE");
  for (const p of config.paths) {
    const { notices: extractedNotices, source } = await extractNoticesFromPath(
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
    const { notices: extractedNotices, source } = await extractNoticesFromPath(
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

const scrapeELE = async () => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.name === "ELE");

  for (const p of config.paths) {
    const { notices: extractedNotices, source } = await extractNoticesFromPath(
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
  return notices;
};

export default initRunAllScrapers;
