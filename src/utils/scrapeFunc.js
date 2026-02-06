import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import extractNoticesFromPath from "./extractNoticesFromPath.js";
import mmddToyyyymmdd from "./mmddToyyyymmdd.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "..", "config", "scrapeConfig.json");
const scrapeConfigs = JSON.parse(fs.readFileSync(configPath, "utf-8")).sources;

/**
 * 이거 왜 안 됨. main태그 이하를 안 가져오는데.\
 * 일단 사용 금지
 */
const scrapeLMS = async () => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "LMS");
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
 * KNU (경북대학교) 스크래핑
 */
const scrapeKNU = async ({ pageRanges = {} }) => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "NEWS");
  for (const board of config.boards) {
    for (let page = 1; page <= (pageRanges[board.name] || 1); page++) {
      const { notices: extractedNotices } = await extractNoticesFromPath(
        config,
        board,
        {
          titleTdIndex: 1,
          dateTdIndex: 4,
          linkAnchorIndex: null,
          pageParamName: "&pageIndex=",
          page: page,
        },
      );
      if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
        // KNU 공지사항 링크 보정
        for (const notice of extractedNotices) {
          let adjustedLink = null;
          if (board.name === "공지사항") {
            // TODO: 정규식 개선 필요
            adjustedLink = notice.link
              .replace(/(btin\.bbs_cde=)[^&]*/g, (_, g1) => g1 + "1")
              .replace(/(btin\.page=)[^&]*/g, (_, g1) => g1 + "1");
          } else if (board.name === "학사공지") {
            adjustedLink = `https://www.knu.ac.kr/wbbs/wbbs/bbs/btin/stdViewBtin.action?bltn_no=${notice.link.match(/(\d+)(?=[^0-9]*$)/)[1]}&menu_idx=42&bbs_cde=stu_812`;
          }
          notice.link = adjustedLink;
        }
        notices.push(...extractedNotices);
      }
      console.log(`KNU Scraper - ${board.name} Page ${page} Done`);
    }
  }
  return notices;
};

/**
 * STRT (창업교육센터) 스크래핑
 */
const scrapeSTRT = async ({ pageRanges = {} }) => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "STRT");
  for (const board of config.boards) {
    for (let page = 1; page <= (pageRanges[board.name] || 1); page++) {
      const { notices: extractedNotices } = await extractNoticesFromPath(
        config,
        board,
        {
          titleTdIndex: 1,
          dateTdIndex: 4,
          linkAnchorIndex: 0,
          pageParamName: "&page=",
          page: page,
        },
      );
      if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
        notices.push(...extractedNotices);
      }
      console.log(`STRT Scraper - ${board.name} Page ${page} Done`);
    }
  }
  return notices;
};

/**
 * BIZS (창업지원단) 스크래핑
 * postedAt 연도 정보 없음
 */
const scrapeBIZS = async ({ pageRanges = {} }) => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "BIZS");
  for (const board of config.boards) {
    for (let page = 1; page <= (pageRanges[board.name] || 1); page++) {
      const { notices: extractedNotices } = await extractNoticesFromPath(
        config,
        board,
        {
          titleTdIndex: 2,
          dateTdIndex: 5,
          linkAnchorIndex: null,
          pageParamName: "&page=",
          page: page,
        },
      );
      if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
        const fixedNotices = extractedNotices.filter(
          (notice) => notice.isFixed,
        );
        const unfixedNotices = extractedNotices.filter(
          (notice) => !notice.isFixed,
        );
        const itemsF = await mmddToyyyymmdd(fixedNotices);
        for (let i = 0; i < itemsF.length; i++) {
          fixedNotices[i].postedAt = itemsF[i].postedAtISO;
        }
        const itemsUnf = await mmddToyyyymmdd(unfixedNotices);
        for (let i = 0; i < itemsUnf.length; i++) {
          unfixedNotices[i].postedAt = itemsUnf[i].postedAtISO;
        }
        notices.push(...fixedNotices, ...unfixedNotices);
      }
      console.log(`BIZS Scraper - ${board.name} Page ${page} Done`);
    }
  }
  return notices;
};

/**
 * DRML (생활관) 스크래핑
 * postedAt 연도 정보 없음
 * 보정값도 정확도가 현저히 떨어짐
 */
const scrapeDRML = async ({ pageRanges = {} }) => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "DRML");
  for (const board of config.boards) {
    for (let page = 1; page <= (pageRanges[board.name] || 1); page++) {
      const { notices: extractedNotices } = await extractNoticesFromPath(
        config,
        board,
        {
          titleTdIndex: 1,
          dateTdIndex: 4,
          linkAnchorIndex: null,
          pageParamName: "?page=",
          page: page,
        },
      );
      if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
        const fixedNotices = extractedNotices.filter(
          (notice) => notice.isFixed,
        );
        const unfixedNotices = extractedNotices.filter(
          (notice) => !notice.isFixed,
        );
        const itemsF = await mmddToyyyymmdd(fixedNotices);
        for (let i = 0; i < itemsF.length; i++) {
          fixedNotices[i].postedAt = itemsF[i].postedAtISO;
        }
        const itemsUnf = await mmddToyyyymmdd(unfixedNotices);
        for (let i = 0; i < itemsUnf.length; i++) {
          unfixedNotices[i].postedAt = itemsUnf[i].postedAtISO;
        }
        notices.push(...fixedNotices, ...unfixedNotices);
      }
      console.log(`DRML Scraper - ${board.name} Page ${page} Done`);
    }
  }
  return notices;
};

