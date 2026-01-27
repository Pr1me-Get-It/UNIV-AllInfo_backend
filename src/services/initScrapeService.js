import { scrapeCSE, scrapeSEE, scrapeAllHome } from "../utils/scrapeFunc.js";
import { noticeModel } from "../models/noticeModel.js";

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

export default initRunAllScrapers;
