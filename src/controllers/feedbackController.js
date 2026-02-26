import Feedback from "../models/feedbackModel.js";
import { feedbackModel } from "../models/feedbackModel.js";

const createFeedback = async (req, res) => {
  try {
    const { feedback: comment } = req.body;
    if (!comment) {
      return res
        .status(400)
        .json({ success: false, message: "Missing feedback" });
    }

    const feedback = new Feedback(comment);
    const result = await feedbackModel.create(feedback);

    res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating feedback",
      error: error.message,
    });
  }
};

export { createFeedback };
