import morgan from "morgan";

const createMorganMiddleware = (logger) => {
  // add a token that decodes percent-encoded URLs so Korean paths appear readable in logs
  morgan.token("decoded-url", (req) => {
    const raw = req.originalUrl || req.url || "";
    try {
      return decodeURIComponent(raw);
    } catch (e) {
      try {
        return decodeURI(raw);
      } catch (e2) {
        return raw;
      }
    }
  });

  const combinedWithDecodedUrl =
    ':remote-addr - :remote-user [:date[clf]] ":method :decoded-url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

  return morgan(combinedWithDecodedUrl, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  });
};

export default createMorganMiddleware;
