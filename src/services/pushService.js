import { Expo } from "expo-server-sdk";
import User from "../models/userModel.js";

const expo = new Expo();

// 여러 메시지 한번에 처리
const sendPushNotification = async (messages) => {
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  for (const chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...receipts);
      console.log("Push notification receipts:", receipts);
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  }
  return tickets;
};

const buildPushMessage = (expoPushToken, title, body, data = {}) => {
  return {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: data,
  };
};

const sendKeywordPush = async (newNotices) => {
  const users = await User.find({
    "keywordForPush.0": { $exists: true },
    expoPushToken: { $ne: null },
  }).lean();
  const messages = [];
  for (const user of users) {
    const noticeForPush = {};
    for (const notice of newNotices) {
      for (const keyword of user.keywordForPush) {
        if (notice.title.includes(keyword)) {
          noticeForPush[keyword] = noticeForPush[keyword] || [];
          noticeForPush[keyword].push(notice);
          break;
        }
      }
    }
    if (Object.keys(noticeForPush).length > 1) {
      const message = buildPushMessage(
        user.expoPushToken,
        `[${Object.keys(noticeForPush).join(
          ", "
        )}] 관련 새 공고가 등록되었습니다!`,
        `${Object.values(noticeForPush)[0].title.slice(0, 30)}... 외 ${
          Object.keys(noticeForPush).length - 1
        }건`
      );
      messages.push(message);
    } else if (Object.keys(noticeForPush).length === 1) {
      const keyword = Object.keys(noticeForPush)[0];
      const notices = noticeForPush[keyword];
      const message = buildPushMessage(
        user.expoPushToken,
        `[${keyword}] 관련 새 공고가 등록되었습니다!`,
        `${notices[0].title.slice(0, 30)}...`
      );
      messages.push(message);
    }
  }
  const tickets = await sendPushNotification(messages);
  return tickets;
};

export { sendPushNotification, buildPushMessage, sendKeywordPush };
