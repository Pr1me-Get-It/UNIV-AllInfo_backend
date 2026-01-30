import { scrapeLogger as logger } from "../config/logger.js";
import { sendKeywordPush } from "./pushService.js";
import { noticeModel } from "../models/noticeModel.js";
import { scrapeCSE, scrapeSEE, scrapeAllHome } from "../utils/scrapeFunc.js";

/** 모든 스크랩퍼 실행 */
const runAllScrapers = async () => {
  const newNotices = [];
  newNotices.push(
    ...(await scrapeAndSaveNotices(
      await scrapeCSE({
        pageRanges: {
          공지사항: 1,
          학부인재모집: 1,
          취업정보: 1,
          세미나및행사: 1,
        },
      }),
    )),
  );
  newNotices.push(
    ...(await scrapeAndSaveNotices(
      await scrapeSEE({
        pageRanges: { 공지사항: 1, 세미나: 1, 취업: 1, 정보사랑방: 1 },
      }),
    )),
  );
  newNotices.push(
    ...(await scrapeAndSaveNotices(
      await scrapeAllHome({
        pageRanges: {
          ELE: { 공지사항: 1, 취업: 1, 정보광장: 1 },
          MUS: { 공지사항: 1, 자료실: 1 },
          KMU: { 공지사항: 1, 자료실: 1 },
          ART: { 공지사항: 1, 자료실: 1 },
          VCD: {
            학과공지: 1,
            학과행사: 1,
            공모전소식: 1,
            전시회소식: 1,
            구인구직: 1,
          },
        },
      }),
    )),
  );
  newNotices.push(
    ...(await scrapeAndSaveNotices(
      await scrapeKNU({ pageRanges: { 학사공지: 1, 공지사항: 1 } }),
    )),
  );
  newNotices.push(
    ...(await scrapeAndSaveNotices(
      await scrapeSTRT({ pageRanges: { 센터공지사항: 1, 외부공지사항: 1 } }),
    )),
  );
  newNotices.push(
    ...(await scrapeAndSaveNotices(
      await scrapeBIZS({ pageRanges: { 공지사항: 1 } }),
    )),
  );

  // 셔플 (같은 소스 공지들 뭉쳐있는 문제 해결)
  // 일단 해보고 나중에 문제가 짙으면 주석 해제
  // newNotices.sort(() => Math.random() - 0.5);

  // const tickets = await sendKeywordPush(newNotices);
  // console.log("Push notification tickets:", tickets);
};

const scrapeAndSaveNotices = async (notices) => {
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

export default runAllScrapers;
