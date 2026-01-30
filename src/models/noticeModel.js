import { query } from "../config/dbConnect.js";

class Notice {
  constructor({
    source = null,
    title = null,
    postedAt = null,
    link = null,
    isFixed = false,
  } = {}) {
    this.source = source;
    this.title = title;
    this.postedAt = postedAt;
    this.link = link;
    this.isFixed = isFixed;
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

const read = async (offset, limit, order = "DESC") => {
  const sort = order && String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";
  const rows = await query(
    `SELECT * FROM notices ORDER BY posted_at ${sort} LIMIT ?, ?`,
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

const readByKeyword = async (keyword, offset, limit, order = "DESC") => {
  const sort = order && String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";
  const rows = await query(
    `SELECT * FROM notices
      WHERE title LIKE ? 
      ORDER BY posted_at ${sort} 
      LIMIT ?, ?`,
    [`%${keyword}%`, (offset - 1) * limit, limit],
  );
  return rows;
};

const readBySource = async (source, offset, limit, order = "DESC") => {
  const sort = order && String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";
  const rows = await query(
    `SELECT * FROM notices
      WHERE source LIKE ?
      ORDER BY posted_at ${sort} 
      LIMIT ?, ?`,
    [`%${source}%`, (offset - 1) * limit, limit],
  );
  return rows;
};

const readFiltered = async ({
  keyword = null,
  source = null,
  offset = 1,
  limit = 10,
  order = "DESC",
} = {}) => {
  const where = [];
  const params = [];
  if (keyword) {
    where.push("title LIKE ?");
    params.push(`%${keyword}%`);
  }
  if (source) {
    where.push("source LIKE ?");
    params.push(`%${source}%`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const sort = order && String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";
  const rows = await query(
    `SELECT * FROM notices ${whereSql} ORDER BY posted_at ${sort} LIMIT ?, ?`,
    [...params, (offset - 1) * limit, limit],
  );
  return rows;
};

export const noticeModel = {
  create,
  read,
  readById,
  readByKeyword,
  readBySource,
  readFiltered,
};
export default Notice;
