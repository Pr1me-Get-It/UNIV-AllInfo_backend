import express from "express";
import noticeRouter from "./noticeRouter.js";
import userRouter from "./userRouter.js";
import gameScoreRouter from "./gameScoreRouter.js";
import { testPush } from "../controllers/pushController.js";
import { createFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.use("/notice", noticeRouter);
router.use("/user", userRouter);
router.use("/gamescore", gameScoreRouter);
router.get("/push/test", testPush);
router.post("/feedback", createFeedback);

export default router;
