/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';

/**
 * Logger service for logging messages with different levels of severity.
 */
@Injectable()
export default class Logger {
  /**
   * Creates an instance of Logger.
   * @param winstonLogger - The Winston logger instance.
   */
  constructor(@Inject('winston') private winstonLogger: WinstonLogger) {}

  /**
   * Creates a child logger with a trace identifier.
   * @param trace - The trace identifier.
   * @returns A WinstonLogger instance with the trace identifier.
   */
  logChild(trace: string): WinstonLogger {
    return this.winstonLogger.child({ trace });
  }

  /**
   * Extracts the caller function name from the error stack trace.
   * @param error - The error object.
   * @returns The caller function name in the format 'Class > method()'.
   */
  getTraceCallerName(error: Error): string {
    const match = error?.stack?.split('\n')[2].match(/at (\S+)/);
    if (match && match[1]) {
      return match[1].replace('.', ' > ') + '()';
    }
    return '';
  }

  /**
   * Logs the entry of a function call.
   * @returns The WinstonLogger instance with the log entry.
   */
  functionCaller(
    messages: { [key: string]: unknown },
    level: string = 'debug',
  ): WinstonLogger {
    let paramsString;
    if (Object.keys(messages).length !== 0) {
      paramsString = Object.entries(messages)
        .map(
          ([key, value]) => `\n--> ${key}: ${JSON.stringify(value, null, 2)}`,
        )
        .join(';\n-----------------');
    }

    return this.logChild(this.getTraceCallerName(new Error()))[level](
      `<< Entered${Object.keys(messages).length !== 0 ? `\n🚀 Input Parameters:${paramsString}` : ''}`,
    );
  }

  /**
   * Logs an informational message.
   * @param message - The message to log.
   * @returns The WinstonLogger instance with the log entry.
   */
  info(message: unknown): WinstonLogger {
    const messageString =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    return this.logChild(this.getTraceCallerName(new Error())).info(
      messageString,
    );
  }

  /**
   * Logs a debug message.
   * @param message - The message to log.
   * @returns The WinstonLogger instance with the log entry.
   */
  debug(message: unknown): WinstonLogger {
    const messageString =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    return this.logChild(this.getTraceCallerName(new Error())).debug(
      messageString,
    );
  }

  /**
   * Logs a warning message.
   * @param message - The message to log.
   * @returns The WinstonLogger instance with the log entry.
   */
  warn(message: unknown): WinstonLogger {
    const messageString =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    return this.logChild(this.getTraceCallerName(new Error())).warn(
      messageString,
    );
  }

  /**
   * Logs an error message.
   * @param message - The message to log.
   * @returns The WinstonLogger instance with the log entry.
   */
  error(message: unknown): WinstonLogger {
    const messageString =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    return this.logChild(this.getTraceCallerName(new Error())).error(
      messageString,
    );
  }

  /**
   * Logs an HTTP message.
   * @param message - The message to log.
   * @returns The WinstonLogger instance with the log entry.
   */
  http(message: unknown): WinstonLogger {
    const messageString =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    return this.logChild(this.getTraceCallerName(new Error())).http(
      messageString,
    );
  }

  /**
   * Logs an input message.
   * @param message - The message to log.
   * @returns The WinstonLogger instance with the log entry.
   */
  input(
    messages: { [key: string]: unknown },
    traceCallerName?: string,
  ): WinstonLogger {
    const paramsString = Object.entries(messages)
      .map(([key, value]) => `\n--> ${key}: ${JSON.stringify(value, null, 2)}`)
      .join(';\n-----------------');

    const trace = traceCallerName || this.getTraceCallerName(new Error());
    return this.logChild(trace).log(
      'input',
      `Input Parameters:${paramsString}`,
    );
  }

  /**
   * Logs a trade message.
   * @param message - The message to log.
   * @returns The WinstonLogger instance with the log entry.
   */
  trade(robot: string, message: unknown): WinstonLogger {
    const messageString =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    return this.logChild(this.getTraceCallerName(new Error())).log(
      'trade',
      `<${robot}> ${JSON.stringify(messageString, null, 2)}`,
    );
  }

  /**
   * Logs an order message.
   * @param message - The message to log.
   * @returns The WinstonLogger instance with the log entry.
   */
  order(robot: string, message: unknown): WinstonLogger {
    const messageString =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    return this.logChild(this.getTraceCallerName(new Error())).log(
      'order',
      `<${robot}> ${JSON.stringify(messageString, null, 2)}`,
    );
  }

  /**
   * Logs the result of a function call.
   * @param result - The result of the function call.
   */
  functionResult(result: unknown, level: string = 'debug') {
    const resultMessage =
      result && typeof result === 'object'
        ? JSON.stringify(result, null, 2)
        : String(result);
    return this.logChild(this.getTraceCallerName(new Error()))[level](
      `Exited >>\n🎯 Result: ${resultMessage}`,
    );
  }
}
