const logLevels = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

const logger = {
  error: (msg, err) =>
    console.error(
      `[${new Date().toISOString()}] ${logLevels.ERROR}: ${msg}`,
      err || "",
    ),
  warn: (msg) =>
    console.warn(`[${new Date().toISOString()}] ${logLevels.WARN}: ${msg}`),
  info: (msg) =>
    console.log(`[${new Date().toISOString()}] ${logLevels.INFO}: ${msg}`),
  debug: (msg) =>
    process.env.NODE_ENV === "development" &&
    console.log(`[${new Date().toISOString()}] ${logLevels.DEBUG}: ${msg}`),
};

export default logger;
