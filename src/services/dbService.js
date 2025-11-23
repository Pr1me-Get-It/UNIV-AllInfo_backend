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
    const notices = await Notice.find()
      .sort({ id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return notices;
  } catch (error) {
    console.error("Error getting latest notices:", error);
    throw error;
  }
};

export { findTwoBySource, findOneLatest, saveNotice, getLatestNotices };
