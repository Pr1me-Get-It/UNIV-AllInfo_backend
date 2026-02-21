import express from "express";
import {
  addScore,
  getUserScores,
  getTopScores,
  getBestScore,
} from "../controllers/gameScoreController.js";

const gameScoreRouter = express.Router();

// POST /gamescore
gameScoreRouter.post("/", addScore);

// GET /gamescore/user
gameScoreRouter.get("/user", getUserScores);

// GET /gamescore/top?gameId=1&limit=10
gameScoreRouter.get("/top", getTopScores);

// GET /gamescore/best?userId=1&gameId=1
gameScoreRouter.get("/best", getBestScore);

export default gameScoreRouter;
