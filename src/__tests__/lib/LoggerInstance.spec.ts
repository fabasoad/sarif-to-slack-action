import { ILogObj, Logger } from 'tslog'
import LoggerInstance from '../../lib/LoggerInstance'

describe('LoggerInstance', () => {
  afterEach(() => {
    // @ts-expect-error: allow resetting private static instance for tests
    LoggerInstance.instance = undefined
    delete process.env.ACTIONS_STEP_DEBUG
  })

  test('should throw if get() is called before initialize()', () => {
    expect(() => LoggerInstance.get()).toThrow('Logger not initialized. Call Logger.initialize() first.')
  })

  test('should initialize logger with provided logLevel', () => {
    LoggerInstance.initialize({ logLevel: 2 })
    const logger: Logger<ILogObj> = LoggerInstance.get()
    expect(logger).toBeInstanceOf(Logger)
    expect(logger.settings.minLevel).toBe(2)
  })

  test('should initialize logger with minLevel 0 if ACTIONS_STEP_DEBUG is true', () => {
    process.env.ACTIONS_STEP_DEBUG = 'true'
    LoggerInstance.initialize({ logLevel: 5 })
    const logger: Logger<ILogObj> = LoggerInstance.get()
    expect(logger.settings.minLevel).toBe(0)
  })

  test('should not re-initialize if already initialized', () => {
    LoggerInstance.initialize({ logLevel: 1 })
    const firstLogger: Logger<ILogObj> = LoggerInstance.get()
    LoggerInstance.initialize({ logLevel: 6 })
    const secondLogger: Logger<ILogObj> = LoggerInstance.get()
    expect(firstLogger).toBe(secondLogger)
    expect(secondLogger.settings.minLevel).toBe(1)
  })
})
