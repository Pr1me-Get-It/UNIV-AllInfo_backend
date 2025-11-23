import express from "express";
import { getAllNotices } from "../controllers/noticeController.js";

const noticeRouter = express.Router();

// /notice
noticeRouter.get("/", getAllNotices);

export default noticeRouter;
