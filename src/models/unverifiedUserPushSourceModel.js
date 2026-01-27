import { query } from "../config/dbConnect.js";

class UnverifiedUserPushSource {
  constructor({ userId = null, source = null } = {}) {
    this.userId = userId;
    this.source = source;
  }
}

const create = async (unverifiedUserPushSource) => {
  const result = await query(
    `INSERT INTO unverified_user_push_sources (
        user_id,
        source
      ) VALUES (?, ?)`,
    [unverifiedUserPushSource.userId, unverifiedUserPushSource.source],
  );
  return result;
};

const readByUserId = async (userId) => {
  const rows = await query(
    `SELECT * FROM unverified_user_push_sources WHERE user_id = ?`,
    [userId],
  );
  return rows;
};

const remove = async (userId, source) => {
  const result = await query(
    `DELETE FROM unverified_user_push_sources WHERE user_id = ? AND source = ?`,
    [userId, source],
  );
  return result;
};

export const unverifiedUserPushSourceModel = { create, readByUserId, remove };
export default UnverifiedUserPushSource;
