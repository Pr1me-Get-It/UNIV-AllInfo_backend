import UnverifiedUser, {
  unverifiedUserModel,
} from "../models/unverifiedUserModel.js";
import UnverifiedUserPushKeyword, {
  unverifiedUserPushKeywordModel,
} from "../models/unverifiedUserPushKeywordModel.js";
import UnverifiedUserPushSource, {
  unverifiedUserPushSourceModel,
} from "../models/unverifiedUserPushSourceModel.js";

/**
 * @desc user registration
 * @route POST /user/register
 *
 * unverfied_user register임.
 */
const registerUser = async (req, res) => {
  try {
    const { email, expoPushToken } = req.body;
    const newUser = new UnverifiedUser(email, expoPushToken);
    const result = await unverifiedUserModel.create(newUser);
    res.status(201).json({
      success: true,
      message: "Unverified user registered successfully",
      data: result,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }
    console.error("Error registering unverified user:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to register unverified user" });
  }
};

/**
 * @desc register keyword for user
 * @route POST /user/keywords
 *
 * unverified_user_push_keywords 관련
 */
const registerKeyword = async (req, res) => {
  try {
    const { email, keywords } = req.body;
    const user = (await unverifiedUserModel.readByEmail(email)) || null;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    keywords.map((keyword) => keyword.trim()).filter((k) => k !== "");
    const results = [];
    // 중복 키워드 발생 시 건너뛰고 진행하도록 수정 필요
    for (const keyword of keywords) {
      try {
        const newKeywordRecord = new UnverifiedUserPushKeyword(
          user.unverified_user_id,
          keyword,
        );
        const result =
          await unverifiedUserPushKeywordModel.create(newKeywordRecord);
        results.push(result);
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          results.push({
            success: false,
            message: `Keyword already exists: ${keyword}`,
          });
          continue;
        }
        results.push({
          success: false,
          message: `Failed to register keyword: ${keyword}`,
        });
      }
    }
    res.status(201).json({
      success: true,
      message: "Keywords registered successfully",
      data: results,
    });
    // jwt 등을 활용해서 참조할 때 효율적으로 할 수 있도록 고치기
    // 모르겠고 일단 email 이용해서 기능 완성이나 하기
  } catch (error) {
    console.error("Error registering keywords:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to register keywords" });
  }
};

/**
 * @desc get keywords for user
 * @route GET /user/keywords
 */
const getKeywords = async (req, res) => {
  try {
    const { email } = req.body;
    const user = (await unverifiedUserModel.readByEmail(email)) || null;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userKeywords =
      (await unverifiedUserPushKeywordModel.readByUserId(
        user.unverified_user_id,
      )) || null;
    res.status(200).json({
      success: true,
      data: userKeywords,
    });
  } catch (error) {
    console.error("Error getting keywords:", error);
    res.status(500).json({ success: false, message: "Failed to get keywords" });
  }
};

/**
 * @desc delete keyword for user
 * @route DELETE /user/keywords
 */
const deleteKeyword = async (req, res) => {
  try {
    const { email, keywords } = req.body;
    const user = (await unverifiedUserModel.readByEmail(email)) || null;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const results = [];
    for (const keyword of keywords) {
      try {
        const result = await unverifiedUserPushKeywordModel.remove(
          user.unverified_user_id,
          keyword,
        );
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          message: `Failed to delete keyword: ${keyword}`,
        });
      }
    }
    res.status(200).json({
      success: true,
      message: "Keywords deleted successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error deleting keywords:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete keywords" });
  }
};

/**
 * @desc register push source for user
 * @route POST /user/sources
 */
const registerSource = async (req, res) => {
  const { email, sources } = req.body;
  try {
    const user = (await unverifiedUserModel.readByEmail(email)) || null;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const results = [];
    for (const source of sources) {
      try {
        const newSourceRecord = new UnverifiedUserPushSource(
          user.unverified_user_id,
          source,
        );
        const result =
          await unverifiedUserPushSourceModel.create(newSourceRecord);
        results.push(result);
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          results.push({
            success: false,
            message: `Source already exists: ${source}`,
          });
          continue;
        }
        results.push({
          success: false,
          message: `Failed to register source: ${source}`,
        });
      }
    }
    res.status(201).json({
      success: true,
      message: "Sources registered successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error registering sources:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to register sources" });
  }
};

/**
 * @desc get push sources for user
 * @route GET /user/sources
 */
const getSources = async (req, res) => {
  try {
    const { email } = req.body;
    const user = (await unverifiedUserModel.readByEmail(email)) || null;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userSources =
      (await unverifiedUserPushSourceModel.readByUserId(
        user.unverified_user_id,
      )) || null;
    res.status(200).json({
      success: true,
      data: userSources,
    });
  } catch (error) {
    console.error("Error getting sources:", error);
    res.status(500).json({ success: false, message: "Failed to get sources" });
  }
};

const deleteSource = async (req, res) => {
  try {
    const { email, sources } = req.body;
    const user = (await unverifiedUserModel.readByEmail(email)) || null;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const results = [];
    for (const source of sources) {
      try {
        const result = await unverifiedUserPushSourceModel.remove(
          user.unverified_user_id,
          source,
        );
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          message: `Failed to delete source: ${source}`,
        });
      }
    }
    res.status(200).json({
      success: true,
      message: "Sources deleted successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error deleting sources:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete sources" });
  }
};

export {
  registerUser,
  registerKeyword,
  getKeywords,
  deleteKeyword,
  registerSource,
  getSources,
  deleteSource,
};
