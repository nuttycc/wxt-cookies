import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

// Initialize prefix plugin
prefix.reg(log);

// Shared configuration for all loggers
const applyLoggerConfig = (logger: log.Logger, name?: string) => {
  prefix.apply(logger, {
    template: '🍪[%l] %n:',
    levelFormatter(level) {
      return level.toUpperCase();
    },
    nameFormatter() {
      return name || 'global';
    },
    timestampFormatter(date) {
      return date.toISOString();
    },
  });

  const isDev = import.meta.env.DEV;
  logger.setLevel(isDev ? log.levels.DEBUG : log.levels.WARN);
};

// Initialize default logger
applyLoggerConfig(log);

// Export a factory function to create loggers with custom namespaces
export function createLogger(name: string) {
  const logger = log.getLogger(name);
  applyLoggerConfig(logger, name);
  return logger;
}

// Export the default logger for backward compatibility
export default log;
