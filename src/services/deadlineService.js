import axios from "axios";
import * as cheerio from "cheerio";
import normalizeToEndDate from "../utils/parseDate.js";

const getDeadlineFromNotice = async (notice) => {
  const url = notice.link;
  try {
    const keywords = [
      "신청기간",
      "신청 기간",
      "일시",
      "서류접수",
      "서류 접수",
      "모집기간",
      "모집 기간",
      "제출 기한",
      "제출기한",
    ];
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    // "일시"라는 텍스트가 포함된 최하위 엘리먼트를 찾기
    const deadlineElement = $("*")
      .filter((i, el) =>
        keywords.some((keyword) => $(el).text().includes(keyword))
      )
      .last();
    let text = deadlineElement.text();
    keywords.some((keyword) => {
      if (text.includes(keyword)) {
        text = text.slice(text.indexOf(keyword) + keyword.length).trim();
      }
    });
    const deadline = normalizeToEndDate(text) || false;
    return deadline;
  } catch (error) {
    console.error("Error fetching deadline from notice:", error);
    return null;
  }
};

export { getDeadlineFromNotice };
