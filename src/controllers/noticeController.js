import {
  getLatestNotices,
  getNoticesByKeyword,
} from "../services/dbService.js";

/**
 * @desc 최신 공지사항 가져오기
 * @route GET /notice?p={pageNumber}&keyword={searchKeyword}
 */
const getAllNotices = async (req, res) => {
  try {
    const page = parseInt(req.query.p) || 1;
    const keyword = req.query.keyword ? String(req.query.keyword).trim() : "";

    if (keyword) {
      const notices = await getNoticesByKeyword(keyword, page, 15);
      return res.status(200).json(notices);
    }

    const notices = await getLatestNotices(page, 15);
    res.status(200).json(notices);
  } catch (error) {
    console.error("Error getting notices:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { getAllNotices };
