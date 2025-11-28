/**
 * 온갖 Date 파싱 (잘 만듦)
 * Returns an object: { start: 'YYYY-MM-DD' | null, end: 'YYYY-MM-DD' | null }
 */
const normalizeToRange = (input) => {
  if (!input) {
    return { start: null, end: null };
  }
  let s = String(input);

  // Remove bracketed weekday markers like (목), (Fri), etc.
  s = s.replace(/\([^)]*\)/g, "");
  // unify dashes and tildes
  s = s.replace(/[–—]/g, "-").replace(/[~〜]/g, "~");
  // remove commas
  s = s.replace(/,/g, " ");
  // remove time tokens like 12:00 which can confuse date regexes
  s = s.replace(/\b\d{1,2}:\d{2}\b/g, " ");
  s = s.replace(/\s+/g, " ").trim();

  const fullDateRe = /(\d{4})\s*[.\-년\/]\s*(\d{1,2})\s*[.\-월\/]\s*(\d{1,2})/g;
  const monthDayRe = /(\d{1,2})\s*[.\-월\/]\s*(\d{1,2})/g;

  const fmt = (y, m, d) => {
    const mm = String(m).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  };

  const isValidDateParts = (y, m, d) => {
    if (!y || !m || !d) return false;
    const yi = Number(y);
    const mi = Number(m);
    const di = Number(d);
    if (mi < 1 || mi > 12) return false;
    if (di < 1 || di > 31) return false;
    const dt = new Date(yi, mi - 1, di);
    return (
      dt.getFullYear() === yi && dt.getMonth() === mi - 1 && dt.getDate() === di
    );
  };

  const fullDates = [];
  let m;
  while ((m = fullDateRe.exec(s)) !== null) {
    fullDates.push([Number(m[1]), Number(m[2]), Number(m[3])]);
  }

  const parseSingle = (fragment, defaultYear = null) => {
    if (!fragment) return null;
    const str = fragment.trim();
    fullDateRe.lastIndex = 0;
    const f = fullDateRe.exec(str);
    if (f) {
      const y = Number(f[1]);
      const mo = Number(f[2]);
      const da = Number(f[3]);
      if (isValidDateParts(y, mo, da)) return { y, mo, da };
      return null;
    }
    const twoDigitYearRe =
      /(\d{2})\s*[.\-년\/]\s*(\d{1,2})\s*[.\-월\/]\s*(\d{1,2})/g;
    twoDigitYearRe.lastIndex = 0;
    const t = twoDigitYearRe.exec(str);
    if (t) {
      const y = 2000 + Number(t[1]);
      const mo = Number(t[2]);
      const da = Number(t[3]);
      if (isValidDateParts(y, mo, da)) return { y, mo, da };
      return null;
    }
    monthDayRe.lastIndex = 0;
    const md = monthDayRe.exec(str);
    if (md) {
      const mo = Number(md[1]);
      const da = Number(md[2]);
      const y = defaultYear || new Date().getFullYear();
      if (isValidDateParts(y, mo, da)) return { y, mo, da };
      return null;
    }
    const iso = str.match(/(\d{4}-\d{2}-\d{2})/);
    if (iso) {
      const [y, mo, da] = iso[1].split("-").map(Number);
      if (isValidDateParts(y, mo, da)) return { y, mo, da };
    }
    return null;
  };

  if (s.includes("~")) {
    const parts = s.split("~");
    const left = parts[0] || "";
    const right = parts[1] || "";
    const leftParsed = parseSingle(left, null);
    let leftYear = leftParsed ? leftParsed.y : null;
    const start = leftParsed
      ? fmt(leftParsed.y, leftParsed.mo, leftParsed.da)
      : null;
    const rightParsed = parseSingle(
      right,
      leftYear || new Date().getFullYear()
    );
    const end = rightParsed
      ? fmt(rightParsed.y, rightParsed.mo, rightParsed.da)
      : null;
    return { start, end };
  }

  const singleParsed = parseSingle(s, null);
  if (singleParsed) {
    const d = fmt(singleParsed.y, singleParsed.mo, singleParsed.da);
    return { start: d, end: d };
  }

  return { start: null, end: null };
};

export default normalizeToRange;
