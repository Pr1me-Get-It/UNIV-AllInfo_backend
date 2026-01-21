import { query } from "../config/dbConnect.js";

class Like {
  constructor({ noticeId = null, userId = null } = {}) {
    this.noticeId = noticeId;
    this.userId = userId;
  }
}

const create = async (like) => {
  const result = await query(
    `INSERT INTO notice_likes (
      notice_id,
      user_id
    ) VALUES (?, ?)`,
    [like.noticeId, like.userId],
  );
  return result;
};

const readById = async (id) => {
  const results = await query(
    `SELECT * FROM notice_likes WHERE notice_id = ?`,
    [id],
  );
  return results;
};

export const likeModel = { create, readById };
export default Like;
