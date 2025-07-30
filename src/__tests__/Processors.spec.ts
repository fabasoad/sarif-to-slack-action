import { processLogLevel } from '../Processors'
import { LogLevel } from '@fabasoad/sarif-to-slack'
import { InvalidEnumParameterError } from '../errors'

describe('processLogLevel', () => {
  test('returns 0 for silly', () => {
    expect(processLogLevel('silly')).toBe(LogLevel.Silly)
  })

  test('returns 1 for trace', () => {
    expect(processLogLevel('trace')).toBe(LogLevel.Trace)
  })

  test('returns 2 for debug', () => {
    expect(processLogLevel('debug')).toBe(LogLevel.Debug)
  })

  test('returns 3 for info', () => {
    expect(processLogLevel('info')).toBe(LogLevel.Info)
  })

  test('returns 4 for warning', () => {
    expect(processLogLevel('warning')).toBe(LogLevel.Warning)
  })

  test('returns 5 for error', () => {
    expect(processLogLevel('error')).toBe(LogLevel.Error)
  })

  test('returns 6 for fatal', () => {
    expect(processLogLevel('fatal')).toBe(LogLevel.Fatal)
  })

  test('is case-insensitive', () => {
    expect(processLogLevel('ERROR')).toBe(LogLevel.Error)
    expect(processLogLevel('Info')).toBe(LogLevel.Info)
    expect(processLogLevel('DeBuG')).toBe(LogLevel.Debug)
  })

  test('throws for unknown log level', () => {
    expect(() => processLogLevel('unknown')).toThrow(InvalidEnumParameterError)
  })
})
