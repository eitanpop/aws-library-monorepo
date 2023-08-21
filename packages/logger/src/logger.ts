enum LoggerLevel {
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const addDateToArgs = (args: unknown[]) => {
  return [...args, `Date: ${new Date().toISOString()}`];
};

const getLogger = (level: LoggerLevel) => {
  const configuredLoggerLevel = (process.env.LOG_LEVEL as keyof typeof LoggerLevel) || 'INFO';
  if (level < LoggerLevel[configuredLoggerLevel]) {
    return () => {};
  }
  switch (level) {
    case LoggerLevel.ERROR:
      // eslint-disable-next-line no-console
      return console.error;
    case LoggerLevel.INFO:
      // eslint-disable-next-line no-console
      return console.info;
    case LoggerLevel.WARN:
      // eslint-disable-next-line no-console
      return console.warn;
    default:
      throw Error('Invalid logger level');
  }
};
const log =
  (loggerLevel: LoggerLevel) =>
  (...args: unknown[]) =>
    getLogger(loggerLevel)(...addDateToArgs(args));
const logger = {
  info: log(LoggerLevel.INFO),
  warn: log(LoggerLevel.WARN),
  error: log(LoggerLevel.ERROR),
};

export default logger;
