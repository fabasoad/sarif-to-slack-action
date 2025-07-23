import { LogLevel } from '@fabasoad/sarif-to-slack'

/**
 * Processes a log level string or number and converts it to a numeric log level.
 * @param logLevel
 * @returns The numeric log level corresponding to the input string or number,
 * or undefined if logLevel param is undefined.
 * @throws Error If the input string does not match any known log level.
 * @internal
 */
export function processLogLevel(logLevel?: string): LogLevel | undefined {
  if (!logLevel) {
    return undefined
  }
  switch (logLevel.toLowerCase()) {
    case 'silly':
      return LogLevel.Silly
    case 'trace':
      return LogLevel.Trace
    case 'debug':
      return LogLevel.Debug
    case 'info':
      return LogLevel.Info
    case 'warning':
      return LogLevel.Warning
    case 'error':
      return LogLevel.Error
    case 'fatal':
      return LogLevel.Fatal
    default:
      throw new Error(`Unknown log level: ${logLevel}`)
  }
}
