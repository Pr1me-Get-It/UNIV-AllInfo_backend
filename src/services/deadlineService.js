import axios from "axios";
import * as cheerio from "cheerio";
import normalizeToEndDate from "../utils/parseDate.js";

const getDeadlineFromNotice = async (notice) => {
  const url = notice.link;
  try {
    // keywords in priority order (higher priority first)
    const keywords = [
      "신청기간",
      "신청 기간",
      "모집기간",
      "모집 기간",
      "제출 기한",
      "제출기한",
      "서류접수",
      "서류 접수",
      "입력기한",
      "입력 기한",
      "일시",
    ];
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // array 순서에 따른 우선 순위 적용?
    let chosenKeyword = null;
    let foundElement = null;
    for (const keyword of keywords) {
      const el = $("*")
        .filter((i, el) => $(el).text().includes(keyword))
        .last()
        .parent();
      if (el && el.length) {
        foundElement = el;
        chosenKeyword = keyword;
        break;
      }
    }

    if (!foundElement) {
      console.log("No relevant element found for deadline parsing.");
      return null;
    }
    let text = foundElement
      .children()
      .map((i, el) => $(el).text().trim())
      .get()
      .join(" ")
      .trim();

    console.log("Extracted concatenated text for deadline parsing:", text);

    // If we selected a keyword by priority, slice after that keyword to focus parsing
    if (chosenKeyword) {
      const idx = text.indexOf(chosenKeyword);
      if (idx !== -1) text = text.slice(idx + chosenKeyword.length).trim();
    }

    const deadline = normalizeToEndDate(text);

    console.log("Parsed deadline:", deadline);
    return deadline;
  } catch (error) {
    console.error("Error fetching deadline from notice:", error);
    return null;
  }
};

export { getDeadlineFromNotice };
