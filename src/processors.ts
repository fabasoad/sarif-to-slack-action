import {
  LogLevel,
  RepresentationType,
  SarifFileExtension,
  SendIf
} from '@fabasoad/sarif-to-slack'
import { InvalidEnumParameterError } from './errors'

/**
 * Processes a log level string or number and converts it to a numeric log level.
 * @param logLevel
 * @returns The numeric log level corresponding to the input string or number,
 * or undefined if logLevel param is undefined.
 * @throws Error If the input string does not match any known log level.
 * @internal
 */
export function processLogLevel(logLevel: string): LogLevel {
  const allowed = new Map<string, LogLevel>([
    ['silly', LogLevel.Silly],
    ['trace', LogLevel.Trace],
    ['debug', LogLevel.Debug],
    ['info', LogLevel.Info],
    ['warning', LogLevel.Warning],
    ['error', LogLevel.Error],
    ['fatal', LogLevel.Fatal],
  ])

  const result: LogLevel | undefined = allowed.get(logLevel.toLowerCase())
  if (result == null) {
    throw new InvalidEnumParameterError('log-level', Array.from(allowed.keys()))
  }
  return result
}

export function processSarifExtension(extension: string): SarifFileExtension {
  const allowed: string[] = ['sarif', 'json']
  if (allowed.includes(extension)) {
    return extension as SarifFileExtension
  }

  throw new InvalidEnumParameterError('sarif-file-extension', allowed)
}

export function processRepresentationType(representation: string): RepresentationType {
  const allowed = new Map<string, RepresentationType>([
    ['compact-group-by-run-per-level', RepresentationType.CompactGroupByRunPerLevel],
    ['compact-group-by-run-per-severity', RepresentationType.CompactGroupByRunPerSeverity],
    ['compact-group-by-tool-name-per-level', RepresentationType.CompactGroupByToolNamePerLevel],
    ['compact-group-by-tool-name-per-severity', RepresentationType.CompactGroupByToolNamePerSeverity],
    ['compact-group-by-sarif-per-level', RepresentationType.CompactGroupBySarifPerLevel],
    ['compact-group-by-sarif-per-severity', RepresentationType.CompactGroupBySarifPerSeverity],
    ['compact-total-per-level', RepresentationType.CompactTotalPerLevel],
    ['compact-total-per-severity', RepresentationType.CompactTotalPerSeverity],
  ])

  const result: RepresentationType | undefined = allowed.get(representation.toLowerCase())
  if (result == null) {
    throw new InvalidEnumParameterError('representation', Array.from(allowed.keys()))
  }
  return result
}

export function processSendIf(sendIf: string): SendIf {
  const allowed = new Map<string, SendIf>([
    ['severity-critical', SendIf.SeverityCritical],
    ['severity-high', SendIf.SeverityHigh],
    ['severity-high-or-higher', SendIf.SeverityHighOrHigher],
    ['severity-medium', SendIf.SeverityMedium],
    ['severity-medium-or-higher', SendIf.SeverityMediumOrHigher],
    ['severity-low', SendIf.SeverityLow],
    ['severity-low-or-higher', SendIf.SeverityLowOrHigher],
    ['severity-none', SendIf.SeverityNone],
    ['severity-none-or-higher', SendIf.SeverityNoneOrHigher],
    ['severity-unknown', SendIf.SeverityUnknown],
    ['severity-unknown-or-higher', SendIf.SeverityUnknownOrHigher],
    ['level-error', SendIf.LevelError],
    ['level-warning', SendIf.LevelWarning],
    ['level-warning-or-higher', SendIf.LevelWarningOrHigher],
    ['level-note', SendIf.LevelNote],
    ['level-note-or-higher', SendIf.LevelNoteOrHigher],
    ['level-none', SendIf.LevelNone],
    ['level-none-or-higher', SendIf.LevelNoneOrHigher],
    ['level-unknown', SendIf.LevelUnknown],
    ['level-unknown-or-higher', SendIf.LevelUnknownOrHigher],
    ['always', SendIf.Always],
    ['some', SendIf.Some],
    ['empty', SendIf.Empty],
    ['never', SendIf.Never],
  ])

  const result: SendIf | undefined = allowed.get(sendIf.toLowerCase())
  if (result == null) {
    throw new InvalidEnumParameterError('send-if', Array.from(allowed.keys()))
  }
  return result
}
