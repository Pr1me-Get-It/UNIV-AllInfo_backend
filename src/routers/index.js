import express from "express";
import noticeRouter from "./noticeRouter.js";
import userRouter from "./userRouter.js";

const router = express.Router();

router.use("/notice", noticeRouter);
router.use("/user", userRouter);

export default router;
