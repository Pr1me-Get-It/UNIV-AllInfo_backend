import express from "express";
import noticeRouter from "./noticeRouter.js";

const router = express.Router();

router.use("/notice", noticeRouter);

export default router;
