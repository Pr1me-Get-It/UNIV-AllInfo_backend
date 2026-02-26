import { query } from "../config/dbConnect.js";

class Feedback {
  constructor(comment = null) {
    this.comment = comment;
  }
}

const create = async (feedback) => {
  const result = await query(
    `INSERT INTO feedback (
            comment
        ) VALUES (?)`,
    [feedback.comment],
  );
  return result;
};

export default Feedback;
export const feedbackModel = { create };
