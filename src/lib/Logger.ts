import { Logger, ILogObj } from 'tslog'

const logger: Logger<ILogObj> = new Logger({
  // 0 - silly, 1 - trace, 2 - debug, 3 - info, 4 - warn, 5 - error, 6 - fatal
  minLevel: process.env.ACTIONS_STEP_DEBUG === 'true' ? 0 : 3,
})
export default logger
