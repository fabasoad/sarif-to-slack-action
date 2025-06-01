import { getBooleanInput, getInput } from '@actions/core'
import type { Log } from 'sarif'
import { promises as fs } from 'fs'
import LoggerInstance from './lib/LoggerInstance'
import { processColor, processLogLevel, processSarifPath } from './Processors'
import { SlackMessageBuilder } from './SlackMessageBuilder'

async function run() {
  const webhookUrl: string = getInput('slack-webhook', { required: true, trimWhitespace: true })
  const sarifPath: string = getInput('sarif-path', { required: true, trimWhitespace: true })
  const logLevel: string = getInput('log-level', { required: false, trimWhitespace: true })
  const header: string = getInput('header', { required: false, trimWhitespace: true })
  const includeHeader: boolean = getBooleanInput('include-header', { required: false })
  const footer: string = getInput('footer', { required: false, trimWhitespace: true })
  const includeFooter: boolean = getBooleanInput('include-footer', { required: false })
  const actor: string = getInput('actor', { required: false, trimWhitespace: true })
  const includeActor: boolean = getBooleanInput('include-actor', { required: false })
  const includeRun: boolean = getBooleanInput('include-run', { required: false })

  LoggerInstance.initialize({ logLevel: processLogLevel(logLevel) })

  const sarifFiles: string[] = processSarifPath(sarifPath)
  if (sarifFiles.length === 0) {
    throw new Error(`No SARIF files found at the provided path: ${sarifPath}`)
  }

  for (const sarifFile of sarifFiles) {
    const jsonString: string = await fs.readFile(sarifFile, 'utf8')

    const messageBuilder = new SlackMessageBuilder(webhookUrl, {
      username: getInput('username', { required: false, trimWhitespace: true }),
      iconUrl: getInput('icon-url', { required: false, trimWhitespace: true }),
      color: processColor(getInput('color', { required: false, trimWhitespace: true })),
      sarif: JSON.parse(jsonString) as Log
    })
    if (includeHeader) {
      messageBuilder.withHeader(header)
    }
    if (includeFooter) {
      messageBuilder.withFooter(footer)
    }
    if (includeActor) {
      messageBuilder.withActor(actor)
    }
    if (includeRun) {
      messageBuilder.withRun()
    }
    const text: string = await messageBuilder.send()
    LoggerInstance.get().info(`Message sent for ${sarifFile} file. Status:`, text)
  }
}

run()
