import {
  LogLevel,
  RepresentationType,
  SarifFileExtension, SendIf
} from '@fabasoad/sarif-to-slack'
import {
  processLogLevel,
  processRepresentationType,
  processSarifExtension, processSendIf,
} from '../Processors'
import { InvalidEnumParameterError } from '../errors'

describe('processLogLevel', (): void => {
  test.each([
    [LogLevel.Silly, 'silly'],
    [LogLevel.Trace, 'trace'],
    [LogLevel.Debug, 'debug'],
    [LogLevel.Info, 'info'],
    [LogLevel.Warning, 'warning'],
    [LogLevel.Error, 'error'],
    [LogLevel.Fatal, 'fatal'],
  ])('returns %s for "%s"', (expected: LogLevel, logLevel: string): void => {
    expect(processLogLevel(logLevel)).toBe(expected)
  })

  test('is case-insensitive', (): void => {
    expect(processLogLevel('ERROR')).toBe(LogLevel.Error)
    expect(processLogLevel('Info')).toBe(LogLevel.Info)
    expect(processLogLevel('DeBuG')).toBe(LogLevel.Debug)
  })

  test('throws for unknown log level', (): void => {
    expect((): LogLevel => processLogLevel('unknown')).toThrow(InvalidEnumParameterError)
  })
})

describe('processSarifExtension', (): void => {
  test.each(['sarif', 'json'])('passes for "%s"', (ext: string): void => {
    expect(processSarifExtension(ext)).toBe(ext)
  })

  test.each(['SARIF', 'JSON'])('throws for "%s"', (ext: string): void => {
    expect((): SarifFileExtension => processSarifExtension(ext)).toThrow(InvalidEnumParameterError)
  })

  test('throws for unknown extension', (): void => {
    expect(
      (): SarifFileExtension => processSarifExtension('unknown')
    ).toThrow(InvalidEnumParameterError)
  })
})

describe('processRepresentationType', (): void => {
  test.each([
    [RepresentationType.CompactGroupByRunPerLevel, 'compact-group-by-run-per-level'],
    [RepresentationType.CompactGroupByRunPerSeverity, 'compact-group-by-run-per-severity'],
    [RepresentationType.CompactGroupByToolNamePerLevel, 'compact-group-by-tool-name-per-level'],
    [RepresentationType.CompactGroupByToolNamePerSeverity, 'compact-group-by-tool-name-per-severity'],
    [RepresentationType.CompactGroupBySarifPerLevel, 'compact-group-by-sarif-per-level'],
    [RepresentationType.CompactGroupBySarifPerSeverity, 'compact-group-by-sarif-per-severity'],
    [RepresentationType.CompactTotalPerLevel, 'compact-total-per-level'],
    [RepresentationType.CompactTotalPerSeverity, 'compact-total-per-severity'],
  ])('returns %s for "%s"', (expected: RepresentationType, representation: string): void => {
    expect(processRepresentationType(representation)).toBe(expected)
  })

  test('is case-insensitive', (): void => {
    expect(
      processRepresentationType('COMPACT-GROUP-BY-SARIF-PER-SEVERITY')
    ).toBe(RepresentationType.CompactGroupBySarifPerSeverity)
    expect(
      processRepresentationType('Compact-total-per-level')
    ).toBe(RepresentationType.CompactTotalPerLevel)
    expect(
      processRepresentationType('comPact-TOTAL-per-severity')
    ).toBe(RepresentationType.CompactTotalPerSeverity)
  })

  test('throws for unknown log level', (): void => {
    expect(
      (): RepresentationType => processRepresentationType('unknown')
    ).toThrow(InvalidEnumParameterError)
  })
})

describe('processSendIf', (): void => {
  test.each([
    [SendIf.SeverityCritical, 'severity-critical'],
    [SendIf.SeverityHigh, 'severity-high'],
    [SendIf.SeverityHighOrHigher, 'severity-high-or-higher'],
    [SendIf.SeverityMedium, 'severity-medium'],
    [SendIf.SeverityMediumOrHigher, 'severity-medium-or-higher'],
    [SendIf.SeverityLow, 'severity-low'],
    [SendIf.SeverityLowOrHigher, 'severity-low-or-higher'],
    [SendIf.SeverityNone, 'severity-none'],
    [SendIf.SeverityNoneOrHigher, 'severity-none-or-higher'],
    [SendIf.SeverityUnknown, 'severity-unknown'],
    [SendIf.SeverityUnknownOrHigher, 'severity-unknown-or-higher'],
    [SendIf.LevelError, 'level-error'],
    [SendIf.LevelWarning, 'level-warning'],
    [SendIf.LevelWarningOrHigher, 'level-warning-or-higher'],
    [SendIf.LevelNote, 'level-note'],
    [SendIf.LevelNoteOrHigher, 'level-note-or-higher'],
    [SendIf.LevelNone, 'level-none'],
    [SendIf.LevelNoneOrHigher, 'level-none-or-higher'],
    [SendIf.LevelUnknown, 'level-unknown'],
    [SendIf.LevelUnknownOrHigher, 'level-unknown-or-higher'],
    [SendIf.Always, 'always'],
    [SendIf.Some, 'some'],
    [SendIf.Empty, 'empty'],
    [SendIf.Never, 'never'],
  ])('returns %s for "%s"', (expected: SendIf, sendIf: string): void => {
    expect(processSendIf(sendIf)).toBe(expected)
  })

  test('is case-insensitive', (): void => {
    expect(processSendIf('Empty')).toBe(SendIf.Empty)
    expect(processSendIf('AlWaYs')).toBe(SendIf.Always)
    expect(processSendIf('NEVER')).toBe(SendIf.Never)
  })

  test('throws for unknown sendIf parameter', (): void => {
    expect((): SendIf => processSendIf('unknown')).toThrow(InvalidEnumParameterError)
  })
})
