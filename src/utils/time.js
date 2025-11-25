/**
 * Time utilities for KST (Asia/Seoul)
 */
const KST_ZONE = "Asia/Seoul";

const pad = (num, size = 2) => String(num).padStart(size, "0");

export const formatKST = (date = new Date()) => {
  // date -> local KST string like 'YYYY-MM-DD HH:mm:ss'
  const kstDateStr = new Date(date).toLocaleString("sv-SE", {
    timeZone: KST_ZONE,
    hour12: false,
  });
  // kstDateStr is 'YYYY-MM-DD HH:mm:ss'
  const ms = pad(new Date(date).getMilliseconds(), 3);
  // include milliseconds and offset +09:00
  return `${kstDateStr.replace(" ", "T")}.${ms}+09:00`;
};

export const nowKST = () => formatKST(new Date());

export default { formatKST, nowKST };
