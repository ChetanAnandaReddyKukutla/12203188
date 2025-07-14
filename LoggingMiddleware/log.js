import tokenManager from './auth.js';

const LOGGING_API_URL = 'http://20.244.56.144/evaluation-service/logs';

// Default credentials - these should be configured per user
const DEFAULT_CREDENTIALS = {
  email: "student@example.com",
  name: "Student Name",
  rollNo: "123456789",
  accessCode: "ACCESS_CODE",
  clientID: "CLIENT_ID",
  clientSecret: "CLIENT_SECRET"
};

class Logger {
  constructor(credentials = DEFAULT_CREDENTIALS) {
    this.credentials = credentials;
    this.pendingLogs = [];
    this.isProcessing = false;
  }

  updateCredentials(newCredentials) {
    this.credentials = { ...this.credentials, ...newCredentials };
  }

  async log(stack, level, packageName, message) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      stack,
      level: level.toUpperCase(),
      package: packageName,
      message,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.pendingLogs.push(logEntry);
    
    if (!this.isProcessing) {
      await this.processPendingLogs();
    }
  }

  async processPendingLogs() {
    if (this.pendingLogs.length === 0 || this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const token = await tokenManager.getValidToken(this.credentials);
      
      while (this.pendingLogs.length > 0) {
        const logBatch = this.pendingLogs.splice(0, 10); // Process in batches
        
        await fetch(LOGGING_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            logs: logBatch,
            source: 'url-shortener-app',
            version: '1.0.0'
          }),
        });
      }
    } catch (error) {
      // Re-add failed logs to the beginning of the queue
      this.pendingLogs.unshift(...this.pendingLogs);
      
      // Fallback to console in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Logging failed, falling back to console:', error.message);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  // Convenience methods for different log levels
  info(stack, packageName, message) {
    return this.log(stack, 'INFO', packageName, message);
  }

  error(stack, packageName, message) {
    return this.log(stack, 'ERROR', packageName, message);
  }

  warn(stack, packageName, message) {
    return this.log(stack, 'WARN', packageName, message);
  }

  debug(stack, packageName, message) {
    return this.log(stack, 'DEBUG', packageName, message);
  }
}

// Create singleton instance
const logger = new Logger();

// Export the log function and logger instance
export const Log = (stack, level, packageName, message) => {
  return logger.log(stack, level, packageName, message);
};

export default logger;
