import { query } from "../config/dbConnect.js";

class Deadline {
  constructor({
    noticeId = null,
    kickoff = null,
    deadline = null,
    isExist = null,
  } = {}) {
    this.noticeId = noticeId;
    this.kickoff = kickoff;
    this.deadline = deadline;
    this.isExist = isExist;
  }
}

const create = async (deadline) => {
  const result = await query(
    `INSERT INTO deadlines (
      notice_id,
      kickoff,
      deadline
    ) VALUES (?, ?, ?)`,
    [deadline.noticeId, deadline.kickoff, deadline.deadline],
  );
  return result;
};

const readByNoticeId = async (noticeId) => {
  const results = await query(`SELECT * FROM deadlines WHERE notice_id = ?`, [
    noticeId,
  ]);
  return results[0];
};

export const deadlineModel = { create, readByNoticeId };
export default Deadline;
