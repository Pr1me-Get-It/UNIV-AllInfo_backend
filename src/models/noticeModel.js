import { query } from "../config/dbConnect.js";

class Notice {
  constructor({
    source = null,
    title = null,
    postedAt = null,
    link = null,
  } = {}) {
    this.source = source;
    this.title = title;
    this.postedAt = postedAt;
    this.link = link;
  }
}

const create = async (notice) => {
  const result = await query(
    `INSERT INTO notices (
      source,
      title,
      posted_at,
      link
    ) VALUES (?, ?, ?, ?)`,
    [notice.source, notice.title, notice.postedAt, notice.link],
  );
  return result;
};

const read = async (offset, limit) => {
  const rows = await query(
    `SELECT * FROM notices ORDER BY posted_at DESC LIMIT ?, ?`,
    [(offset - 1) * limit, limit],
  );
  return rows;
};

const readById = async (id) => {
  const results = await query(`SELECT * FROM notices WHERE notice_id = ?`, [
    id,
  ]);
  return results[0];
};

const readByKeyword = async (keyword, offset, limit) => {
  const rows = await query(
    `SELECT * FROM notices
      WHERE title LIKE ? 
      ORDER BY posted_at DESC 
      LIMIT ?, ?`,
    [`%${keyword}%`, (offset - 1) * limit, limit],
  );
  return rows;
};

const readBySource = async (source, offset, limit) => {
  const rows = await query(
    `SELECT * FROM notices
      WHERE source LIKE ?
      ORDER BY posted_at DESC 
      LIMIT ?, ?`,
    [`%${source}%`, (offset - 1) * limit, limit],
  );
  return rows;
};

export const noticeModel = {
  create,
  read,
  readById,
  readByKeyword,
  readBySource,
};
export default Notice;
