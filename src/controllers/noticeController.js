import { noticeModel } from "../models/noticeModel.js";
import { unverifiedUserModel } from "../models/unverifiedUserModel.js";
import Like, { likeModel } from "../models/likeModel.js";
import { deadlineModel } from "../models/deadlineModel.js";
import { getDeadlineFromNotice } from "../services/deadlineService.js";

/**
 * @desc 최신 공지사항 가져오기
 * @route GET /notice?p={pageNumber}&keyword={searchKeyword}
 */
const getAllNotices = async (req, res) => {
  try {
    const page = parseInt(req.query.p) || 1;
    const keyword = req.query.keyword ? String(req.query.keyword).trim() : "";

    if (keyword) {
      const notices = await noticeModel.readByKeyword(keyword, page, 15);
      return res.status(200).json(notices);
    }

    const notices = await noticeModel.read(page, 15);
    return res.status(200).json(notices);
  } catch (error) {
    console.error("Error getting notices:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc like notice
 * @route POST /notice/:id/like
 */
const likeNotice = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.body.email;
    const user = await unverifiedUserModel.readByEmail(email);
    const like = new Like({ noticeId: id, userId: user.unverified_user_id });
    const result = await likeModel.create(like);
    res.status(200).json({ success: true, message: "Notice liked" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ success: false, message: "Notice already liked by user" });
    } else if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res
        .status(404)
        .json({ success: false, message: "Notice or User not found" });
    }
    console.error("Error liking notice:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc unlike notice
 * @route DELETE /notice/:id/like
 */
const unlikeNotice = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.body.email;
    const user = await unverifiedUserModel.readByEmail(email);
    const like = new Like({ noticeId: id, userId: user.unverified_user_id });
    const result = await likeModel.remove(like);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Like not found for this user and notice",
      });
    }
    res.status(200).json({ success: true, message: "Notice unliked" });
  } catch (error) {
    console.error("Error unliking notice:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc get total likes for a notice
 * @route GET /notice/:id/like
 */
const getLikesForNotice = async (req, res) => {
  try {
    const id = req.params.id;
    const likeInfo = await likeModel.readById(id);
    if (!likeInfo) {
      return res
        .status(404)
        .json({ success: false, message: "No likes found for this notice" });
    }
    res.status(200).json({ notice_id: id, total_likes: likeInfo.length });
  } catch (error) {
    console.error("Error getting likes for notice:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc get deadline notice
 * @route GET /notice/:id/deadline
 */
const getDeadLineNotices = async (req, res) => {
  try {
    const id = req.params.id;
    const deadlineInfo = await deadlineModel.readByNoticeId(id);
    if (!deadlineInfo) {
      const notice = await noticeModel.readById(id);
      if (!notice) {
        return res
          .status(404)
          .json({ success: false, message: "Notice not found" });
      }
      const deadlineObj = await getDeadlineFromNotice(notice);
      let kickoff = null;
      let deadline = null;
      if (deadlineObj) {
        kickoff = deadlineObj.start;
        deadline = deadlineObj.end;
      }
      await deadlineModel.create({
        noticeId: id,
        kickoff: kickoff,
        deadline: deadline,
      });
      return res.status(200).json({
        notice_id: id,
        kickoff: kickoff,
        deadline: deadline,
      });
    }
    res.status(200).json(deadlineInfo);
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found" });
    }
    console.error("Error getting deadline notice:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { getAllNotices, likeNotice, getLikesForNotice, getDeadLineNotices };
