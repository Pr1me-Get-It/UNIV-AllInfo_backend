import {
  getLatestNotices,
  getNoticesByKeyword,
  getDeadlineById,
  handleLikeNotice,
} from "../services/noticeDbService.js";

/**
 * @desc 최신 공지사항 가져오기
 * @route GET /notice?p={pageNumber}&keyword={searchKeyword}
 */
const getAllNotices = async (req, res) => {
  try {
    const page = parseInt(req.query.p) || 1;
    const keyword = req.query.keyword ? String(req.query.keyword).trim() : "";

    if (keyword) {
      const dbData = await getNoticesByKeyword(keyword, page, 15);
      for (const notice of dbData.notices) {
        delete notice._id;
        delete notice.__v;
        notice.source = notice.source.slice(0, 3);
        notice.like = notice.likeArray?.length || 0;
        delete notice.likeArray;
      }
      return res.status(200).json(dbData);
    }

    const dbData = await getLatestNotices(page, 15);
    for (const notice of dbData.notices) {
      delete notice._id;
      delete notice.__v;
      notice.like = notice.likeArray?.length || 0;
      delete notice.likeArray;
      notice.source = notice.source.slice(0, 3);
    }
    res.status(200).json(dbData);
  } catch (error) {
    console.error("Error getting notices:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc like notice
 * @route POST /notice/like/:id
 */
const likeNotice = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.body.email;
    const result = await handleLikeNotice(id, email);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error liking notice:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc get deadline notice
 * @route GET /notice/deadline/:id
 */
const getDeadLineNotices = async (req, res) => {
  try {
    const result = await getDeadlineById(req.params.id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found" });
    }
    const { deadline, isExistDeadline } = result;
    res.status(200).json({ deadline, isExistDeadline });
  } catch (error) {
    console.error("Error getting deadline notice:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { getAllNotices, likeNotice, getDeadLineNotices };
