import { getInput } from '@actions/core'
import { IncomingWebhook } from '@slack/webhook'
import { promises as fs } from 'fs'

async function run() {
  const webhookUrl = getInput('slack-webhook')
  const sarifPath = getInput('sarif-path')
  // const jsonString = await fs.readFile(sarifPath, 'utf8')
  // const sarif = JSON.parse(jsonString)
  const webhook = new IncomingWebhook(webhookUrl)
  const { text } = await webhook.send({
    text: 'Test'
  })
  console.log('Message sent:', text)
}

run()
