import { WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

/**
 * Interface representing the metadata for a log entry.
 */
interface LogMetadata {
  trace?: string;
  content?: unknown;
}

/**
 * Custom log levels and their corresponding colors for the Winston logger.
 */
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    order: 2,
    trade: 3,
    info: 4,
    input: 5,
    debug: 6,
    http: 7,
    verbose: 8,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    order: 'magenta',
    trade: 'yellow',
    info: 'green',
    input: 'grey',
    debug: 'blue',
    http: 'magenta',
    verbose: 'cyan',
  },
};

/**
 * Combines multiple format functions for the Winston logger.
 *
 * The combined formats include:
 * - `format.simple()`: Outputs the log message in a simple format.
 * - `format.metadata()`: Adds metadata to the log message.
 * - `format.timestamp()`: Adds a timestamp to the log message, formatted according to the 'pt-BR' locale and 'America/Sao_Paulo' timezone.
 * - `format.printf()`: Custom format function that formats the log message as a string.
 *
 * The custom format function (`format.printf`) does the following:
 * - Converts the log message to a string. If the message is an object, it is stringified with an indentation of 6 spaces.
 * - Extracts and formats metadata from the log message.
 * - Constructs the final log message string, including the timestamp, log level, trace (if available), and the formatted message and metadata.
 *
 * @returns {Format} The combined format functions for the Winston logger.
 */
const formats = format.combine(
  format.simple(),
  format.metadata(),
  format.timestamp({
    format: new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    }),
  }),
  format.printf((info) => {
    const message =
      typeof info.message === 'object'
        ? JSON.stringify(info?.message, null, 6)
        : info.message;
    const metaDataFormatted = info.metadata as LogMetadata;

    const timestamp = new Date()
      .toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      })
      .replace(', ', '-')
      .trim();

    const trace = metaDataFormatted.trace
      ? ` [${metaDataFormatted.trace}]:`
      : '';
    const content = metaDataFormatted.content
      ? JSON.stringify(metaDataFormatted)
      : '';

    return `${timestamp} [${info.level}]${trace} ${message} ${content}`;
  }),
);

/**
 * Creates a DailyRotateFile transport configuration for Winston logger.
 *
 * @param logFileLevel - The log level for the file transport.
 * @param level - The log level for the logger.
 * @param maxFiles - The maximum number of log files to keep.
 * @returns A DailyRotateFile transport configuration.
 */
const fileConfig = (logFileLevel: string, level: string, maxFiles: string) => {
  return new transports.DailyRotateFile({
    dirname: `${process.env.PROJECT_BACKEND_LOGS_DIR}`,
    filename: `combined_${logFileLevel}_%DATE%.log`,
    level,
    datePattern: 'DD-MM-YYYY',
    maxFiles,
    format: formats,
  });
};

const fileConfigHandlers = (logFileLevel: string, maxFiles: string) => {
  return new transports.DailyRotateFile({
    dirname: `${process.env.PROJECT_BACKEND_LOGS_DIR}`,
    filename: `combined_${logFileLevel}_%DATE%.log`,
    datePattern: 'DD-MM-YYYY',
    maxFiles,
  });
};

/**
 * Configuration object for Winston logger.
 *
 * @constant
 * @type {WinstonModuleOptions}
 *
 * @property {Object} levels - The logging levels to use.
 * @property {string} level - The logging level to use, determined by the environment.
 * @property {Array} transports - The transports to use for logging.
 * @property {Array} exceptionHandlers - The handlers to use for logging exceptions.
 * @property {Array} rejectionHandlers - The handlers to use for logging promise rejections.
 */
export const winstonConfig: WinstonModuleOptions = {
  levels: customLevels.levels,
  level: 'info',
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true, colors: customLevels.colors }),
        formats,
      ),
    }),
    fileConfig('error', 'error', '7d'),
    fileConfig('order', 'order', '20d'),
    fileConfig('trade', 'trade', '3d'),
    fileConfig('all', 'verbose', '3d'),
  ],
  exceptionHandlers: [fileConfigHandlers('exception', '7d')],
  rejectionHandlers: [fileConfigHandlers('rejections', '7d')],
};
