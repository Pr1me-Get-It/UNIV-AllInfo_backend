import express from "express";
import {
  getAllNotices,
  likeNotice,
  getDeadLineNotices,
} from "../controllers/noticeController.js";

const noticeRouter = express.Router();

// /notice
noticeRouter.get("/", getAllNotices);
noticeRouter.post("/like/:id", likeNotice);
noticeRouter.get("/deadline/:id", getDeadLineNotices);

export default noticeRouter;
