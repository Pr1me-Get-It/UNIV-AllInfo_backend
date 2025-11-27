import Notice from "../models/noticeModel.js";
import { getDeadlineFromNotice } from "./deadlineService.js";

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

const getDeadlineById = async (id) => {
  try {
    const notice = await Notice.findOne({ id: id });
    if (notice) {
      if (notice.deadline) {
        return { deadline: notice.deadline, isExistDeadline: true };
      } else if (notice.deadline === false) {
        return { deadline: null, isExistDeadline: false };
      } else if (notice.deadline === null) {
        const deadline = await getDeadlineFromNotice(notice);
        notice.deadline = deadline.start || deadline.end ? deadline : null;
        await notice.save();
        return {
          deadline: deadline,
          isExistDeadline: deadline.start || deadline.end ? true : false,
        };
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting deadline by link:", error);
    throw error;
  }
};

const handleLikeNotice = async (id, email) => {
  try {
    const notice = await Notice.findOne({ id: id });
    if (!notice) {
      throw new Error("Notice not found");
    }
    const likeArray = notice.likeArray || [];
    const emailIndex = likeArray.indexOf(email);
    if (emailIndex === -1) {
      likeArray.push(email);
      notice.likeArray = likeArray;
      await notice.save();
      return { success: true, message: "Notice liked" };
    } else {
      return { success: false, message: "Notice already liked" };
    }
  } catch (error) {
    console.error("Error handling like notice:", error);
    throw error;
  }
};

export {
  findTwoBySource,
  findOneLatest,
  saveNotice,
  getLatestNotices,
  getNoticesByKeyword,
  getDeadlineById,
  handleLikeNotice,
};
