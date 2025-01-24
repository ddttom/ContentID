// Logger service implementation
class Logger {
  constructor() {
    this.logLevels = {
      INFO: 'INFO',
      WARN: 'WARN',
      ERROR: 'ERROR'
    };
  }

  log(message, level = this.logLevels.INFO) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  info(message) {
    this.log(message, this.logLevels.INFO);
  }

  warn(message) {
    this.log(message, this.logLevels.WARN);
  }

  error(message) {
    this.log(message, this.logLevels.ERROR);
  }
}

// Export a singleton instance
export const logger = new Logger();
