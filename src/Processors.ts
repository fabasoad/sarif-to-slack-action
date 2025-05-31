import fs from 'fs'
import * as path from 'path'

export function processColor(color?: string): string | undefined {
  switch (color) {
    case 'success':
      return '#008000'
    case 'failure':
      return '#ff0000'
    case 'cancelled':
      return '#0047AB'
    case 'skipped':
      return '#808080'
    default:
      return color
  }
}

export function processSarifPath(sarifPath: string): string[] {
  if (!fs.existsSync(sarifPath)) {
    throw new Error(`Provided SARIF path does not exist: ${sarifPath}`)
  }

  const sarifStats: fs.Stats = fs.statSync(sarifPath)

  if (sarifStats.isDirectory()) {
    const files: string[] = fs.readdirSync(sarifPath)
    return files.filter((file: string) =>
      path.extname(file).toLowerCase() === '.sarif'
    ).map((file: string) => path.join(sarifPath, file))
  }

  if (sarifStats.isFile()) {
    return [sarifPath]
  }

  throw new Error(`Provided SARIF path is neither a file nor a directory: ${sarifPath}`)
}
