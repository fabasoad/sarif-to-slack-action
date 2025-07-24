import {
  CalculateResultsBy,
  GroupResultsBy,
  LogLevel
} from '@fabasoad/sarif-to-slack'
import { InvalidEnumParameterError } from './errors';

/**
 * Processes a log level string or number and converts it to a numeric log level.
 * @param logLevel
 * @returns The numeric log level corresponding to the input string or number,
 * or undefined if logLevel param is undefined.
 * @throws Error If the input string does not match any known log level.
 * @internal
 */
export function processLogLevel(logLevel: string): LogLevel {
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
      throw new InvalidEnumParameterError('log-level', ['silly', 'trace', 'debug', 'info', 'warning', 'error', 'fatal'])
  }
}

export function processGroupResultsBy(groupBy: string): GroupResultsBy {
  switch (groupBy.toLowerCase()) {
    case 'tool-name':
      return GroupResultsBy.ToolName
    case 'run':
      return GroupResultsBy.Run
    case 'total':
      return GroupResultsBy.Total
    default:
      throw new InvalidEnumParameterError('group-by', ['tool-name', 'run', 'total'])
  }
}

export function processCalculateResultsBy(calculateBy: string): CalculateResultsBy {
  switch (calculateBy.toLowerCase()) {
    case 'level':
      return CalculateResultsBy.Level
    case 'severity':
      return CalculateResultsBy.Severity
    default:
      throw new InvalidEnumParameterError('calculate-by', ['level', 'severity'])
  }
}
