import fs from 'fs'
import * as path from 'path'
import { ILogObj, Logger } from 'tslog'
import LoggerInstance from './lib/LoggerInstance'
const logger: Logger<ILogObj> = LoggerInstance.get()

export function processColor(color?: string): string | undefined {
  switch (color) {
    case 'success':
      logger.info(`Converting "${color}" to #008000`)
      return '#008000'
    case 'failure':
      logger.info(`Converting "${color}" to #ff0000`)
      return '#ff0000'
    case 'cancelled':
      logger.info(`Converting "${color}" to #0047ab`)
      return '#0047ab'
    case 'skipped':
      logger.info(`Converting "${color}" to #808080`)
      return '#808080'
    default:
      logger.info(`"${color}" color is not a CI status identifier. Returning as is...`)
      return color
  }
}

export function processLogLevel(logLevel: string): number {
  switch (logLevel.toLowerCase()) {
    case 'silly':
      return 0
    case 'trace':
      return 1
    case 'debug':
      return 2
    case 'info':
      return 3
    case 'warning':
      return 4
    case 'error':
      return 5
    case 'fatal':
      return 6
    default:
      throw new Error(`Unknown log level: ${logLevel}`)
  }
}

export function processSarifPath(sarifPath: string): string[] {
  if (!fs.existsSync(sarifPath)) {
    throw new Error(`"sarif-path" does not exist: ${sarifPath}`)
  }

  const sarifStats: fs.Stats = fs.statSync(sarifPath)

  if (sarifStats.isDirectory()) {
    logger.info(`"sarif-path" is a directory: ${sarifPath}`)
    const files: string[] = fs.readdirSync(sarifPath)
    const filteredFiles: string[] = files.filter((file: string) =>
      path.extname(file).toLowerCase() === '.sarif'
    ).map((file: string) => path.join(sarifPath, file))
    logger.info(`Found ${filteredFiles.length} SARIF files in directory: ${sarifPath}`)
    logger.debug(`Filtered SARIF files: ${filteredFiles.join(', ')}`)
    return filteredFiles
  }

  if (sarifStats.isFile()) {
    logger.info(`"sarif-path" is a file: ${sarifPath}`)
    return [sarifPath]
  }

  throw new Error(`"sarif-path" is neither a file nor a directory: ${sarifPath}`)
}
