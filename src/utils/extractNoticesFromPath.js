import axios from "axios";
import * as cheerio from "cheerio";
import Notice from "../models/noticeModel.js";

const extractNoticesFromPath = async (config, board, options = {}) => {
  const { titleTdIndex = 1, dateTdIndex = 4, linkAnchorIndex = 1 } = options;
  const notices = [];
  const url = config.website + board.path;
  const source = config.name + board.name;
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    $("tbody tr").each((index, element) => {
      const notice = new Notice();
      notice.source = source;

      // 첫번째 td의 number 여부를 판별하여 fixed notice는 건너뛰기
      const firstTdText = $("td", element).first().text().trim();
      if (isNaN(Number(firstTdText)) || firstTdText === "") {
        return;
      }

      $("td", element).each((tdIndex, tdElement) => {
        if (tdIndex === titleTdIndex) {
          // em태그의 '새글' 등 포함되는 이슈 방지
          $(tdElement).find("em").remove();
          const title = $(tdElement).text().replace(/\s+/g, " ").trim();
          notice.title = title;
        }
        if (tdIndex === dateTdIndex) {
          const date = $(tdElement).text().trim();
          notice.postedAt = date;
        }
      });

      if (linkAnchorIndex !== null) {
        $("td a", element).each((linkIndex, linkElement) => {
          if (linkIndex === linkAnchorIndex) {
            const rawLink = $(linkElement).attr("href");
            let resolved = null;
            if (rawLink) {
              try {
                // 페이지 URL을 기준으로 '/...' 및 '?...' 따라 상대 경로가 작동하도록 해결
                resolved = new URL(rawLink, url).toString();
              } catch (e) {
                console.log("Invalid link format:", rawLink, e);
                resolved = null;
              }
            }
            notice.link = resolved;
          }
        });
      } else {
        const rawLink = $("td a", element).attr("href");
        let resolved = null;
        if (rawLink) {
          try {
            resolved = new URL(rawLink, url).toString();
          } catch (e) {
            console.log("Invalid link format:", rawLink, e);
            resolved = null;
          }
        }
        notice.link = resolved;
      }

      notices.push(notice);
    });
  } catch (error) {
    console.error(
      `Error scraping ${config.name + board.name} at path ${config.website + board.path}:`,
      error,
    );
  }
  return { notices };
};

export default extractNoticesFromPath;
