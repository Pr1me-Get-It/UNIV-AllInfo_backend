import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import * as cheerio from "cheerio";
import { findTwoBySource, findOneLatest, saveNotice } from "./dbService.js";

/**
 * notice object type 정의
 * @typedef {Object} Notice
 * @property {number} id
 * @property {string} source
 * @property {string} title
 * @property {string} date
 * @property {string} link
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "..", "config", "scrapeConfig.json");
const scrapeConfigs = JSON.parse(fs.readFileSync(configPath, "utf-8"));

/** 모든 스크랩퍼 실행 */
const runAllScrapers = async () => {
  await scrapeCSE();
};

/** DB 저장 */
const checkAndSaveNotice = async (notices, source) => {
  let countForId = Number((await findOneLatest())?.id) || 0;
  const newNotices = [];
  const latestNotices = await findTwoBySource(source);
  console.log("Latest notices from DB:", latestNotices); // testing
  for (const notice of notices) {
    if (
      latestNotices[0].title === notice.title ||
      latestNotices[1].title === notice.title
    ) {
      console.log(`Notice already exists: ${notice.title}`); // testing
      break;
    }
    newNotices.push(notice);
  }
  for (const notice of newNotices.reverse()) {
    notice.id = ++countForId;
    await saveNotice(notice);
    console.log(`Saved notice: ${notice.id} ${notice.title}`); // testing
  }
};

const scrapeCSE = async () => {
  const config = scrapeConfigs.find((c) => c.name === "CSE");

  for (const path of config.paths) {
    const notices = [];
    const url = config.baseUrl + path;
    const source = config.name + path;
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      $("tbody tr").each((index, element) => {
        /** @type {Notice} */
        const notice = {};
        notice.source = source;
        // 1번째(title)와 4번째(postedDate) td 요소 가져오기
        $("td", element).each((tdIndex, tdElement) => {
          if (tdIndex === 1) {
            /* 
            title 앞 장학이나 일반공지 등 문구 붙는데
            나중에 피드백 유무에 따라 지우든가 말든가 하겠습니다.
            */
            const title = $(tdElement).text().replace(/\s+/g, " ").trim();
            notice.title = title;
          }
          if (tdIndex === 4) {
            const date = $(tdElement).text().trim();
            notice.date = date;
          }
        });
        // link 2갠데 뒤에 것을 취함
        $("td a", element).each((linkIndex, linkElement) => {
          if (linkIndex === 1) {
            const link = $(linkElement).attr("href");
            notice.link = link;
          }
        });
        notices.push(notice);
      });
    } catch (error) {
      console.error(`Error scraping CSE at path ${path}:`, error);
    }
    await checkAndSaveNotice(notices, source);
  }
};

export default runAllScrapers;
