import {
  scrapeCSE,
  scrapeSEE,
  scrapeAllHome,
  scrapeKNU,
  scrapeSTRT,
  scrapeBIZS,
  scrapeDRML,
  scrapeSPRT,
  scrapeCOOP,
  scrapeTCHR,
} from "../utils/scrapeFunc.js";
import { noticeModel } from "../models/noticeModel.js";

/** 모든 스크랩퍼 실행 */
const initRunAllScrapers = async () => {
  const notices = [];
  notices.push(
    ...(await scrapeCSE({
      pageRanges: {
        공지사항: 514,
        학부인재모집: 12,
        취업정보: 98,
        세미나및행사: 28,
      },
    })),
    ...(await scrapeSEE({
      pageRanges: {
        공지사항: 242,
        세미나: 22,
        취업: 126,
        정보사랑방: 34,
      },
    })),
    ...(await scrapeAllHome({
      pageRanges: {
        ELE: { 공지사항: 289, 취업: 152, 정보광장: 86 },
        MUS: { 공지사항: 61, 자료실: 2 },
        KMU: { 공지사항: 136, 자료실: 1 },
        ART: { 공지사항: 59, 자료실: 3 },
        VCD: {
          학과공지: 14,
          학과행사: 2,
          공모전소식: 1,
          전시회소식: 1,
          구인구직: 1,
        },
        INTL: { 국제화프로그램: 312, InternationalStudents: 18 },
        CARE: { 진로취업: 62, 현장실습: 11 },
        SCHL: { 공지사항: 51 },
        EMB: { 공지사항: 3, 모집: 1 },
        KOR: {
          학사: 27,
          "장학/활동": 37,
          일반: 24,
          채용정보: 3,
        },
      },
    })),
    ...(await scrapeKNU({
      pageRanges: { 학사공지: 1, 공지사항: 1 },
    })),
    ...(await scrapeSTRT({
      pageRanges: { 센터공지사항: 1, 외부공지사항: 1 },
    })),
    ...(await scrapeBIZS({
      pageRanges: { 공지사항: 1 },
    })),
    ...(await scrapeDRML({
      pageRanges: {
        선발공지사항: 58,
        "공지사항(BTL)": 70,
        "공지사항(재정)": 82,
      },
    })),
    ...(await scrapeSPRT({
      pageRanges: { 공지사항: 1 },
    })),
    ...(await scrapeCOOP({
      pageRanges: { 공지사항: 11 },
    })),
    ...(await scrapeTCHR({
      pageRanges: { 공지사항: 70 },
    })),
  );

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
