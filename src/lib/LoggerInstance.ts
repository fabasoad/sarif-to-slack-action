import { Logger, ILogObj } from 'tslog'

export default class LoggerInstance {
  private static instance: Logger<ILogObj>
  private constructor(private config: { logLevel: number }) {}

  static initialize(config: { logLevel: number }): void {
    if (!LoggerInstance.instance) {
      LoggerInstance.instance = new Logger({
        // 0 - silly, 1 - trace, 2 - debug, 3 - info, 4 - warn, 5 - error, 6 - fatal
        minLevel: process.env.ACTIONS_STEP_DEBUG === 'true' ? 0 : config.logLevel,
      })
    }
  }

  static get(): Logger<ILogObj> {
    if (!LoggerInstance.instance) {
      throw new Error('Logger not initialized. Call Logger.initialize() first.')
    }
    return LoggerInstance.instance;
  }
}
