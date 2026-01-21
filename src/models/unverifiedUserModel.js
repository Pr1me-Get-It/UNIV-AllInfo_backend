import { query } from "../config/dbConnect.js";

class UnverifiedUser {
  constructor(email, expoPushToken = null) {
    this.email = email;
    this.expoPushToken = expoPushToken;
  }
}

const getAll = async () => {
  return await query("SELECT * FROM unverified_users");
};

const readByEmail = async (email) => {
  const rows = await query(`SELECT * FROM unverified_users WHERE email = ?`, [
    email,
  ]);
  return rows[0];
};

const create = async (unverifiedUser) => {
  const result = await query(
    `INSERT INTO unverified_users (
      email,
      expo_push_token
    ) VALUES (?, ?)`,
    [unverifiedUser.email, unverifiedUser.expoPushToken]
  );
  return result;
};

const getAllWithKeywords = async () => {
  const rows = await query(
    `SELECT u.unverified_user_id, u.email, u.expo_push_token,
      GROUP_CONCAT(k.keyword) AS keywords
     FROM unverified_users u
     INNER JOIN unverified_user_push_keywords k
       ON u.unverified_user_id = k.user_id
     GROUP BY u.unverified_user_id`
  );
  return rows.map((r) => ({
    unverified_user_id: r.unverified_user_id,
    email: r.email,
    expoPushToken: r.expo_push_token,
    keywordForPush: r.keywords ? r.keywords.split(",") : [],
  }));
};

export const unverifiedUserModel = {
  getAll,
  readByEmail,
  create,
  getAllWithKeywords,
};
export default UnverifiedUser;
