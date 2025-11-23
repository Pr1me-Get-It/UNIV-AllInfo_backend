import { getLatestNotices } from "../services/dbService.js";

/**
 * @desc 최신 공지사항 가져오기
 * @route GET /notice?p={pageNumber}
 */
const getAllNotices = async (req, res) => {
  try {
    const page = parseInt(req.query.p) || 1;
    const notices = await getLatestNotices(page, 15);
    res.status(200).json({ notices });
  } catch (error) {
    console.error("Error getting notices:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { getAllNotices };
