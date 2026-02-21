import { gameScoreModel } from "../models/gameScoreModel.js";
import { unverifiedUserModel } from "../models/unverifiedUserModel.js";

const addScore = async (req, res) => {
  try {
    const { email, gameId, score, metadata } = req.body;
    if (!email || !gameId || typeof score === "undefined") {
      return res
        .status(400)
        .json({ success: false, message: "Missing email, gameId or score" });
    }
    const user = await unverifiedUserModel.readByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const result = await gameScoreModel.addScore({
      userId: user.unverified_user_id,
      gameId,
      score,
      metadata,
    });
    return res.status(201).json({ success: true, insertId: result.insertId });
  } catch (error) {
    console.error("Error adding score:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getUserScores = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ success: false, message: "Missing email" });
    }
    const user = await unverifiedUserModel.readByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const scores = await gameScoreModel.getUserScores(user.unverified_user_id);
    res.status(200).json(scores);
  } catch (error) {
    console.error("Error getting user scores:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getTopScores = async (req, res) => {
  try {
    const gameId = req.query.gameId;
    const limit = parseInt(req.query.limit) || 10;
    if (!gameId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing gameId" });
    }
    const scores = await gameScoreModel.getTopScores(gameId, limit);
    res.status(200).json(scores);
  } catch (error) {
    console.error("Error getting top scores:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getBestScore = async (req, res) => {
  try {
    const email = req.body.email;
    const gameId = req.query.gameId || req.params.gameId;
    if (!email || !gameId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing email or gameId" });
    }
    const user = await unverifiedUserModel.readByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const best = await gameScoreModel.getBestScore(
      user.unverified_user_id,
      gameId,
    );
    res.status(200).json({ email, gameId, bestScore: best });
  } catch (error) {
    console.error("Error getting best score:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addScore, getUserScores, getTopScores, getBestScore };
