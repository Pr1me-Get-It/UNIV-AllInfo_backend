import express from "express";
import {
  getAllNotices,
  likeNotice,
  getDeadLineNotices,
  getLikesForNotice,
  getTestNotices,
} from "../controllers/noticeController.js";

const noticeRouter = express.Router();

// /notice/test
noticeRouter.get("/test", getTestNotices);

// /notice
noticeRouter.get("/", getAllNotices);
noticeRouter.get("/:id/like", getLikesForNotice).post("/:id/like", likeNotice);
noticeRouter.get("/:id/deadline", getDeadLineNotices);

export default noticeRouter;
