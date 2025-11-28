import { Expo } from "expo-server-sdk";

const expo = new Expo();

// 여러 메시지 한번에 처리
const sendPushNotification = async (messages) => {
  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  }
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

export { sendPushNotification, buildPushMessage };
