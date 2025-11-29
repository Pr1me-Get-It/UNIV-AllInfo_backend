import User from "../models/userModel.js";
import {
  buildPushMessage,
  sendPushNotification,
} from "../services/pushService.js";

/**
 * @desc test push controller
 * @route GET /push/test
 */
const testPush = async (req, res) => {
  try {
    const { email, title, body } = req.body;
    const expoPushToken = (await User.findOne({ email: email })).expoPushToken;
    console.log("expoPushToken:", expoPushToken);
    const message = buildPushMessage(expoPushToken, title, body);
    await sendPushNotification([message]);
    res.status(200).json({
      success: true,
      message: "Push controller is working",
    });
  } catch (error) {
    console.error("Error in push controller:", error);
    res.status(500).json({ success: false, message: "Push controller error" });
  }
};

export { testPush };