const scrapeSPRT = async () => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "SPRT");
  const { notices: extractedNotices } = await extractNoticesFromPath(
    config,
    config.boards[0],
    {
      titleTdIndex: 1,
      dateTdIndex: 3,
      linkAnchorIndex: null,
      pageParamName: null,
      page: null,
    },
  );
  if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
    notices.push(...extractedNotices);
  }
  return notices;
};

const scrapeALUM = async ({ pageRanges = {} }) => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "ALUM");
  for (let page = 1; page <= (pageRanges[config.boards[0].name] || 1); page++) {
    const { notices: extractedNotices } = await extractNoticesFromPath(
      config,
      config.boards[0],
      {
        titleTdIndex: 1,
        dateTdIndex: 4,
        linkAnchorIndex: null,
        pageParamName: "&pageIndex=",
        page: page,
      },
    );
    if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
      notices.push(...extractedNotices);
    }
    console.log(`ALUM Scraper - Page ${page} Done`);
  }
  return notices;
};

const scrapeCOOP = async ({ pageRanges = {} }) => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "COOP");
  for (let page = 1; page <= (pageRanges[config.boards[0].name] || 1); page++) {
    const { notices: extractedNotices } = await extractNoticesFromPath(
      config,
      config.boards[0],
      {
        titleTdIndex: 1,
        dateTdIndex: 3,
        linkAnchorIndex: null,
        pageParamName: "&page_num=",
        page: page,
      },
    );
    if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
      notices.push(...extractedNotices);
    }
    console.log(`COOP Scraper - Page ${page} Done`);
  }
  return notices;
};

const scrapeTCHR = async ({ pageRanges = {} }) => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "TCHR");
  for (let page = 1; page <= (pageRanges[config.boards[0].name] || 1); page++) {
    const { notices: extractedNotices } = await extractNoticesFromPath(
      config,
      config.boards[0],
      {
        titleTdIndex: 1,
        dateTdIndex: 4,
        linkAnchorIndex: null,
        pageParamName: "?pgNum=",
        page: page,
      },
    );
    if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
      notices.push(...extractedNotices);
    }
    console.log(`TCHR Scraper - Page ${page} Done`);
  }
  return notices;
};

/**
 * Home 타입의 모든 학과 스크래핑 (ELE, MUS, KMU, ART, VCD)
 */
const scrapeAllHome = async ({ pageRanges = {} }) => {
  const notices = [];
  // c.type === "home"
  for (const config of scrapeConfigs.filter((c) => c.type === "home")) {
    for (const board of config.boards) {
      for (
        let page = 1;
        page <= (pageRanges[config.code]?.[board.name] || 1);
        page++
      ) {
        const { notices: extractedNotices } = await extractNoticesFromPath(
          config,
          board,
          {
            titleTdIndex:
              config.code === "CARE" && board.name === "진로취업" ? 2 : 1,
            dateTdIndex:
              config.code === "CARE" && board.name === "진로취업" ? 5 : 4,
            linkAnchorIndex: null,
            pageParamName: "&startPage=",
            page: (page - 1) * 10 || 0,
          },
        );
        if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
          notices.push(...extractedNotices);
        }
      }
    }
  }
  return notices;
};

/**
 * CSE (컴퓨터학부) 스크래핑
 */
const scrapeCSE = async ({ pageRanges = {} }) => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "CSE");
  for (const board of config.boards) {
    for (let page = 1; page <= (pageRanges[board.name] || 1); page++) {
      const { notices: extractedNotices } = await extractNoticesFromPath(
        config,
        board,
        {
          titleTdIndex: 1,
          dateTdIndex: 4,
          linkAnchorIndex: 1,
          pageParamName: "&page=",
          page: page,
        },
      );
      if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
        notices.push(...extractedNotices);
      }
    }
  }
  return notices;
};

/**
 * SEE (전자공학부) 스크래핑
 */
const scrapeSEE = async ({ pageRanges = {} }) => {
  const notices = [];
  const config = scrapeConfigs.find((c) => c.code === "SEE");

  for (const board of config.boards) {
    for (let page = 1; page <= (pageRanges[board.name] || 1); page++) {
      const { notices: extractedNotices } = await extractNoticesFromPath(
        config,
        board,
        {
          titleTdIndex: 1,
          dateTdIndex: 3,
          linkAnchorIndex: null,
          pageParamName: "?page=",
          page: page,
        },
      );
      if (Array.isArray(extractedNotices) && extractedNotices.length > 0) {
        notices.push(...extractedNotices);
      }
    }
  }
  return notices;
};

export {
  scrapeKNU,
  scrapeSTRT,
  scrapeBIZS,
  scrapeDRML,
  scrapeSPRT,
  scrapeALUM,
  scrapeCSE,
  scrapeSEE,
  scrapeAllHome,
  scrapeCOOP,
  scrapeTCHR,
};
