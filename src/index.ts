import { getBooleanInput, getInput } from '@actions/core'
import type { Log } from 'sarif'
import { promises as fs } from 'fs'
import { SlackWebhookBuilder } from './SlackWebhookBuilder'

async function run() {
  const webhookUrl: string = getInput('slack-webhook', { required: true, trimWhitespace: true })
  const sarifPath: string = getInput('sarif-path', { required: true, trimWhitespace: true })
  const color: string = getInput('color', { required: false, trimWhitespace: true })
  const header: string = getInput('header', { required: false, trimWhitespace: true })
  const includeHeader: boolean = getBooleanInput('include-header', { required: false })
  const footer: string = getInput('footer', { required: false, trimWhitespace: true })
  const includeFooter: boolean = getBooleanInput('include-footer', { required: false })
  const actor: string = getInput('actor', { required: false, trimWhitespace: true })
  const includeActor: boolean = getBooleanInput('include-actor', { required: false })
  const includeRun: boolean = getBooleanInput('include-run', { required: false })

  const jsonString: string = await fs.readFile(sarifPath, 'utf8')

  const webhookBuilder = new SlackWebhookBuilder(webhookUrl, {
    username: getInput('username', { required: false }),
    iconUrl: getInput('icon-url', { required: false }),
    sarif: JSON.parse(jsonString) as Log
  })
  if (includeHeader) {
    webhookBuilder.withHeader(header)
  }
  if (includeFooter) {
    webhookBuilder.withFooter(footer)
  }
  if (includeActor) {
    webhookBuilder.withActor(actor)
  }
  if (includeRun) {
    webhookBuilder.withRun()
  }
  const text: string = await webhookBuilder.send(color)
  console.log('Message sent:', text)
}

run()
