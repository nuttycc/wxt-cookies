import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

// Initialize prefix plugin
prefix.reg(log);
prefix.apply(log, {
  // template: '%t [%l] %n:',
  template: '🍪[%l] %n:',
  levelFormatter(level) {
    return level.toUpperCase();
  },
  nameFormatter(name) {
    return name || 'global';
  },
  timestampFormatter(date) {
    return date.toISOString();
  },
});

// Set log level based on environment
const isProduction = !import.meta.env.DEV;
log.setLevel(isProduction ? log.levels.WARN : log.levels.DEBUG);

export default log;
