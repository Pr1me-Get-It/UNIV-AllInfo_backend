import User from "../models/userModel.js";

/**
 * @desc user registration
 * @route POST /user/register
 */
const registerUser = async (req, res) => {
  try {
    const email = req.body.email;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(200)
        .json({ success: true, message: "User already registered" });
    } else {
      const createdUser = await User.create({ email: email });
      return res.status(201).json({
        success: true,
        message: `User registered successfully with email: ${createdUser.email}`,
      });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to register user" });
  }
};

/**
 * @desc register keyword for user
 * @route POST /user/keyword
 */
const registerKeyword = async (req, res) => {
  try {
    const email = req.body.email;
    const keywords = req.body.keywords;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.keywordForPush.push(...keywords);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Keywords registered successfully",
      keywords: user.keywordForPush,
    });
  } catch (error) {
    console.error("Error registering keywords:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to register keywords" });
  }
};

/**
 * @desc get keywords for user
 * @route GET /user/keyword
 */
const getKeywords = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      keywords: user.keywordForPush,
    });
  } catch (error) {
    console.error("Error getting keywords:", error);
    res.status(500).json({ success: false, message: "Failed to get keywords" });
  }
};

/**
 * @desc delete keyword for user
 * @route DELETE /user/keyword
 */
const deleteKeyword = async (req, res) => {
  try {
    const email = req.body.email;
    const keywords = req.body.keywords;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.keywordForPush = user.keywordForPush.filter(
      (keyword) => !keywords.includes(keyword)
    );
    await user.save();
    res.status(200).json({
      success: true,
      message: "Keywords deleted successfully",
      keywords: user.keywordForPush,
    });
  } catch (error) {
    console.error("Error deleting keywords:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete keywords" });
  }
};

export { registerUser, registerKeyword, getKeywords, deleteKeyword };
