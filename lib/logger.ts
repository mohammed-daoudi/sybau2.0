import { NextRequest } from 'next/server';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: any;
  request?: {
    method: string;
    url: string;
    headers: { [key: string]: string };
  };
}

class Logger {
  private static formatLogEntry(entry: LogEntry): string {
    return JSON.stringify({
      ...entry,
      error: entry.error ? {
        message: entry.error.message,
        stack: entry.error.stack,
      } : undefined,
    }, null, 2);
  }

  static log(level: LogLevel, message: string, error?: any, req?: NextRequest) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error,
      request: req ? {
        method: req.method,
        url: req.url,
        headers: req.headers ? Object.fromEntries(req.headers) : {},
      } : undefined,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatLogEntry(entry));
    } else {
      // In production, you might want to send this to a logging service
      // For now, we'll use console.log, but you should replace this with
      // your preferred logging service (e.g., Sentry, LogRocket, etc.)
      console.log(this.formatLogEntry(entry));
    }
  }

  static info(message: string, data?: any, req?: NextRequest) {
    this.log('info', message, data, req);
  }

  static warn(message: string, error?: any, req?: NextRequest) {
    this.log('warn', message, error, req);
  }

  static error(message: string, error: any, req?: NextRequest) {
    this.log('error', message, error, req);
  }
}

export default Logger;