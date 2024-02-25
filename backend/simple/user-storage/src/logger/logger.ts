import { format, createLogger, transports, Logger } from 'winston';

const { combine, timestamp, label, printf } = format;
const CATEGORY = "User Auth Service";

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger: Logger = createLogger({
  level: "info",
  format: combine(label({ label: CATEGORY }), timestamp(), customFormat),
  transports: [new transports.Console()],
});

export default logger;