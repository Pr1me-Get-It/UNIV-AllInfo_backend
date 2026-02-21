import { query } from "../config/dbConnect.js";

class UnverifiedUserPushKeyword {
  constructor(user_id, keyword) {
    this.user_id = user_id;
    this.keyword = keyword;
  }
}

const readByUserId = async (user_id) => {
  const rows = await query(
    `SELECT * FROM unverified_user_push_keywords WHERE user_id = ?`,
    [user_id]
  );
  if (rows.length === 0) {
    return null;
  }
  console.log(rows);
  const row = { user_id: user_id, keyword: rows.map((r) => r.keyword) };
  // 수정 필요
  return row;
};

const create = async (unverifiedUserPushKeyword) => {
  const result = await query(
    `INSERT INTO unverified_user_push_keywords (user_id, keyword)
      VALUES (?, ?)`,
    [unverifiedUserPushKeyword.user_id, unverifiedUserPushKeyword.keyword]
  );
  return result;
};

const remove = async (user_id, keyword) => {
  const result = await query(
    `DELETE FROM unverified_user_push_keywords WHERE user_id = ? AND keyword = ?`,
    [user_id, keyword]
  );
  return result;
};

export const unverifiedUserPushKeywordModel = { readByUserId, create, remove };
export default UnverifiedUserPushKeyword;
