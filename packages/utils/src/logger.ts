export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: unknown;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function isLoggingEnabled(): boolean {
  if (typeof process === 'undefined') {
    return true;
  }

  return process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true';
}

function formatMessage(
  level: LogLevel,
  moduleName: string,
  operation: string,
  message: string,
  context?: LogContext,
): string {
  const prefix = `[${level}] [${moduleName}:${operation}] ${message}`;
  if (!context || Object.keys(context).length === 0) {
    return prefix;
  }

  return `${prefix} ${JSON.stringify(context)}`;
}

function writeLog(
  level: LogLevel,
  moduleName: string,
  operation: string,
  message: string,
  context?: LogContext,
): void {
  if (!isLoggingEnabled()) {
    return;
  }

  const formatted = formatMessage(level, moduleName, operation, message, context);

  try {
    switch (level) {
      case 'debug':
        console.debug(formatted);
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        break;
    }
  } catch {
    // Logging failures must never crash the application.
  }
}

export interface Logger {
  debug: (operation: string, message: string, context?: LogContext) => void;
  info: (operation: string, message: string, context?: LogContext) => void;
  warn: (operation: string, message: string, context?: LogContext) => void;
  error: (operation: string, message: string, context?: LogContext) => void;
}

function resolveMinLevel(): LogLevel {
  const configured = process.env.LOG_LEVEL;
  if (configured && configured in LOG_LEVEL_PRIORITY) {
    return configured as LogLevel;
  }

  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

export function createLogger(moduleName: string, minLevel?: LogLevel): Logger {
  const minPriority = LOG_LEVEL_PRIORITY[minLevel ?? resolveMinLevel()];

  const logAtLevel =
    (level: LogLevel) =>
    (operation: string, message: string, context?: LogContext): void => {
      if (LOG_LEVEL_PRIORITY[level] < minPriority) {
        return;
      }

      writeLog(level, moduleName, operation, message, context);
    };

  return {
    debug: logAtLevel('debug'),
    info: logAtLevel('info'),
    warn: logAtLevel('warn'),
    error: logAtLevel('error'),
  };
}
