// src/utils/logger.ts
/**
 * 统一日志工具
 * 生产环境自动禁用调试日志
 */

const isDev = process.env.NODE_ENV !== 'production';

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LoggerOptions {
  prefix?: string;
}

class Logger {
  private prefix: string;

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix || '[App]';
  }

  private formatMessage(level: LogLevel, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const formattedArgs = [`[${timestamp}] ${this.prefix}`, ...args];

    switch (level) {
      case 'log':
        if (isDev) console.log(...formattedArgs);
        break;
      case 'info':
        if (isDev) console.info(...formattedArgs);
        break;
      case 'warn':
        console.warn(...formattedArgs);
        break;
      case 'error':
        console.error(...formattedArgs);
        break;
      case 'debug':
        if (isDev) console.debug(...formattedArgs);
        break;
    }
  }

  log(...args: any[]): void {
    this.formatMessage('log', ...args);
  }

  info(...args: any[]): void {
    this.formatMessage('info', ...args);
  }

  warn(...args: any[]): void {
    this.formatMessage('warn', ...args);
  }

  error(...args: any[]): void {
    this.formatMessage('error', ...args);
  }

  debug(...args: any[]): void {
    this.formatMessage('debug', ...args);
  }
}

// 预定义的日志实例
export const logger = new Logger();
export const wsLogger = new Logger({ prefix: '[WebSocket]' });
export const apiLogger = new Logger({ prefix: '[API]' });

// 便捷函数
export const log = logger.log.bind(logger);
export const logInfo = logger.info.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logError = logger.error.bind(logger);
export const logDebug = logger.debug.bind(logger);

export default logger;
