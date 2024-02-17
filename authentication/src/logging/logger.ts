import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf, colorize } = format;
const CATEGORY = 'Authentication Server';

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${formatTimestamp(timestamp)} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    label({ label: CATEGORY }),
    timestamp(),
    colorize(),

    customFormat,
  ),
  transports: [new transports.Console()],
});

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString();

  return formattedDate;
}

export default logger;
