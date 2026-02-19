import { query } from "../config/dbConnect.js";

const addScore = async ({ userId, gameId, score, metadata = null }) => {
  const meta = metadata ? JSON.stringify(metadata) : null;
  return await query(
    `INSERT INTO game_scores (user_id, game_id, score, metadata) VALUES (?, ?, ?, ?)`,
    [userId, gameId, score, meta],
  );
};

const getUserScores = async (userId) => {
  return await query(
    `SELECT * FROM game_scores WHERE user_id = ? ORDER BY played_at DESC`,
    [userId],
  );
};

const getTopScores = async (gameId, limit = 10) => {
  return await query(
    `SELECT * FROM game_scores WHERE game_id = ? ORDER BY score DESC LIMIT ?`,
    [gameId, limit],
  );
};

const getBestScore = async (userId, gameId) => {
  const res = await query(
    `SELECT MAX(score) AS best_score FROM game_scores WHERE user_id = ? AND game_id = ?`,
    [userId, gameId],
  );
  return res && res.length ? res[0].best_score : null;
};

export const gameScoreModel = {
  addScore,
  getUserScores,
  getTopScores,
  getBestScore,
};
export default gameScoreModel;
