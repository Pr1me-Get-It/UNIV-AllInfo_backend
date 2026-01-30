/**
 * 화나게 만드는 연도 생략해서 올리는 post들 유추해서 연도 붙여줍니다.\
 * 예시: 01-27 -> 2024-01-27
 */
const mmddToyyyymmdd = (items, options = {}) => {
  const now = options.now ? new Date(options.now) : new Date();
  const currentYear = now.getFullYear();
  let prevDate = null;

  return items.map((item) => {
    const raw = (item.postedAt || "").trim();
    // null 처리
    if (!raw) return { ...item, postedAtISO: null };

    // YYYY-MM-DD
    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      const dt = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
      prevDate = dt;
      return { ...item, postedAtISO: dt.toISOString().slice(0, 10) };
    }

    // MM-DD or M-D
    const md = raw.match(/^(\d{1,2})[-\/](\d{1,2})$/);
    if (!md) return { ...item, postedAtISO: raw };

    const month = Number(md[1]);
    const day = Number(md[2]);

    let year = currentYear;
    let dt = new Date(year, month - 1, day);

    // 미래의 post가 있을 수는 없잖아. 안 그래? 연도를 빠꾸시켜.
    while (dt > now) {
      year--;
      dt = new Date(year, month - 1, day);
    }

    // 이전(더 최신) 날짜보다 미래라면 연도를 다시 빠꾸시켜.
    if (prevDate) {
      while (dt > prevDate) {
        year--;
        dt = new Date(year, month - 1, day);
      }
    }

    prevDate = dt;
    return { ...item, postedAtISO: dt.toISOString().slice(0, 10) };
  });
};

export default mmddToyyyymmdd;
