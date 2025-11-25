import axios from "axios";
import * as cheerio from "cheerio";

/**
 * notice object type 정의
 * @typedef {Object} Notice
 * @property {number} id
 * @property {string} source
 * @property {string} title
 * @property {string} date
 * @property {string} link
 */

const extractNoticesFromPath = async (config, path, options = {}) => {
  const { titleTdIndex = 1, dateTdIndex = 4, linkAnchorIndex = 1 } = options;
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

      // 첫번째 td의 number 여부를 판별하여 fixed notice는 건너뛰기
      const firstTdText = $("td", element).first().text().trim();
      if (isNaN(Number(firstTdText)) || firstTdText === "") {
        return; // continue to next iteration
      }

      $("td", element).each((tdIndex, tdElement) => {
        if (tdIndex === titleTdIndex) {
          const title = $(tdElement).text().replace(/\s+/g, " ").trim();
          notice.title = title;
        }
        if (tdIndex === dateTdIndex) {
          const date = $(tdElement).text().trim();
          notice.date = date;
        }
      });

      if (linkAnchorIndex !== null) {
        $("td a", element).each((linkIndex, linkElement) => {
          if (linkIndex === linkAnchorIndex) {
            const rawLink = $(linkElement).attr("href");
            let resolved = null;
            if (rawLink) {
              try {
                // Resolve against the page URL so '/...' and '?...' and relative paths work
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
    console.error(`Error scraping ${config.name} at path ${path}:`, error);
  }
  return { notices, source };
};

export default extractNoticesFromPath;
