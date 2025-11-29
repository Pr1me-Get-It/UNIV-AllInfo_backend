import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  findTwoBySource,
  findOneLatest,
  saveNotice,
} from "./noticeDbService.js";
import extractNoticesFromPath from "../utils/extractNoticesFromPath.js";
import { scrapeLogger as logger } from "../config/logger.js";
import { sendKeywordPush } from "./pushService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "..", "config", "scrapeConfig.json");
const scrapeConfigs = JSON.parse(fs.readFileSync(configPath, "utf-8"));

/** 모든 스크랩퍼 실행 */
const runAllScrapers = async () => {
  const newNotices = [];
  newNotices.push(...(await scrapeCSE()));
  newNotices.push(...(await scrapeSEE()));
  newNotices.push(...(await scrapeELE()));

  const tickets = await sendKeywordPush(newNotices);
  console.log("Push notification tickets:", tickets);
};

/** DB 저장 */
const checkAndSaveNotice = async (notices, source) => {
  let countForId = Number((await findOneLatest())?.id) || 0;
  const newNotices = [];
  const latestNotices = await findTwoBySource(source);
  logger.info(
    `Latest notices from DB for ${source.slice(0, 3)}: ${JSON.stringify(
      latestNotices.map((n) => n.title)
    )}`
  );
  for (const notice of notices) {
    // 공지가 내려가는 것 방지 2개씩 비교
    if (
      (latestNotices[0] && latestNotices[0].title === notice.title) ||
      (latestNotices[1] && latestNotices[1].title === notice.title)
    ) {
      logger.info(`Notice already exists: "${notice.title}"`);
      break;
    }
    newNotices.push(notice);
  }
  for (const notice of newNotices.reverse()) {
    notice.id = ++countForId;
    await saveNotice(notice);
    logger.info(`Saved notice: ${notice.id} "${notice.title}"`);
  }
  return newNotices;
};

const scrapeCSE = async () => {
  const newNotices = [];
  const config = scrapeConfigs.find((c) => c.name === "CSE");
  for (const p of config.paths) {
    const { notices, source } = await extractNoticesFromPath(config, p, {
      titleTdIndex: 1,
      dateTdIndex: 4,
      linkAnchorIndex: 1,
    });
    const newNoticesFromCheck = await checkAndSaveNotice(notices, source);
    newNotices.push(...newNoticesFromCheck);
  }

  return newNotices;
};

const scrapeSEE = async () => {
  const config = scrapeConfigs.find((c) => c.name === "SEE");
  const newNotices = [];
  for (const p of config.paths) {
    const { notices, source } = await extractNoticesFromPath(config, p, {
      titleTdIndex: 1,
      dateTdIndex: 3,
      linkAnchorIndex: null,
    });
    const newNoticesFromCheck = await checkAndSaveNotice(notices, source);
    newNotices.push(...newNoticesFromCheck);
  }

  return newNotices;
};

const scrapeELE = async () => {
  const config = scrapeConfigs.find((c) => c.name === "ELE");
  const newNotices = [];
  for (const p of config.paths) {
    const { notices, source } = await extractNoticesFromPath(config, p, {
      titleTdIndex: 1,
      dateTdIndex: 4,
      linkAnchorIndex: null,
    });
    const newNoticesFromCheck = await checkAndSaveNotice(notices, source);
    newNotices.push(...newNoticesFromCheck);
  }

  return newNotices;
};

export default runAllScrapers;
