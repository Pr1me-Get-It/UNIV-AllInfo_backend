import Notice from "../models/noticeModel.js";

/** source에 해당하는 가장 최근 data 2개 가져오기 */
const findTwoBySource = async (source) => {
  try {
    const notice = await Notice.find({ source: source })
      .sort({ id: -1 })
      .limit(2);
    return notice;
  } catch (error) {
    console.error("Error finding notice by source:", error);
    throw error;
  }
};

const findOneLatest = async () => {
  try {
    const notice = await Notice.findOne().sort({ id: -1 });
    return notice;
  } catch (error) {
    console.error("Error finding latest notice:", error);
    throw error;
  }
};

const saveNotice = async (notice) => {
  try {
    const newNotice = await Notice.create(notice);
    return newNotice;
  } catch (error) {
    console.error("Error saving notice:", error);
    throw error;
  }
};

/** 최신순으로 페이징해서 가져오기 */
const getLatestNotices = async (page = 1, limit = 10) => {
  try {
    const filter = {};
    const total = await Notice.countDocuments(filter);
    const notices = await Notice.find(filter)
      .sort({ id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return {
      notices,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit) || 0,
    };
  } catch (error) {
    console.error("Error getting latest notices:", error);
    throw error;
  }
};

const getNoticesByKeyword = async (keyword, page = 1, limit = 10) => {
  try {
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safe = escapeRegex(keyword);
    const re = new RegExp("^" + safe, "i");
    const filter = { title: re };
    const total = await Notice.countDocuments(filter);
    const notices = await Notice.find(filter)
      .sort({ id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return {
      notices,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit) || 0,
    };
  } catch (error) {
    console.error("Error getting notices by keyword:", error);
    throw error;
  }
};

export {
  findTwoBySource,
  findOneLatest,
  saveNotice,
  getLatestNotices,
  getNoticesByKeyword,
};
