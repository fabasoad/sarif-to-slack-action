import { Logger, ILogObj } from 'tslog'

export type LoggerConfig = {
  logLevel?: number
}

export default class LoggerInstance {
  private static instance: Logger<ILogObj>
  private constructor() {}

  static initialize({ logLevel = 3 }: LoggerConfig): void {
    if (!LoggerInstance.instance) {
      LoggerInstance.instance = new Logger({
        // 0 - silly, 1 - trace, 2 - debug, 3 - info, 4 - warn, 5 - error, 6 - fatal
        minLevel: process.env.ACTIONS_STEP_DEBUG === 'true' ? 0 : logLevel,
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
