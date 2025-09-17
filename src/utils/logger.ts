import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { requestContext } from '../contexts/request-context';

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Define custom log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(logColors);

const addUserContext = winston.format((info) => {
  const user = requestContext.getOptionalUser?.(); // avoid throwing in non-request contexts
  if (user) {
    info.userId = user.id || 'unknown'; // adapt to your user object structure
    info.userEmail = user.email;
  }
  return info;
});


// Define log format for console (human-readable)
const consoleFormat = winston.format.combine(
  addUserContext(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]${meta.userId ? `[${meta.userId}]` : ''} : ${message}`;
    return log;
  })
);

// Define log format for files (JSON for better parsing)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  levels: logLevels,
  format: fileFormat,
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: consoleFormat,
    }),
    // File transport for errors
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: fileFormat,
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      format: fileFormat,
    }),
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join('logs', 'exceptions.log'),
      format: fileFormat,
    }),
  ],
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join('logs', 'rejections.log'),
      format: fileFormat,
    }),
  ],
});

// Add stream property for Morgan HTTP logging
Object.defineProperty(logger, 'stream', {
  value: {
    write: (message: string) => {
      logger.http(message.trim());
    },
  },
  writable: false,
  configurable: false,
});

export default logger; 